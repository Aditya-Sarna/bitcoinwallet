# SatVault — CRED-Style Bitcoin Wallet

## Original Problem Statement
"CREATE A FULLY FUNCTIONAL BITCOIN WALLET WITH ALL FEATURES DESIGNED LIKE CRED"
Iteration 2 feedback: match CRED design more closely, implement backup & security,
innovate with QR codes (they should tell a story), integrate cursive fonts.

## Architecture
- **Backend**: FastAPI + MongoDB (simulated BTC wallet; CoinGecko live price feed)
- **Frontend**: React + Tailwind + Framer Motion + Phosphor Icons + Recharts + custom SVG QR
- **Auth**: 6-digit PIN (SHA-256 hashed + salt)
- **Design**: Matte gold + deep black luxury · Clash Display + Italianno cursive accents

## What's Implemented (as of Apr 23, 2026)

### Iteration 1
- Backend endpoints: auth/register, auth/login, auth/logout, wallet/me, wallet/send, wallet/receive, wallet/transactions, market/price, market/chart, rewards/daily, rewards/claim, rewards/store, rewards/redeem, bills/pay
- Frontend pages: Onboarding, Lock, Home, Send, Receive, Transactions, Rewards, Store, Profile, Bills
- CoinGecko proxy with fallback synthetic data
- Bitcoin Score gauge (CRED-style credit score)
- Glass morphic floating bottom nav

### Iteration 2 (Current)
- **Backup & Security Flow**: 12-word seed phrase at registration, verify flow (shuffle + user reorders), biometric toggle, PIN change, security score (out of 100), dedicated `/security` + `/backup` pages
- **Innovative Story QR**: custom SVG with gold-gradient rounded dots, three shield-shaped finder corners, center gold emblem with user initial + "est. 2026" cursive, arc text wrapping around ("name's vault" / "member since 2026"), watch-dial tick marks
- **CRED-style Home redesign**: chip row (coins/gems/vouchers), lowercase greeting, gold card stack (3 overlapping cards with cursive name), backup-warning banner, teaser bento cards
- **Cursive typography** (Italianno) used on "twelve words.", "scan to gift.", "spend, lavishly.", "the tape", and accent callouts
- **Bottom nav expanded** to 5 tabs (home, rewards, store, vault, profile)
- **Hydration fix**: Promise.all wallet fetch; cached name in localStorage avoids "welcome, …" flicker
- **Security score loading** state avoids false "vulnerable" flash

## Test Coverage
- 37/37 backend pytest tests passing
- Frontend e2e validated via testing subagent: onboarding → backup → verify → home, security toggles, store, receive QR, profile

## Tech Debt / Backlog
### P1
- Notifications center (stub present on profile)
- Activity feed aggregation (send + receive + rewards + redemption unified)
- Mystery box gamification (currently toast "Coming soon")
- Scan-QR for sending (camera access)

### P2
- BIP39 compliant seed (currently random.choice from 64 words — duplicates possible; production must use random.sample from 2048-word list + entropy)
- Multi-wallet support
- Real testnet integration (BlockCypher)
- Push notifications
- Referral reward automation when friend signs up with code
- Rent payment flow (currently not in bill categories)

### P3
- Biometric flow actually using WebAuthn (currently mock toggle)
- Auto-lock timer UI
- Export transactions to CSV
- Fiat on-ramp integration (Stripe/MoonPay)

## Next Tasks
- If user asks: wire real WebAuthn for biometric, add scan-to-pay, add Mystery Box, improve chart with candlesticks.

## Known Constraints
- Simulated wallet — balances are demo-only, no real bitcoin movement
- CoinGecko public API has rate limits; fallback synthesizes points
- Seed phrase shown only once at registration (by design); /backup route after that is status-only
