---
title: Privacy policy
permalink: /privacy
---

# Privacy policy

*Last updated: October 28, 2026*

The privacy of your data — and it is your data, not ours! — is a big deal to us. Nomi sees your screen, so we built it to keep your memory on your Mac. In this policy, we lay out: what data we collect and why; what leaves your Mac; how your data is handled; and your rights with respect to your data. We promise we never sell your data: never have, never will.

This policy applies to the Nomi Mac app and the Nomi server ("Nomi"). When we say "we", "our", or "us", we mean Yang Gao, a sole proprietor in California, USA, doing business as Nomi.

## The short version

- **Your memory stays on your Mac.** What Nomi saves is kept in an encrypted database on your Mac. We do not keep a copy on our server. There is no sync.
- **Some content goes to AI providers to answer you.** Most of them have agreed to keep none of it (zero data retention). Two services do not have that agreement: web search and connected apps. We name both below.
- **Our server keeps your account, not your content.** It keeps your email, your plan, and usage counts. It does not store what you see, say, type, or save.
- **No selling, no ads, no training.** We do not sell your data, show you ads, or use your content to train AI models.

## What stays on your Mac

- **What you save.** Text Nomi reads from your screen, what you type or say to Nomi, and the notes and history Nomi makes from them.
- **Pictures you circle.** Nomi keeps the part you circled and a small thumbnail. It never keeps a full screenshot.
- **Conversations.** Your questions and Nomi's answers. Settings → Privacy & Data sets how long Nomi keeps them.
- **Crash reports.** If Nomi stops unexpectedly, it keeps a short report with no content in it: the app version, the macOS version, and where in the code it stopped. Nothing is uploaded. You choose to send it to us by email. Nomi deletes reports after 7 days.

Nomi encrypts its database and saved pictures. The keys stay in your Mac's Keychain. Before Nomi saves text, it tries to remove card numbers, ID numbers, API keys, and one-time codes. This filter can miss things. Nomi does not read password fields, password managers, or private browser windows.

## What leaves your Mac, and why

Nomi sends content only to do something you asked for or turned on.

| What | Sent to | When | Kept by them? |
|---|---|---|---|
| Text and circled pictures, to answer you or understand what you saved | OpenAI, through our server | When you ask or save | No (zero data retention) |
| Text turned into search vectors for your memory | OpenAI, through our server | After you save | No (zero data retention) |
| Your voice while you hold the Nomi key | Deepgram, through our server | While you speak | No (zero data retention, training off) |
| Web search queries | Firecrawl and its search provider, through our server | When an answer needs the web | **Yes.** See below |
| Requests to Gmail, Google Calendar, Drive, or Docs | Composio, through our server | Only after you connect an app, when you ask or approve | **Yes.** See below |
| Your email address and sign-in | Supabase (our server host) | When you sign in | Yes, for your account |
| Payment details | Stripe | When you buy Pro | Yes, by Stripe |
| Usage counts with a random install ID | Our server | About once an hour, if usage stats are on | Yes, 90 days |

**If you bring your own model** (Settings → your own key or a server on your Mac), Nomi sends answer requests to the provider you chose, under that provider's terms. Memory work still goes to our zero-data-retention providers.

**Web search.** Web search is on by default, and Nomi shows a switch for it during setup and in Settings → Privacy & Data. Firecrawl and the search engine it uses can keep your queries. A query can hold a name or place from your screen or memory. Nomi blocks queries that look like secrets and queries longer than 25 words, and shows each query in the answer. For confidential work, turn web search off.

**Connected apps.** If you connect a Google app, Composio holds the access to your Google account for Nomi. Composio keeps a log of each request and its result, which can include full email content, for up to one year. Nomi reads your mail, calendar, or files only when you ask, never in the background. Nomi sends an email or makes an event only after you approve it. You can disconnect at any time; Nomi then asks Composio to remove the access. You can also remove it at your Google account's security page. Nomi's use of information received from Google APIs follows the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

If we add a feature that sends data to a new provider, we update this list before the feature ships.

## What our server keeps

| Data | Why | How long |
|---|---|---|
| Email address, sign-in method, Google name and picture (if you sign in with Google), and sign-in logs that can include your IP address | Your account and security | While your account is active |
| Plan, promo code use, and Stripe customer and subscription IDs | Your plan and billing | While your account is active |
| AI usage counts per day (calls, tokens, cost — no content) | Limits and cost control | 30 days |
| Which apps you connected, and a random ID for you at Composio | Connected apps | Until you disconnect or delete your account |
| Records of connected-app actions (action name and time, no content) | To stop duplicate actions | 30 days |

Our server passes your requests to the providers above. It does not store or log their content or the answers.

## Usage stats

Nomi sends counts, like which setup steps you finished and how often you use the Nomi key. It never sends what you see, say, type, or save, and never app names, window titles, web addresses, file names, or your email. Usage stats use a random install ID that is not linked to your account, and carry the day, not the time. We do not store your IP address with them. Raw events are deleted after 90 days; daily totals with no ID are kept. Usage stats are on by default. Turn them off in Settings → Privacy & Data, which also deletes the install ID and any unsent events.

## Billing information

When you buy Pro, you give your card details to Stripe, not to us. Card information never touches our servers. We keep the Stripe customer ID, the subscription ID, and the subscription status. To offer the student price, we check that your confirmed sign-in email ends in `.edu`.

## When we access or disclose your information

**To provide the service.** We use the providers named above to run Nomi.

**At your direction.** When you connect a Google app, data moves between Google, Composio, and Nomi as you ask.

**To help you, with your permission.** No human at Nomi sees your content, which lives on your Mac. If you send us a crash report or a support email, we read what you sent.

**To investigate abuse.** We look at account and usage records if we see an attack or a breach of our [Terms](terms).

**When required by law.** We are a US business, and our server is in the US. We share account data only when compelled by valid US legal process, and we tell you first unless the law forbids it. Your memory is on your Mac, so we cannot hand it over.

If Nomi is ever sold or merged, we will tell you before your personal information moves to a different privacy policy.

## Your rights with respect to your information

We give the same rights to everyone, wherever you live:

- **Know and access.** This policy lists what we collect. Ask us for a copy of what our server keeps about you.
- **Correct.** Ask us to fix your account data.
- **Delete.** Email us from your account's email address and ask us to delete your account. Within 30 days we delete your account, plan, and usage counts, and remove your connected-app access at Composio. Stripe keeps the payment records the law requires. Data on your Mac stays until you delete it there.
- **Turn things off.** Web search and usage stats have switches in Settings → Privacy & Data. Microphone and screen access have switches in macOS System Settings.
- **Object or complain.** You can object to how we use your data, and complain to your data protection authority.
- **Non-discrimination.** Using these rights never changes your price or our service to you.

To use these rights, email [yang@get-nomi.app](mailto:yang@get-nomi.app). We may confirm your identity first, by checking that the request comes from your account's email address.

## Age

Nomi is for people 18 years or older. We do not knowingly collect data from children. If you think a child gave us data, email us and we will delete it.

## How we secure your data

Data moving between your Mac and our server is encrypted with TLS. Your memory is encrypted on your Mac with keys kept in the Keychain. Provider keys stay on our server and never reach your Mac. Encryption does not protect your data if someone has full control of your Mac. No system is perfectly secure; if a breach affects your personal data, we will tell you as the law requires.

## Location of data

Nomi is run from the United States, and our server and providers process data in the United States. If you are outside the United States, the information you send to our server goes to the United States.

## Changes and questions

Nomi is new and will change, and this policy will change with it. We will update the date at the top, and for a significant change we will tell you in the app or by email before it applies.

Questions about this policy, your data, or your rights? Email [yang@get-nomi.app](mailto:yang@get-nomi.app).

---

*Adapted from the [37signals policies](https://github.com/basecamp/policies), used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). We changed the text to describe Nomi.*
