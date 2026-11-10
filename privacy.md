---
title: Privacy policy
permalink: /privacy
redirect_from: /privacy-policy
---

# Privacy policy

*Last updated: November 10, 2026*

The privacy of your data — and it is your data, not ours! — is a big deal to us. In this policy, we lay out: what data we collect and why; how your data is handled; and your rights with respect to your data. We promise we never sell your data: never have, never will.

This policy applies to the Nomi Mac app, the Nomi server, and our websites (together, “Nomi”). When we say “we”, “our”, or “us”, we mean Yang Gao, a sole proprietor in California, USA, doing business as Nomi.

This policy applies to our handling of information about site visitors and people who use Nomi. We refer collectively to these categories of individuals as “you” throughout this policy.

## The short version

- **Your memory stays on your Mac.** What Nomi saves is kept in an encrypted database on your Mac. We do not keep a copy on our server. There is no sync.
- **Some content goes to AI providers to answer you.** Most of them have agreed to keep none of it (zero data retention). Two services do not have that agreement: web search and connected apps. We name both below.
- **Our server keeps your account, not your content.** It keeps your email, your plan, and usage counts. It does not store what you see, say, type, or save.
- **No selling, no ads, no training.** We do not sell your data, show you ads, or use your content to train AI models.

## What we collect and why

Our guiding principle is to collect only what we need. Here’s what that means in practice:

### What stays on your Mac

Unlike most products, Nomi does not store the content of your memory on our servers. It stays on your Mac:

- **What you save.** Text Nomi reads from your screen, what you type or say to Nomi, and the notes and history Nomi makes from them.
- **Pictures you circle.** Nomi keeps the part you circled and a small thumbnail. It never keeps a full screenshot.
- **Conversations.** Your questions and Nomi's answers. Settings → Privacy & Data sets how long Nomi keeps them.
- **Crash reports.** If Nomi stops unexpectedly, it keeps a short report with no content in it: the app version and build, the macOS version, the type of Mac, the error type, and where in the code it stopped. Nothing is uploaded. You choose to send it to us by email. Nomi deletes reports after 7 days.

Nomi encrypts its database and saved pictures. The keys stay in your Mac's Keychain. Before Nomi saves text, it tries to remove card numbers, ID numbers, API keys, and one-time codes. This filter can miss things. Nomi does not read password fields, password managers, or private browser windows.

### Identity and access

When you sign up for Nomi, we ask for your email address. If you sign in with Google, we also receive your Google name and picture. That’s so you can sign in to your account, and we can send you essential information about your account.

We’ll never sell your personal information to third parties, and we won’t use your name in marketing statements without your permission either.

### Billing information

If you buy Pro, you will be asked to provide your payment information. Credit card information is submitted directly to our payment processor, Stripe, and doesn’t hit Nomi servers. We store the Stripe customer ID, the subscription ID, and the subscription status, for purposes of account history and billing support. To offer the student price, we check that your confirmed sign-in email ends in `.edu`.

### General geolocation data

We log sign-ins to your account, which can include your IP address, for security and fraud prevention purposes, and we keep this login data for as long as your account is active.

### What leaves your Mac, and why

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

### What our server keeps

| Data | Why | How long |
|---|---|---|
| Email address, sign-in method, Google name and picture (if you sign in with Google), and sign-in logs that can include your IP address | Your account and security | While your account is active |
| Plan, promo code use, and Stripe customer and subscription IDs | Your plan and billing | While your account is active |
| AI usage counts per day (calls, tokens, cost — no content) | Limits and cost control | 30 days |
| Which apps you connected, and a random ID for you at Composio | Connected apps | Until you disconnect or delete your account |
| Records of connected-app actions (action name and time, no content) | To stop duplicate actions | 30 days |

Our server passes your requests to the providers above. It does not store or log their content or the answers.

### Usage stats

Nomi sends counts, like which setup steps you finished and how often you use the Nomi key. It never sends what you see, say, type, or save, and never app names, window titles, web addresses, file names, or your email. Usage stats use a random install ID that is not linked to your account, and carry the day, not the time. We do not store your IP address with them. Raw events are deleted after 90 days; daily totals with no ID are kept. Usage stats are on by default. Turn them off in Settings → Privacy & Data, which also deletes the install ID and any unsent events.

### Website interactions, advertising, and cookies

Our website does not use analytics, advertising scripts, or cookies. It is hosted by GitHub Pages, which may log visits, including your IP address, under [GitHub’s privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). We do not show ads in Nomi, and we do not use your data for advertising.

### Voluntary correspondence

When you email us with a question or to ask for help, or send us a crash report, we keep that correspondence, including your email address, so that we have a history of past correspondence to reference if you reach out in the future.

We also store information you may volunteer, for example, written responses to surveys. If you agree to a customer interview, we may ask for your permission to record the conversation for future reference or use. We will only do so with your express consent.

### How we approach Mac permissions

Because of how macOS is designed, Nomi must request your consent before it can use Screen Recording, Accessibility, and the microphone. Consent is always optional, though the features that need a permission will not work without it. You can turn each permission off at any time in macOS System Settings → Privacy & Security.

## When we access or disclose your information

**To provide products or services you’ve requested.** We use some third-party subprocessors to help run Nomi and provide the Services to you. They are listed, with what each one receives, under [What leaves your Mac, and why](#what-leaves-your-mac-and-why) above.

We may disclose your information at your direction if you integrate a third-party service into your use of Nomi. For example, if you connect a Google app, data moves between Google, Composio, and Nomi as you ask, as described above.

No Nomi human looks at your content except for limited purposes with your express permission. Your memory lives on your Mac, and we cannot see it. If you send us a crash report or a support email, we read what you sent. We may also access your account data if required in order to respond to legal process (see “When required under applicable law” below).

**To help you troubleshoot or squash a software bug, with your permission.** If at any point we need to access your content to help you with a support case, we will ask for your consent before proceeding.

**To investigate, prevent, or take action regarding [restricted uses](terms#use-restrictions).** Accessing a customer’s account when investigating potential abuse is a measure of last resort. We want to protect the privacy and safety of both our customers and the people reporting issues to us, and we do our best to balance those responsibilities throughout the process. If we discover you are using Nomi for a restricted purpose, we will take action as necessary, including notifying appropriate authorities where warranted.

**Aggregated and de-identified data.** We may aggregate and/or de-identify information collected through the services, such as the daily usage totals described above. We may use de-identified or aggregated data for any purpose, including marketing or analytics.

**When required under applicable law.** Nomi is a U.S. business and our server is located in the U.S. Your memory is on your Mac, so we cannot hand it over.

* Requests for user data. Our policy is to not respond to government requests for user data unless we are compelled by legal process or in limited circumstances in the event of an emergency request. However, if U.S. law enforcement authorities have the necessary warrant, criminal subpoena, or court order requiring us to disclose data, we must comply. Likewise, we will only respond to requests from government authorities outside the U.S. if compelled by the U.S. government through procedures outlined in a mutual legal assistance treaty or agreement. It is Nomi’s policy to notify affected users before we disclose data unless we are legally prohibited from doing so, and except in some emergency cases.

* Preservation requests. Similarly, Nomi’s policy is to comply with requests to preserve data only if compelled by the U.S. Federal Stored Communications Act, 18 U.S.C. Section 2703(f), or by a properly served U.S. subpoena for civil matters. We do not disclose preserved data unless required by law or compelled by a court order that we choose not to appeal. Furthermore, unless we receive a proper warrant, court order, or subpoena before the required preservation period expires, we will destroy any preserved copies of customer data at the end of the preservation period.

* If we are audited by a tax authority, we may be required to disclose billing-related information. If that happens, we will disclose only the minimum needed.

Finally, if Nomi is acquired by or merges with another company — we don’t plan on that, but if it happens — we’ll notify you well before any of your personal information is transferred or becomes subject to a different privacy policy.

## Your rights with respect to your information

At Nomi, we strive to apply the same data rights to all customers, regardless of their location. Some of these rights include:

* **Right to Know.** You have the right to know what personal information is collected, used, shared or sold. We outline both the categories and specific bits of data we collect, as well as how they are used, in this privacy policy.
* **Right of Access.** This includes your right to access the personal information we gather about you, and your right to obtain information about the sharing, storage, security and processing of that information. You can ask us for a copy of what our server keeps about you.
* **Right to Correction.** You have the right to request correction of your personal information.
* **Right to Erasure / “To Be Forgotten”.** This is your right to request, subject to certain limitations under applicable law, that your personal information be erased from our possession and, by extension, from all of our service providers. To delete your account, email us from your account’s email address. Within 30 days we delete your account, plan, and usage counts, and remove your connected-app access at Composio. Stripe keeps the payment records the law requires. Data on your Mac stays until you delete it there.
* **Right to Complain.** You have the right to make a complaint regarding our handling of your personal information with the appropriate supervisory authority.
* **Right to Restrict Processing.** This is your right to request restriction of how and why your personal information is used or processed, including opting out of sale of your personal information. (Again: we never have and never will sell your personal data.) Web search and usage stats have switches in Settings → Privacy & Data.
* **Right to Object.** You have the right, in certain situations, to object to how or why your personal information is processed.
* **Right to Portability.** You have the right to receive the personal information we have about you and the right to transmit it to another party.
* **Right to not Be Subject to Automated Decision-Making.** You have the right to object to and prevent any decision that could have a legal or similarly significant effect on you from being made solely based on automated processes. This right is limited if the decision is necessary for performance of any contract between you and us, is allowed by applicable law, or is based on your explicit consent.
* **Right to Non-Discrimination.** We do not and will not charge you a different amount to use our products, offer you different discounts, or give you a lower level of customer service because you have exercised your data privacy rights. However, the exercise of certain rights may, by virtue of your exercising those rights, prevent you from using our Services.

Please note that certain information may be exempt from such requests under applicable law. For example, we need to retain certain information in order to provide our services to you.

In some cases, we also need to take reasonable steps to verify your identity before responding to a request, which may include checking that the request comes from your account’s email address. If we are unable to verify you, we may be unable to respond to your requests. If you have questions about exercising these rights or need assistance, please contact us at [yang@get-nomi.app](mailto:yang@get-nomi.app). If an authorized agent is corresponding on your behalf, we will need written consent with a signature from the account holder before proceeding.

Depending on applicable law, you may have the right to appeal our decision to deny your request, if applicable. We will provide information about how to exercise that right in our response denying the request. You also have the right to lodge a complaint with a supervisory authority. If you are in the EU or UK, you can contact your data protection authority to file a complaint or learn more about local privacy laws.

## Age

Nomi is for people 18 years or older. We do not knowingly collect data from children. If you think a child gave us data, email us and we will delete it.

## How we secure your data

All data is encrypted via [SSL/TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) when transmitted between Nomi and our server. In addition, we go to great lengths to secure your data at rest: your memory is encrypted on your Mac with keys kept in the Keychain. Provider keys stay on our server and never reach your Mac. Encryption does not protect your data if someone has full control of your Mac. No system is perfectly secure; if a breach affects your personal data, we will tell you as the law requires.

## What happens when you delete content

Your memory lives on your Mac. We do not keep a copy, so we cannot restore anything you delete there. Copies may remain in your own backups, such as Time Machine.

If you delete your account, we delete your account data from our server within 30 days, as described under “Right to Erasure” above.

## Data retention

We keep your information for the time necessary for the purposes for which it is processed. The length of time for which we retain information depends on the purposes for which we collected and use it and your choices, after which time we may delete and/or aggregate it. We may also retain and use this information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. Through this policy, we have provided specific retention periods for certain types of information.

## Location of site and data

Nomi is operated in the United States, and our server and providers process data in the United States. If you are located in the European Union, UK, or elsewhere outside of the United States, **please be aware that any information you send to our server will be transferred to and stored in the United States**. By using our websites or Services and/or providing us with your personal information, you consent to this transfer.

## Changes and questions

We may update this policy as needed to comply with relevant regulations and reflect any new practices. You can view a history of the changes to this policy [on GitHub](https://github.com/YGao2005/nomi-site/commits/main/privacy.md). Whenever we make a significant change to our policies, we will refresh the date at the top of this page and tell you in the app or by email before the change applies.

Have any questions, comments, or concerns about this privacy policy, your data, or your rights with respect to your information? Please get in touch by emailing us at [yang@get-nomi.app](mailto:yang@get-nomi.app) and we’ll be happy to try to answer them!

---

*Based on the [37signals policies](https://github.com/basecamp/policies), used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). We changed the text to describe Nomi. The original text and a comparison are [in our repository](https://github.com/YGao2005/nomi-site/tree/main/_legal-source).*
