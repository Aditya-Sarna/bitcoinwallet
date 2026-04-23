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
    # NEW: seed_phrase must be returned once on register
    assert "seed_phrase" in data
    assert isinstance(data["seed_phrase"], list) and len(data["seed_phrase"]) == 12
    assert all(isinstance(w, str) and len(w) > 0 for w in data["seed_phrase"])
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

    def test_register_returns_25k_coins_and_12_gems(self, session):
        """Iteration 4: new wallets start with 25,000 coins and 12 gems."""
        r = session.post(f"{API}/auth/register", json={"name": "TEST_Iter4Starter", "pin": "445566"})
        assert r.status_code == 200, r.text
        data = r.json()
        headers = {"Authorization": f"Bearer {data['token']}", "Content-Type": "application/json"}
        me = session.get(f"{API}/wallet/me", headers=headers).json()
        assert me["coins"] == 25000, f"Expected 25000, got {me['coins']}"
        assert me["gems"] == 12, f"Expected 12 gems, got {me['gems']}"
        assert me["vouchers"] == 0
        assert me["balance_btc"] == 0.5


# ---------- Wallet ----------
class TestWallet:
    def test_wallet_me(self, session, auth_headers):
        r = session.get(f"{API}/wallet/me", headers=auth_headers)
        assert r.status_code == 200
        w = r.json()
        assert "pin_hash" not in w
        assert "_id" not in w
        assert w["balance_btc"] == 0.5
        assert w["coins"] == 25000
        assert w["btc_score"] == 742
        assert w["gems"] == 12
        # NEW: sensitive fields must never leak
        assert "seed_phrase" not in w
        assert "pin_hash" not in w

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
        assert r2.json()["coins"] == 25050

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
        # With 25k starter coins, 12000 air-mile is now affordable. Create a fresh wallet for true 'insufficient' test.
        fresh = requests.Session()
        fresh.headers.update({"Content-Type": "application/json"})
        reg = fresh.post(f"{API}/auth/register", json={"name": "TEST_Broke", "pin": "000000"}, timeout=15).json()
        h = {"Authorization": f"Bearer {reg['token']}", "Content-Type": "application/json"}
        # Redeem two large items to drain below 12000
        fresh.post(f"{API}/rewards/redeem", json={"item_id": "nike-2000"}, headers=h)  # -9000 → 16000
        fresh.post(f"{API}/rewards/redeem", json={"item_id": "dior-1000"}, headers=h)  # -7500 → 8500
        r2 = fresh.post(f"{API}/rewards/redeem", json={"item_id": "air-mile"}, headers=h)  # 12000 > 8500
        assert r2.status_code == 400

    def test_redeem_success(self, session, auth_headers):
        # 25k starter already covers 1200-cost starb-250 without any top-up
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


# ---------- Security / Backup (NEW) ----------
class TestSecurity:
    """Fresh wallet per test class for independent security flow."""

    @pytest.fixture(scope="class")
    def sec_wallet(self):
        s = requests.Session()
        s.headers.update({"Content-Type": "application/json"})
        r = s.post(f"{API}/auth/register", json={"name": "TEST_Sec", "pin": "112233"}, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        headers = {"Authorization": f"Bearer {data['token']}", "Content-Type": "application/json"}
        return {"session": s, "data": data, "headers": headers}

    def test_status_initial(self, sec_wallet):
        r = sec_wallet["session"].get(f"{API}/security/status", headers=sec_wallet["headers"])
        assert r.status_code == 200
        d = r.json()
        assert d["seed_backed_up"] is False
        assert d["biometric_enabled"] is False
        assert d["auto_lock_minutes"] == 5
        # PIN always 15 => only base score present
        assert d["security_score"] == 15

    def test_verify_seed_wrong_words(self, sec_wallet):
        r = sec_wallet["session"].post(
            f"{API}/security/seed/verify",
            json={"words": ["wrong"] * 12},
            headers=sec_wallet["headers"],
        )
        assert r.status_code == 400

    def test_verify_seed_correct(self, sec_wallet):
        seed = sec_wallet["data"]["seed_phrase"]
        r = sec_wallet["session"].post(
            f"{API}/security/seed/verify",
            json={"words": seed},
            headers=sec_wallet["headers"],
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] is True and d["bonus_coins"] == 250
        # Status reflects backed up now + coins increased
        status = sec_wallet["session"].get(f"{API}/security/status", headers=sec_wallet["headers"]).json()
        assert status["seed_backed_up"] is True
        assert status["security_score"] == 75  # 60 + 15
        me = sec_wallet["session"].get(f"{API}/wallet/me", headers=sec_wallet["headers"]).json()
        assert me["coins"] == 25250

    def test_biometric_toggle(self, sec_wallet):
        r = sec_wallet["session"].post(f"{API}/security/biometric/toggle", headers=sec_wallet["headers"])
        assert r.status_code == 200
        assert r.json()["biometric_enabled"] is True
        status = sec_wallet["session"].get(f"{API}/security/status", headers=sec_wallet["headers"]).json()
        assert status["biometric_enabled"] is True
        assert status["security_score"] == 100  # 60 + 25 + 15
        # Toggle back
        r2 = sec_wallet["session"].post(f"{API}/security/biometric/toggle", headers=sec_wallet["headers"])
        assert r2.json()["biometric_enabled"] is False

    def test_change_pin_wrong_old(self, sec_wallet):
        r = sec_wallet["session"].post(
            f"{API}/security/pin/change",
            json={"old_pin": "000000", "new_pin": "445566"},
            headers=sec_wallet["headers"],
        )
        assert r.status_code == 401

    def test_change_pin_success_and_login(self, sec_wallet):
        r = sec_wallet["session"].post(
            f"{API}/security/pin/change",
            json={"old_pin": "112233", "new_pin": "445566"},
            headers=sec_wallet["headers"],
        )
        assert r.status_code == 200, r.text
        # Old PIN should now fail
        r_old = sec_wallet["session"].post(
            f"{API}/auth/login",
            json={"wallet_id": sec_wallet["data"]["wallet_id"], "pin": "112233"},
        )
        assert r_old.status_code == 401
        # New PIN should succeed
        r_new = sec_wallet["session"].post(
            f"{API}/auth/login",
            json={"wallet_id": sec_wallet["data"]["wallet_id"], "pin": "445566"},
        )
        assert r_new.status_code == 200

    def test_change_pin_short(self, sec_wallet):
        r = sec_wallet["session"].post(
            f"{API}/security/pin/change",
            json={"old_pin": "445566", "new_pin": "12"},
            headers=sec_wallet["headers"],
        )
        assert r.status_code == 400

    def test_security_requires_auth(self, session):
        r = session.get(f"{API}/security/status")
        assert r.status_code == 401


# ---------- GET /api/security/seed (iteration 3) ----------
class TestGetSeed:
    @pytest.fixture(scope="class")
    def seed_wallet(self):
        s = requests.Session()
        s.headers.update({"Content-Type": "application/json"})
        r = s.post(f"{API}/auth/register", json={"name": "TEST_SeedGet", "pin": "778899"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        headers = {"Authorization": f"Bearer {data['token']}", "Content-Type": "application/json"}
        return {"session": s, "data": data, "headers": headers}

    def test_get_seed_returns_phrase(self, seed_wallet):
        r = seed_wallet["session"].get(f"{API}/security/seed", headers=seed_wallet["headers"])
        assert r.status_code == 200, r.text
        d = r.json()
        assert "seed_phrase" in d
        assert isinstance(d["seed_phrase"], list) and len(d["seed_phrase"]) == 12
        # Must match the seed returned at register time
        assert d["seed_phrase"] == seed_wallet["data"]["seed_phrase"]

    def test_get_seed_requires_auth(self, session):
        r = session.get(f"{API}/security/seed")
        assert r.status_code == 401

    def test_get_seed_blocked_after_backup(self, seed_wallet):
        # Verify seed (marks backed up)
        seed = seed_wallet["data"]["seed_phrase"]
        r_v = seed_wallet["session"].post(
            f"{API}/security/seed/verify", json={"words": seed}, headers=seed_wallet["headers"]
        )
        assert r_v.status_code == 200
        # Now GET should return 400
        r = seed_wallet["session"].get(f"{API}/security/seed", headers=seed_wallet["headers"])
        assert r.status_code == 400
