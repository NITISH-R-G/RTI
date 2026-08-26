# 01 — Product Context

**Working name:** RTI Sarathi *(placeholder — see open question 2 in `04-user-problem.md`)*

## One-line description

An independent prototype that turns a citizen's plain-language problem into a correctly worded RTI request aimed at the right public authority — with the reasoning shown, on a phone, in one screen flow.

## Why it exists

The Right to Information Act gives every Indian citizen the right to ask the government for records. `rtionline.gov.in` makes that right *available* but not *usable*: before you can ask your question you must already know that RTI is the right instrument, which of roughly 2,900 public authorities holds the answer, and how to phrase a request so it is legally answerable. The portal offers no help with any of the three, and its own FAQ documents what happens when you get it wrong — a transfer under s.6(3) with a new registration number, or, for a state authority, the application returned **without refund of fee**.

The gap is not information. It is translation.

## What it is not

- Not a clone of the RTI Online portal.
- Not a general-purpose RTI chatbot.
- Not an official or affiliated government service. It says so, prominently and permanently.
- Not a filing service. It cannot and does not submit anything to any government system.

## Audience

First-time filers on mobile, comfortable in Hindi/Hinglish, unfamiliar with government terminology, with one fee and thirty days at stake. Design decisions resolve in their favour, not the power user's. See `06-ux-system.md`.

## The transformation we are claiming

| Today | With this prototype |
|---|---|
| Read 22 bullets of procedure, then prove you are human, then guess an office from a list of 2,900 | Describe the problem in your own words |
| Wording is your problem | Wording is drafted, explained, and yours to edit |
| Nobody tells you RTI is the wrong tool | You are told before you spend the fee |
| Government vocabulary assumed | Every term glossed where it appears |
| Zoom-and-pinch on a phone | Built for the phone first |

The claim must stay defensible: every row above is measured in `11-evaluation-log.md` against the observed baseline in `03-rti-site-inventory.md`.

## Related memory

`02` competition rules · `03` the audit · `04` the problem and why it beat the alternatives · `05` decisions · `docs/design/mvp-spec.md` the MVP contract.
