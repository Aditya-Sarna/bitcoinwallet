from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import hashlib
import httpx
import random
import string
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Helpers ----------
def hash_pin(pin: str) -> str:
    return hashlib.sha256(f"satoshi::{pin}".encode()).hexdigest()

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def gen_btc_address() -> str:
    # Mock bech32-style BTC address
    chars = string.ascii_lowercase + string.digits
    return "bc1q" + "".join(random.choices(chars, k=38))

def gen_referral_code(name: str) -> str:
    return (name[:3].upper() if name else "BTC") + "".join(random.choices(string.digits, k=4))

def gen_txid() -> str:
    return "".join(random.choices("abcdef0123456789", k=64))

async def get_current_wallet(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.replace("Bearer ", "", 1)
    session = await db.sessions.find_one({"token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    wallet = await db.wallets.find_one({"id": session["wallet_id"]}, {"_id": 0, "pin_hash": 0, "seed_phrase": 0})
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet

# ---------- Models ----------
class RegisterBody(BaseModel):
    name: str
    pin: str
    referral_code: Optional[str] = None

class LoginBody(BaseModel):
    wallet_id: str
    pin: str

class SendBody(BaseModel):
    to_address: str
    amount_btc: float
    fee_tier: str = "average"  # slow, average, fast
    note: Optional[str] = None

class ReceiveBody(BaseModel):
    amount_btc: Optional[float] = None

class RedeemBody(BaseModel):
    item_id: str

class BillBody(BaseModel):
    biller: str
    account: str
    amount_usd: float

class VerifySeedBody(BaseModel):
    words: List[str]

class ChangePinBody(BaseModel):
    old_pin: str
    new_pin: str

# 64-word list for mock 12-word seed generation (BIP39-inspired)
SEED_WORDS = [
    "abandon", "ability", "abstract", "access", "acid", "acorn", "acoustic", "across",
    "action", "adapt", "advance", "alpha", "amber", "ancient", "angel", "anchor",
    "anvil", "apollo", "arcade", "arrow", "artisan", "atlas", "aurora", "beacon",
    "beyond", "blade", "bloom", "bolt", "bravo", "bridge", "bronze", "canyon",
    "cascade", "cedar", "cipher", "citadel", "comet", "crystal", "delta", "divine",
    "echo", "ember", "epoch", "essence", "falcon", "fortune", "galaxy", "golden",
    "harbor", "helix", "horizon", "ignite", "infinite", "jasper", "kinetic", "legacy",
    "luminous", "marble", "monarch", "nebula", "obsidian", "oracle", "phoenix", "zenith",
]

def generate_seed_phrase() -> List[str]:
    return [random.choice(SEED_WORDS) for _ in range(12)]

# ---------- Auth ----------
@api_router.post("/auth/register")
async def register(body: RegisterBody):
    if len(body.pin) < 4 or not body.pin.isdigit():
        raise HTTPException(status_code=400, detail="PIN must be at least 4 digits")
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="Name required")

    wallet_id = str(uuid.uuid4())
    seed_phrase = generate_seed_phrase()
    wallet = {
        "id": wallet_id,
        "name": body.name.strip(),
        "pin_hash": hash_pin(body.pin),
        "btc_address": gen_btc_address(),
        "balance_btc": 0.5,  # starting demo balance
        "coins": 25000,  # generous starter so user can explore the store
        "gems": 12,
        "vouchers": 0,
        "btc_score": 742,
        "streak": 1,
        "last_claim": None,
        "referral_code": gen_referral_code(body.name),
        "referred_by": body.referral_code,
        "seed_phrase": seed_phrase,
        "seed_backed_up": False,
        "biometric_enabled": False,
        "auto_lock_minutes": 5,
        "created_at": now_iso(),
    }
    await db.wallets.insert_one(wallet.copy())

    # Seed welcome transaction
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "wallet_id": wallet_id,
        "type": "received",
        "amount_btc": 0.5,
        "counterparty": "Emergent Treasury",
        "txid": gen_txid(),
        "status": "confirmed",
        "confirmations": 12,
        "fee_btc": 0.0,
        "note": "Welcome bonus",
        "created_at": now_iso(),
    })

    token = secrets.token_urlsafe(32)
    await db.sessions.insert_one({"token": token, "wallet_id": wallet_id, "created_at": now_iso()})

    return {
        "token": token,
        "wallet_id": wallet_id,
        "name": wallet["name"],
        "btc_address": wallet["btc_address"],
        "referral_code": wallet["referral_code"],
        "seed_phrase": seed_phrase,  # returned ONCE for user to backup
    }

@api_router.post("/auth/login")
async def login(body: LoginBody):
    wallet = await db.wallets.find_one({"id": body.wallet_id}, {"_id": 0})
    if not wallet or wallet["pin_hash"] != hash_pin(body.pin):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = secrets.token_urlsafe(32)
    await db.sessions.insert_one({"token": token, "wallet_id": wallet["id"], "created_at": now_iso()})
    return {"token": token, "wallet_id": wallet["id"], "name": wallet["name"]}

@api_router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "", 1)
        await db.sessions.delete_one({"token": token})
    return {"ok": True}

# ---------- Wallet ----------
@api_router.get("/wallet/me")
async def wallet_me(wallet=Depends(get_current_wallet)):
    return wallet

@api_router.post("/wallet/send")
async def wallet_send(body: SendBody, wallet=Depends(get_current_wallet)):
    if body.amount_btc <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    if not body.to_address or len(body.to_address) < 20:
        raise HTTPException(status_code=400, detail="Invalid address")

    fee_map = {"slow": 0.00002, "average": 0.00005, "fast": 0.00012}
    fee_btc = fee_map.get(body.fee_tier, 0.00005)
    total = body.amount_btc + fee_btc

    if total > wallet["balance_btc"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    new_balance = round(wallet["balance_btc"] - total, 8)
    # Reward coins: 1% of amount in fiat (approx). We'll add flat 50 coins per send as gamification.
    new_coins = wallet["coins"] + 50

    await db.wallets.update_one(
        {"id": wallet["id"]},
        {"$set": {"balance_btc": new_balance, "coins": new_coins}}
    )

    txn = {
        "id": str(uuid.uuid4()),
        "wallet_id": wallet["id"],
        "type": "sent",
        "amount_btc": body.amount_btc,
        "counterparty": body.to_address,
        "txid": gen_txid(),
        "status": "pending",
        "confirmations": 0,
        "fee_btc": fee_btc,
        "note": body.note or "",
        "created_at": now_iso(),
    }
    await db.transactions.insert_one(txn.copy())
    txn.pop("wallet_id", None)
    return {"ok": True, "transaction": txn, "new_balance": new_balance, "coins_earned": 50}

@api_router.post("/wallet/receive")
async def wallet_receive(body: ReceiveBody, wallet=Depends(get_current_wallet)):
    payload = {"address": wallet["btc_address"]}
    if body.amount_btc:
        payload["amount"] = body.amount_btc
        payload["uri"] = f"bitcoin:{wallet['btc_address']}?amount={body.amount_btc}"
    else:
        payload["uri"] = f"bitcoin:{wallet['btc_address']}"
    return payload

@api_router.get("/wallet/transactions")
async def list_transactions(wallet=Depends(get_current_wallet)):
    items = await db.transactions.find({"wallet_id": wallet["id"]}, {"_id": 0, "wallet_id": 0}).sort("created_at", -1).to_list(200)
    return {"items": items}

# ---------- Market (CoinGecko) ----------
@api_router.get("/market/price")
async def market_price():
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "bitcoin", "vs_currencies": "usd", "include_24hr_change": "true", "include_market_cap": "true"}
            )
            r.raise_for_status()
            data = r.json()["bitcoin"]
            return {
                "price_usd": data["usd"],
                "change_24h": data.get("usd_24h_change", 0),
                "market_cap": data.get("usd_market_cap", 0),
            }
    except Exception as e:
        logging.warning(f"CoinGecko error: {e}")
        # Fallback mock
        return {"price_usd": 67432.12, "change_24h": 2.14, "market_cap": 1_320_000_000_000}

@api_router.get("/market/chart")
async def market_chart(range_key: str = Query("24h", alias="range")):
    mapping = {"1h": 1, "24h": 1, "7d": 7, "30d": 30, "1y": 365}
    days = mapping.get(range_key, 1)
    try:
        async with httpx.AsyncClient(timeout=15) as c:
            r = await c.get(
                "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
                params={"vs_currency": "usd", "days": days}
            )
            r.raise_for_status()
            prices = r.json()["prices"]
            # For 1h, trim last hour slice
            if range_key == "1h":
                prices = prices[-60:] if len(prices) >= 60 else prices
            # Downsample large sets
            if len(prices) > 120:
                step = len(prices) // 120
                prices = prices[::step]
            return {"range": range_key, "points": [{"t": int(p[0]), "p": p[1]} for p in prices]}
    except Exception as e:
        logging.warning(f"CoinGecko chart error: {e}")
        # Fallback synthetic data
        base = 67000
        points = []
        now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
        for i in range(60):
            base += random.uniform(-300, 320)
            points.append({"t": now_ms - (60 - i) * 60000, "p": round(base, 2)})
        return {"range": range_key, "points": points}

# ---------- Rewards ----------
@api_router.get("/rewards/daily")
async def rewards_daily(wallet=Depends(get_current_wallet)):
    last = wallet.get("last_claim")
    can_claim = True
    if last:
        last_dt = datetime.fromisoformat(last)
        if datetime.now(timezone.utc) - last_dt < timedelta(hours=20):
            can_claim = False
    return {
        "can_claim": can_claim,
        "streak": wallet.get("streak", 0),
        "next_reward": 100 + (wallet.get("streak", 0) * 25),
        "coins": wallet.get("coins", 0),
    }

@api_router.post("/rewards/claim")
async def rewards_claim(wallet=Depends(get_current_wallet)):
    last = wallet.get("last_claim")
    if last:
        last_dt = datetime.fromisoformat(last)
        if datetime.now(timezone.utc) - last_dt < timedelta(hours=20):
            raise HTTPException(status_code=400, detail="Already claimed today")
    new_streak = wallet.get("streak", 0) + 1
    reward = 100 + (wallet.get("streak", 0) * 25)
    new_coins = wallet.get("coins", 0) + reward
    await db.wallets.update_one(
        {"id": wallet["id"]},
        {"$set": {"streak": new_streak, "last_claim": now_iso(), "coins": new_coins}}
    )
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "wallet_id": wallet["id"],
        "type": "reward",
        "amount_btc": 0,
        "counterparty": "Daily Streak",
        "txid": "",
        "status": "confirmed",
        "confirmations": 1,
        "fee_btc": 0,
        "note": f"+{reward} coins, Day {new_streak}",
        "created_at": now_iso(),
    })
    return {"reward": reward, "streak": new_streak, "coins": new_coins}

# Static rewards store catalog
STORE_ITEMS = [
    {"id": "amz-500", "brand": "Amazon", "title": "$5 Amazon Voucher", "cost": 2500, "category": "shopping", "color": "#FF9900"},
    {"id": "starb-250", "brand": "Starbucks", "title": "$2.5 Starbucks Card", "cost": 1200, "category": "food", "color": "#00704A"},
    {"id": "uber-100", "brand": "Uber", "title": "$10 Uber Credit", "cost": 5000, "category": "travel", "color": "#FFFFFF"},
    {"id": "dior-1000", "brand": "Dior", "title": "10% Dior Discount", "cost": 7500, "category": "luxury", "color": "#D4AF37"},
    {"id": "spot-year", "brand": "Spotify", "title": "1 Month Premium", "cost": 3000, "category": "entertainment", "color": "#1DB954"},
    {"id": "nike-2000", "brand": "Nike", "title": "$20 Nike Voucher", "cost": 9000, "category": "shopping", "color": "#FA8072"},
    {"id": "air-mile", "brand": "AirMiles", "title": "500 Air Miles", "cost": 12000, "category": "travel", "color": "#4A90E2"},
    {"id": "mystery", "brand": "Mystery Box", "title": "Mystery Gold Box", "cost": 4200, "category": "mystery", "color": "#D4AF37"},
]

@api_router.get("/rewards/store")
async def store(wallet=Depends(get_current_wallet)):
    return {"items": STORE_ITEMS, "coins": wallet.get("coins", 0)}

@api_router.post("/rewards/redeem")
async def redeem(body: RedeemBody, wallet=Depends(get_current_wallet)):
    item = next((i for i in STORE_ITEMS if i["id"] == body.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if wallet.get("coins", 0) < item["cost"]:
        raise HTTPException(status_code=400, detail="Insufficient coins")
    new_coins = wallet["coins"] - item["cost"]
    code = "".join(random.choices(string.ascii_uppercase + string.digits, k=12))
    await db.wallets.update_one({"id": wallet["id"]}, {"$set": {"coins": new_coins}})
    redemption = {
        "id": str(uuid.uuid4()),
        "wallet_id": wallet["id"],
        "item_id": item["id"],
        "brand": item["brand"],
        "title": item["title"],
        "code": code,
        "created_at": now_iso(),
    }
    await db.redemptions.insert_one(redemption.copy())
    redemption.pop("wallet_id", None)
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "wallet_id": wallet["id"],
        "type": "redeem",
        "amount_btc": 0,
        "counterparty": item["brand"],
        "txid": "",
        "status": "confirmed",
        "confirmations": 1,
        "fee_btc": 0,
        "note": f"-{item['cost']} coins · {item['title']}",
        "created_at": now_iso(),
    })
    return {"ok": True, "redemption": redemption, "coins": new_coins}

# ---------- Bill payment (mock) ----------
@api_router.post("/bills/pay")
async def bills_pay(body: BillBody, wallet=Depends(get_current_wallet)):
    # Convert fiat to BTC approx using current price
    price_resp = await market_price()
    price = price_resp["price_usd"]
    amount_btc = round(body.amount_usd / price, 8)
    if amount_btc > wallet["balance_btc"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    new_balance = round(wallet["balance_btc"] - amount_btc, 8)
    new_coins = wallet["coins"] + int(body.amount_usd * 10)  # 10 coins per $1
    await db.wallets.update_one(
        {"id": wallet["id"]},
        {"$set": {"balance_btc": new_balance, "coins": new_coins}}
    )
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "wallet_id": wallet["id"],
        "type": "bill",
        "amount_btc": amount_btc,
        "counterparty": f"{body.biller} · {body.account}",
        "txid": gen_txid(),
        "status": "confirmed",
        "confirmations": 1,
        "fee_btc": 0,
        "note": f"${body.amount_usd:.2f} bill payment",
        "created_at": now_iso(),
    })
    return {"ok": True, "amount_btc": amount_btc, "new_balance": new_balance}

# ---------- Security / Backup ----------
@api_router.get("/security/seed")
async def get_seed(authorization: Optional[str] = Header(None)):
    """Returns seed phrase ONCE if not yet backed up. After verification, it's inaccessible."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.replace("Bearer ", "", 1)
    session = await db.sessions.find_one({"token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    wallet = await db.wallets.find_one({"id": session["wallet_id"]}, {"_id": 0})
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if wallet.get("seed_backed_up"):
        raise HTTPException(status_code=400, detail="Already backed up. Phrase is locked for safety.")
    # Legacy wallets from iteration 1 may not have seed_phrase; generate one and persist
    seed = wallet.get("seed_phrase")
    if not seed:
        seed = generate_seed_phrase()
        await db.wallets.update_one({"id": wallet["id"]}, {"$set": {"seed_phrase": seed}})
    return {"seed_phrase": seed}

@api_router.get("/security/status")
async def security_status(wallet=Depends(get_current_wallet)):
    return {
        "seed_backed_up": wallet.get("seed_backed_up", False),
        "biometric_enabled": wallet.get("biometric_enabled", False),
        "auto_lock_minutes": wallet.get("auto_lock_minutes", 5),
        "security_score": (
            (60 if wallet.get("seed_backed_up") else 0)
            + (25 if wallet.get("biometric_enabled") else 0)
            + 15  # PIN always set
        ),
    }

@api_router.post("/security/seed/verify")
async def verify_seed(body: VerifySeedBody, authorization: Optional[str] = Header(None)):
    # Re-fetch wallet WITH seed_phrase
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.replace("Bearer ", "", 1)
    session = await db.sessions.find_one({"token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    wallet = await db.wallets.find_one({"id": session["wallet_id"]}, {"_id": 0})
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if wallet.get("seed_phrase") != body.words:
        raise HTTPException(status_code=400, detail="Seed phrase does not match")
    await db.wallets.update_one(
        {"id": wallet["id"]},
        {"$set": {"seed_backed_up": True, "coins": wallet.get("coins", 0) + 250}}
    )
    return {"ok": True, "bonus_coins": 250}

@api_router.post("/security/biometric/toggle")
async def toggle_biometric(wallet=Depends(get_current_wallet)):
    new_val = not wallet.get("biometric_enabled", False)
    await db.wallets.update_one({"id": wallet["id"]}, {"$set": {"biometric_enabled": new_val}})
    return {"biometric_enabled": new_val}

@api_router.post("/security/pin/change")
async def change_pin(body: ChangePinBody, authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.replace("Bearer ", "", 1)
    session = await db.sessions.find_one({"token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    wallet = await db.wallets.find_one({"id": session["wallet_id"]}, {"_id": 0})
    if not wallet or wallet["pin_hash"] != hash_pin(body.old_pin):
        raise HTTPException(status_code=401, detail="Incorrect current PIN")
    if len(body.new_pin) < 4 or not body.new_pin.isdigit():
        raise HTTPException(status_code=400, detail="New PIN must be at least 4 digits")
    await db.wallets.update_one({"id": wallet["id"]}, {"$set": {"pin_hash": hash_pin(body.new_pin)}})
    return {"ok": True}

# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"message": "Bitcoin wallet API", "time": now_iso()}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
