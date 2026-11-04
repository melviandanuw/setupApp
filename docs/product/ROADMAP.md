# ROADMAP — Wenits.fun
Status: Official v1.0 | Date: 2026-11-03 | Depends: PRODUCT_VISION.md, PRODUCT_STRATEGY.md | Source: Co Founder copy (locked)
Strategic direction and upcoming milestones (November 2026 – January 2027). Not a delivery promise.
Supersedes: all prior drafts (v0.1–v0.5).

# Wenits.fun — Official Roadmap

## Phase 1: The Genesis & $WenFUN Launch (November 2026)

- **Moon Radar & Degen Arena:** Discover trending tokens with real-time data and practice trading in a completely risk-free environment. Jump in instantly via Practice Mode with no login required.
- **Safety First:** Integration of our proprietary Moon Score and Safety Gate. Suspicious or highly volatile tokens are explicitly flagged as HIGH RISK and blocked from the arena.
- **$WenFUN Token Launch:** A 100% fair launch on pump.fun with zero presale and no team buy-ins before the public block. The arena remains entirely free-to-play. All creator fees flow into a transparent public treasury to fund infrastructure, platform growth, and community prizes.

## Phase 2: The Arena Seasons (December 1 – 20, 2026)

- **Weekly Leagues:** 7-day competitive seasons where rankings are determined by consistent portfolio growth and risk management, not single lucky trades.
- **Earn Your Rank:** Top performers earn Gold, Silver, and Bronze Degen badges and are immortalized in the platform's Hall of Fame.
- **Fair Play Enforced:** Strict anti-Sybil protections, bot-flagging, and manual reviews guarantee a level playing field for all reward claims and sponsor prizes.

## Phase 3: Proof of Skill & NFT Utilities (December 21, 2026 – January 31, 2027)

- **Soulbound Achievements:** Season finalists receive exclusive, non-transferable NFTs as definitive, on-chain proof of their trading acumen.
- **Elite Unlocks:** NFT holders gain access to exclusive holder leagues, platform fee perks, and voting rights for new coin listings.
- **Sustainable Growth:** No speculative profile pictures or fake APYs — our NFTs represent earned reputation and real platform utility.

---

# Internal appendix (PM/DEV only — not public copy)

## Phase 1 exit gate & ops
- Exit gate: 100 test users, week-2 retention >20%, zero double-spends, trade rejections only on stale price, $WenFUN live on pump.fun with creator fees flowing to the published treasury.
- Already built: price updater (`jobs/price-writer.js`), pool registry (`lib/mints.js`), leaderboard settlement (`jobs/settle-board.js`), season badges. Still to build: Safety Gate + Moon Score v2 (spec `docs/specs/ARENA_GMGN_SPEC.md` v0.2, awaiting lock), wallet connect, first live settlement run (needs DB admin credentials), token launch + creator-fee wallet setup.
- Token launch mechanics: pump.fun create fee $0, creator earns 0.30% of bonding-curve volume, graduation 0.015 SOL. Cost: gas/rent under $5. A launch is irreversible — price, holders, and reputation are permanent; snipers buy in the first minutes. Do not launch before the treasury wallet is set and the arena runs independently of the token.
- Monthly cost: $0–15 + token gas.

## Phase 2 ops
- Season schedule: S1 Dec 1–7, S2 Dec 8–14, S3 Dec 15–20 (short season to test the format). Reward sheet: week | player | trades | equity | rank | badge | bot flag | spotlight status (`docs/product/REWARD_BATCH1.md`).
- Exit gate: 2+ seasons done, 300 total participants, one-page sponsor report.
- Anti-abuse numbers: one account per wallet/IP/day, flag above 50 trades/day, manual review before payout. Cost: $0–30/month + sponsor prizes.

## Phase 3 ops
- Metaplex standard, cheap Solana mint, offchain metadata. Mainnet waits for 500 MAU — testnet first. Qualification: manually verified ranks (5+ trades, bot-flag cleared), 1 NFT per player per season, non-transferable until founder decides.
- Exit gate: 1 testnet collection, 1 small mainnet drop, utility doc + legal note. Cost: <$100 mint + RPC.

## Rules between phases
The next phase does not start until the current phase passes its exit gate and PM docs are updated. If retention fails, repeat the current phase — never add scope. After launch, $WenFUN stays frozen as a team asset: no team sells, no token gating, holder league waits for 500 MAU + legal review.

## Build notes for DEV (technical names, not public copy)
Public naming: Moon Radar (`/radar`), Degen Arena (`/arena`), Moon Score, HIGH RISK, Safety Gate, Hall of Fame, Practice Mode. UI strings follow `docs/product/UI_COPY.md`; this doc stays the single source of phase truth.
Technical owners: pool registry `services/api/src/lib/mints.js`, price updater `services/api/src/jobs/price-writer.js` (60s), settlement `services/api/src/jobs/settle-board.js` (Mon 00:00 UTC), price cache `px:*`, Safety Gate + Moon Score v2 `docs/specs/ARENA_GMGN_SPEC.md` v0.2, season rewards `docs/product/REWARD_BATCH1.md`.

## PM follow-ups
1. Phase PRDs: `docs/product/PRD_PHASE1_RADAR_ARENA.md`, `PRD_PHASE2_REWARD_GAME.md`, `PRD_PHASE3_NFT_GROWTH.md` — requirements, acceptance, metrics, budget, risk.
2. Lock season dates, reward sheet, NFT criteria (see appendix).
3. Founder decisions pending: final HIGH RISK threshold, NFT transferable vs soulbound, first sponsor yes/no, launch date + treasury wallet address.

## Version history
- v1.0 2026-11-03: Official roadmap copy locked by Co Founder ("The Genesis & $WenFUN Launch" / "The Arena Seasons" / "Proof of Skill & NFT Utilities"). Internal ops appendix separated from public copy. No code.
- v0.5 2026-11-03: Added $WenFUN token launch (pump.fun) to Phase 1.
- v0.4 2026-11-03: Plain-English rewrite, frontend naming aligned.
- v0.3 2026-11-02: Rewrite Nov 2026 → Jan 2027, 3 phases.
- v0.2 2026-11-01: Timeline Nov 2026 → Mei 2027, 5 phases. Superseded.
- v0.1 2026-11-01: Draft from repo inspection.
