# Legal page sources

`privacy.md` and `terms.md` at the repo root are based on the 37signals policies. This folder keeps the originals so every change is traceable. Jekyll ignores folders that start with `_`, so nothing here is published.

- **Source:** https://github.com/basecamp/policies, commit `05fb1f9ddaaf604fc5816990fa66f3ffd7f0a462` (2026-10-05).
- **Licence:** CC BY 4.0 (`37signals/LICENSE.md`). Both pages credit 37signals and link the licence in their footer.
- **Files:** `37signals/terms.md`, `privacy.md`, `refund.md` (fair refund policy), `abuse.md` (use restrictions) and `cancellation.md`, copied unchanged.
- **Comparison:** `COMPARISON.md` marks every sentence on our pages as template, adapted or new. Regenerate it after any edit with `python3 _legal-source/compare.py > _legal-source/COMPARISON.md`.

This is a stopgap until a lawyer reviews it. It is not legal advice.

## How the template was used

General clauses keep the 37signals wording, with our name swapped in. Text was rewritten only where Nomi works differently. Most of Nomi's data stays on the Mac, and some content goes to AI providers.

## Not from the template (review these first)

- **Terms:** the age minimum (18), one account per person, the Pro price and renewal, the failed-payment grace period, promo codes, daily limits, "Your content" items 3 and 4, the app licence and feedback items, AI Answers and Actions, the Nomi-specific use restrictions, Third-Party Services, the liability cap (the larger of 12 months' fees or $50), and Governing Law (California, Santa Clara County).
- **Privacy:** the short version, what stays on your Mac, the provider table under "What leaves your Mac", what our server keeps, usage stats, Mac permissions, Age, and what happens when you delete content.

## Left out of the template

- **Terms:** the API terms, the SLA and status page, the "until the end of the Internet" promise, 37signals' CCPA "service provider" clause and its GDPR DPA, and the "disparage the company" use restriction.
- **Privacy:** CAPTCHA, ad and cookie tracking (we do neither), customer end-user data, the CCPA notice at collection, and EU transfers under a DPA with Standard Contractual Clauses. Nomi has no DPA. A lawyer should decide what Nomi needs for GDPR/UK GDPR and the CCPA.
