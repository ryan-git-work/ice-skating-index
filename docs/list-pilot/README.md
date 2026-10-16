# ISI first-month worksheet pilot, prepared October 16

Status: review-ready offline asset, NOT public capture or email launch. The HTML is outside client/public and is not linked from any page. Print from a browser if a PDF is desired; no third-party account, API or personal data required. Derived from the September booklet's two-option household decision structure, not a renamed paid booklet. No Charity endorsement assumed.

## Scope

One worksheet; first placement on the existing cost guide, optional secondary Nashville/Centennial placement after usefulness is observed. Suggested invitation: “Compare two first-month skating plans. Use this one-page sheet to record admission, rental, lessons and the questions still to ask.” Keep current facts, session links and the guide free and readable. No popup, national schedule subscription, weekly newsletter or SMS.

## Verified infrastructure and limits

EmailOptIn remains unused. Its code promises a Friday weekend-schedule email. The dormant /api/email-signup handler writes JSON under client/public, with no delivery integration in that handler. Production static root is dist/public; runtime source-directory writes alone do not prove exposure. No subscriber data was read, no public subscriber-file request was made, no signup was submitted. This task does not change the endpoint or security settings.

A narrow search of the established TCC mailbox for hello@iceskatingindex.com since June returned no messages. That does not prove the mailbox is absent or unmonitored. No current responder, forwarding route, successful incoming delivery, ISI-specific consent group, configured provider, suppression handling or automation delivery was verified. Kit tools are not exposed in this session. No provider/account substitute was selected. Remedy: owner supplies the existing ISI sender/provider context and confirms a responder; then inspect that provider's configuration read-only. Do not borrow the TCC list or sender just because its connector is available.

Sharpening CTA was revised to a question, with provider confirmation and consent language, rather than a guaranteed match. It remains a mailto link and does not claim successful delivery, response time or appointment booking. Provider availability and private introductions still require a real responder. Do not monetize a referral before that is demonstrated.

## New launch decision

Ryan must choose the owner/responder and approved ISI delivery route before any live collection. Prepared site fixes can ship separately. Once established: keep the download available on confirmation, state exactly what optional follow-up is requested, use separate ISI consent, private provider storage and an unsubscribe path. No paid offer or weekly schedule promise. Do not reactivate the old component/JSON endpoint as the pilot.

## Verification before launch

Use mocked/local signup and delivery tests, inspect sender and asset URLs without sending to third parties. Any real send test requires a specifically approved owner-controlled recipient. Check mobile readability, keyboard flow and successful/failed delivery states. Do not claim end-to-end delivery until provider evidence exists.

Record eligible page views, invitation clicks, confirmed opt-ins, actual deliveries, worksheet use/replies and unsubscribes separately. GSC clicks are not visitor or conversion denominators. Review after 30–45 days with an agreed effort cap. Few qualified views leave demand unresolved; no conversion forecast or subscriber target is inferred. Paid $49 service versus $9 booklet stays a separate Charity capacity/offer decision.
