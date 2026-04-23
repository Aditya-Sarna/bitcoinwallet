"""Backend API tests for SatVault Bitcoin Wallet."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cred-btc-wallet.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def registered(session):
    """Register a fresh test wallet."""
    payload = {"name": "TEST_Emma", "pin": "123456"}
    r = session.post(f"{API}/auth/register", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data and "wallet_id" in data and "btc_address" in data and "referral_code" in data
    assert data["btc_address"].startswith("bc1q")
    return data


@pytest.fixture(scope="module")
def auth_headers(registered):
    return {"Authorization": f"Bearer {registered['token']}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Auth ----------
class TestAuth:
    def test_register_invalid_pin(self, session):
        r = session.post(f"{API}/auth/register", json={"name": "x", "pin": "abc"})
        assert r.status_code == 400

    def test_register_empty_name(self, session):
        r = session.post(f"{API}/auth/register", json={"name": "   ", "pin": "123456"})
        assert r.status_code == 400

    def test_login_wrong_pin(self, session, registered):
        r = session.post(f"{API}/auth/login", json={"wallet_id": registered["wallet_id"], "pin": "000000"})
        assert r.status_code == 401

    def test_login_correct_pin(self, session, registered):
        r = session.post(f"{API}/auth/login", json={"wallet_id": registered["wallet_id"], "pin": "123456"})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and data["wallet_id"] == registered["wallet_id"]

    def test_auth_required(self, session):
        r = session.get(f"{API}/wallet/me")
        assert r.status_code == 401


# ---------- Wallet ----------
class TestWallet:
    def test_wallet_me(self, session, auth_headers):
        r = session.get(f"{API}/wallet/me", headers=auth_headers)
        assert r.status_code == 200
        w = r.json()
        assert "pin_hash" not in w
        assert "_id" not in w
        assert w["balance_btc"] == 0.5
        assert w["coins"] == 1000
        assert w["btc_score"] == 742

    def test_receive(self, session, auth_headers):
        r = session.post(f"{API}/wallet/receive", json={"amount_btc": 0.01}, headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["address"].startswith("bc1q")
        assert d["uri"].startswith("bitcoin:")
        assert "amount=0.01" in d["uri"]

    def test_receive_no_amount(self, session, auth_headers):
        r = session.post(f"{API}/wallet/receive", json={}, headers=auth_headers)
        assert r.status_code == 200
        assert "amount" not in r.json()

    def test_send_invalid_amount(self, session, auth_headers):
        r = session.post(f"{API}/wallet/send", json={"to_address": "bc1q" + "x" * 30, "amount_btc": 0}, headers=auth_headers)
        assert r.status_code == 400

    def test_send_invalid_address(self, session, auth_headers):
        r = session.post(f"{API}/wallet/send", json={"to_address": "short", "amount_btc": 0.001}, headers=auth_headers)
        assert r.status_code == 400

    def test_send_insufficient(self, session, auth_headers):
        r = session.post(f"{API}/wallet/send", json={"to_address": "bc1q" + "x" * 30, "amount_btc": 100}, headers=auth_headers)
        assert r.status_code == 400

    def test_send_success_and_persist(self, session, auth_headers):
        addr = "bc1q" + "a" * 34
        r = session.post(f"{API}/wallet/send", json={"to_address": addr, "amount_btc": 0.01, "fee_tier": "average"}, headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] is True
        assert d["coins_earned"] == 50
        assert d["new_balance"] < 0.5
        # Verify persistence via /wallet/me
        r2 = session.get(f"{API}/wallet/me", headers=auth_headers)
        assert r2.json()["balance_btc"] == d["new_balance"]
        assert r2.json()["coins"] == 1050

    def test_transactions_list(self, session, auth_headers):
        r = session.get(f"{API}/wallet/transactions", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()["items"]
        assert len(items) >= 2  # welcome + send
        for t in items:
            assert "_id" not in t
            assert "wallet_id" not in t


# ---------- Market ----------
class TestMarket:
    def test_price(self, session):
        r = session.get(f"{API}/market/price")
        assert r.status_code == 200
        d = r.json()
        assert "price_usd" in d and "change_24h" in d
        assert isinstance(d["price_usd"], (int, float)) and d["price_usd"] > 0

    @pytest.mark.parametrize("rng", ["1h", "24h", "7d", "30d", "1y"])
    def test_chart(self, session, rng):
        r = session.get(f"{API}/market/chart", params={"range": rng})
        assert r.status_code == 200
        d = r.json()
        assert d["range"] == rng
        assert isinstance(d["points"], list) and len(d["points"]) > 0
        assert "t" in d["points"][0] and "p" in d["points"][0]


# ---------- Rewards ----------
class TestRewards:
    def test_daily_initial(self, session, auth_headers):
        r = session.get(f"{API}/rewards/daily", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["can_claim"] is True
        assert "streak" in d and "next_reward" in d and "coins" in d

    def test_claim_and_duplicate(self, session, auth_headers):
        r = session.post(f"{API}/rewards/claim", headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["reward"] >= 100
        # Second immediate claim
        r2 = session.post(f"{API}/rewards/claim", headers=auth_headers)
        assert r2.status_code == 400

    def test_daily_after_claim(self, session, auth_headers):
        r = session.get(f"{API}/rewards/daily", headers=auth_headers)
        assert r.json()["can_claim"] is False

    def test_store_list(self, session, auth_headers):
        r = session.get(f"{API}/rewards/store", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d["items"], list) and len(d["items"]) > 0
        assert "coins" in d

    def test_redeem_insufficient(self, session, auth_headers):
        r = session.post(f"{API}/rewards/redeem", json={"item_id": "air-mile"}, headers=auth_headers)
        assert r.status_code == 400  # 12000 > wallet coins

    def test_redeem_success(self, session, auth_headers):
        # Boost coins via a bill payment so 1200-cost voucher is affordable
        session.post(f"{API}/bills/pay", json={"biller": "Prep", "account": "X", "amount_usd": 5.0}, headers=auth_headers)
        r = session.post(f"{API}/rewards/redeem", json={"item_id": "starb-250"}, headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "redemption" in d and len(d["redemption"]["code"]) == 12
        assert "wallet_id" not in d["redemption"]

    def test_redeem_invalid_item(self, session, auth_headers):
        r = session.post(f"{API}/rewards/redeem", json={"item_id": "fake-item"}, headers=auth_headers)
        assert r.status_code == 404


# ---------- Bills ----------
class TestBills:
    def test_bill_pay(self, session, auth_headers):
        r = session.post(f"{API}/bills/pay", json={"biller": "Electric", "account": "A-123", "amount_usd": 10.0}, headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] is True and d["amount_btc"] > 0

    def test_bill_insufficient(self, session, auth_headers):
        r = session.post(f"{API}/bills/pay", json={"biller": "X", "account": "Y", "amount_usd": 10_000_000}, headers=auth_headers)
        assert r.status_code == 400
