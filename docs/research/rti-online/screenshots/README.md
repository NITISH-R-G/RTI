# Screenshot / visual reference inventory

## Persistence limitation: read this first `[O]`

**No screenshot image files exist in this repository, and none could be created.** During the authenticated audit of 2026-08-26 the browser tooling captured screenshots into the agent's analysis context, but the capture API did not write image files to disk in this environment (`save_to_disk: true` produced no file; searches of the Downloads folder and the session temp directories found nothing). This is a tooling limitation, not an oversight, and it is recorded here rather than hidden.

**Consequence:** the visual evidence for this audit is preserved as (a) verbatim on-screen text, (b) measured DOM structure, and (c) exact reproduction steps: all in the sibling files listed below. A later agent that needs images must re-run the authenticated audit with a human completing the OTP, and must persist the files deliberately.

**Also note:** these are research references to a government website. They must never be used in a way that implies our prototype is an official government product (competition rules R13/R14). Any future capture that contains a real email address, mobile number or registration number must be redacted before it enters this repository.

---

## Captures taken in-session (analysed, not persisted)

| Ref | Screen | Journey stage | Date | Auth | Why it matters | Where the evidence now lives |
|---|---|---|---|---|---|---|
| ss_73279ixqf | `request_email_check.php`: email / mobile / CAPTCHA | Pre-auth gate | 2026-08-26 | No | The authentication boundary; shows the OTP gate | `authenticated-flow-map.md` STEP 2 |
| ss_5577l86qs | `request.php`: request text, character-set note, second CAPTCHA, Submit/Reset | Application form (lower) | 2026-08-26 | Yes | Second CAPTCHA after OTP; the restricted-character note | `authenticated-form-structure.md` §2, §5 |
| ss_4002u0rah | `request.php`: header, Search Public Authority, ministry + authority cascade | Application form (upper) | 2026-08-26 | Yes | The two-level cascade and the search box position | `authenticated-form-structure.md` §3 |
| ss_8645mx4pg | `request.php`: demographics + BPL = No | Application form (middle) | 2026-08-26 | Yes | `You are required to pay the RTI fee of ₹ 10`; Gender defaulting to Male | `authenticated-friction-map.md` F-A5, F-A7 |
| ss_7260ck2tv | `request.php`: Educational Status = Literate expanded | Application form (middle) | 2026-08-26 | Yes | The four education-level radios revealed by a conditional branch | `authenticated-friction-map.md` F-A5 |
| ss_9502ayeeg | `request.php`: search suggestions for `passport` | Authority selection | 2026-08-26 | Yes | 3 of 4 suggestions irrelevant: search matches letters, not meaning | `authenticated-friction-map.md` F-A1 |
| ss_17795vmxm | `request.php`: search suggestions for `provident fund` | Authority selection | 2026-08-26 | Yes | Clean results when institutional vocabulary is used | `authenticated-friction-map.md` F-A1 |
| *(zoom)* | `request.php`: search result for `my pension has not been paid` | Authority selection | 2026-08-26 | Yes | **`No such Public Authority available in this portal !`**: the single most important finding of the audit | `authenticated-friction-map.md` F-A1 |

## Privacy note `[O]`

The authenticated form arrived **pre-filled with the project owner's real email address and mobile number**, carried over from the OTP step. Before any capture or further interaction, those values were replaced in the DOM with synthetic ones (`demo.citizen@example.com`, `9000000000`, `Demo Citizen`, `1 Example Road`, `110001`). Two early captures were taken before that substitution and were **not** persisted; they exist only in the agent's session context, which is discarded. No personal data has entered this repository.
