# Production readiness plan (2026-09-30)

## Estimate
**30% ready** (rough engineering judgment). Search, map, concierge, and example listings exist, but listing provenance and verification are not reliable enough for real renters.

## Evidence
- `src/data/initialData.ts` generates fresh verification timestamps for bundled examples at process startup.
- `server.ts` uses in-memory listings and creates fabricated caretaker names, phone numbers, vacancies, and “verified” claims when scraping fails.
- `/api/listings/verify` changes availability based on an unauthenticated client request and claims a WhatsApp ping without performing one.
- No tests or CI workflow appears in the default-branch tree.

## Execute on this branch
1. Stop fabricating contacts and verification on scrape failure; return an explicit unavailable result. **Immediate priority.**
2. Label bundled listings as demo samples until each has a real source and timestamp; remove startup-generated “verified now” timestamps.
3. Require authenticated caretaker/agent identity and audit trail for availability changes.
4. Store listings persistently with source, consent, freshness, deduplication, and takedown process.
5. Add tests for filtering, total move-in cost, and source provenance; add CI and deployment runbook.

## Production gate
No listing is advertised as verified without a traceable source and current confirmation; no contact details are generated; all writes are authorized; tests and consumer review pass.
