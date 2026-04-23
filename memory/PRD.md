# NOVA — Product Requirements Document

## Original problem statement
Build a fully functional simulated Bitcoin wallet designed in the CRED style, with:
- PIN-based mock authentication
- Live CoinGecko prices via backend proxy
- Rewards (coins, gems, store/vouchers)
- Send / Receive functionality with custom QR codes
- Backup (12-word seed phrase) + verify flow
- Security features (score, biometric toggle)
- Highly stylized vibrant CRED aesthetic + non-Bitcoin-related custom logo

## Brand
- **Name:** NOVA (custom, non-Bitcoin-related)
- **Logo:** diamond prism with spark seam — `components/Logo.jsx`
- **Tagline:** "your bitcoin on steroids"

## Design system
- **Palette (electric):** lime `#D4FF4F`, hot pink `#FF3E8A`, indigo `#6B5CFC`, cyan `#34D8FF`, orange `#FF7A3A`
- **Ink/bg tokens:** CSS vars `--bg`, `--ink`, `--ink-2`, `--ink-3`, `--surface`, `--surface-border` — swap between dark (`#0A0A0F`) and light (`#F5F2EA`) themes
- **Fonts:** Clash Display (display), Manrope (body), Space Grotesk (mono), Italianno (cursive accent)
- **Themes:** dark (default) + light — toggled via `components/ThemeToggle.jsx`, persisted to `localStorage.nova_theme`
- **Hero:** abstract editorial artpiece (organic blob + sun disc + orbital rings + large floating typography + cursive annotations) — `components/AbstractBalanceArt.jsx`

## Implemented features (all PASS, iteration_4)
### Backend (FastAPI + MongoDB)
- `POST /api/auth/register` — creates wallet, returns token + seed_phrase
- `POST /api/auth/login` — PIN-based login
- `GET /api/wallet/me` — balance, coins, gems, vouchers, btc_score, streak
- `GET /api/wallet/transactions` — transaction history
- `POST /api/wallet/send` — send BTC + earn coins
- `GET /api/market/price` + `GET /api/market/chart?range=…` — CoinGecko proxy
- `GET /api/security/status`, `GET /api/security/seed`, `POST /api/security/seed/verify`, `POST /api/security/biometric/toggle`
- `GET /api/rewards/store`, `GET /api/rewards/daily`, `POST /api/rewards/claim`, `POST /api/rewards/redeem`
- `POST /api/bills/pay`

### Frontend (React)
- **Onboarding** (4 steps): welcome hero → 3 promises → name → 6-digit PIN → confirm → auto-create wallet → backup seed
- **Lock** (PIN unlock)
- **Home**: abstract balance artpiece, 4 action buttons (scan/send/receive/history), backup banner, vibrant splash cards, live price chart, Bitcoin score, recent activity
- **Send**: address + amount + fee tier + AmountWheel preset + PIN → Success with PaymentOrbit animation
- **Receive**: custom styled QR (lime/pink/indigo gradient) with center emblem, copy/share
- **Scan**: simulated viewfinder with corner brackets + manual paste
- **Rewards**: coin balance, streak, bento splash cards, how-to-earn list
- **Store** + **StoreItem**: category filters, voucher card design, redeem → Success
- **Profile**: cursive vault-of label, referral card, settings list, sign-out, theme toggle
- **Security**: lime score hero, recovery phrase, biometric toggle, change PIN
- **Backup**: view 12 words → shuffle-and-verify → Success
- **Bills**: biller grid + account + amount → Success
- **Transactions**: all/sent/received/rewards filters
- **Success**: PaymentOrbit for payments, radial medallion for claims/backups/redeems, receipt lines, CTA

## Architecture
```
/app/
├── backend/
│   ├── server.py            # FastAPI routes
│   ├── requirements.txt
│   ├── .env
│   └── tests/test_wallet_api.py
├── frontend/
│   ├── src/
│   │   ├── App.js           # Routes + ThemeProvider
│   │   ├── App.css          # .App uses var(--bg)
│   │   ├── index.css        # Theme vars + light/dark overrides
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   ├── format.js
│   │   │   └── theme.jsx    # ThemeProvider + useTheme
│   │   ├── components/
│   │   │   ├── AbstractBalanceArt.jsx   # NEW — editorial hero
│   │   │   ├── ThemeToggle.jsx          # NEW — sun/moon
│   │   │   ├── Logo.jsx                 # NOVA diamond-prism
│   │   │   ├── Illustrations.jsx        # TreasureChest, GiftStack, BillEnvelope, ProductShelf, LaptopPrize
│   │   │   ├── SplashCard.jsx           # Vibrant CRED-style card
│   │   │   ├── ColorCardStack.jsx       # (legacy, unused on home now)
│   │   │   ├── Shell.jsx, Header.jsx, BottomNav.jsx
│   │   │   ├── PinPad.jsx, AmountWheel.jsx, StyledQR.jsx
│   │   │   ├── PriceChart.jsx, BitcoinScore.jsx, BalanceStatRow.jsx, TxnItem.jsx
│   │   │   ├── PaymentOrbit.jsx, Confetti.jsx
│   │   │   └── Ornaments.jsx            # (legacy, unused)
│   │   └── pages/ (Home, Onboarding, Lock, Send, Receive, Scan, Success, Store, StoreItem, Profile, Rewards, Bills, Backup, Security, Transactions)
└── memory/PRD.md
```

## DB schema
- `wallets`: wallet_id, pin_hash, seed_phrase, balance_btc, btc_address, btc_score, coins, gems, vouchers, streak, biometric_enabled, seed_backed_up, referral_code, created_at
- `transactions`: id, wallet_id, type (sent|received|reward|redeem|bill), amount_btc, counterparty, status, created_at, note
- `rewards`: wallet_id, daily_streak, last_claim_date, history

## Roadmap (backlog)
- P1: Biometric-toggle data-testid on inner button for test agents
- P1: Mystery-box spin animation (currently "coming soon" toast)
- P2: Notifications panel
- P2: Help center content
- P2: Change-PIN flow (currently "coming soon")
- P3: Multi-session / multi-device demo mode
- P3: Export transactions as CSV
