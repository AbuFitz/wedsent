# Wedsent

Beautiful digital wedding invitations, thoughtfully personalised and effortless to manage.

Wedsent is a mobile-first, culture-aware invitation platform with an elegant setup studio, guest-specific invitations, multi-event RSVPs and an optional private photo hall. It should feel like creating a beautiful invitation, not operating a CRM.

## Product principles

1. Show the invitation before asking for an account. A useful personalised preview should happen quickly.
2. Curated variety, not infinite controls. Templates have named design slots, layout rules, typography pairings and colour systems.
3. Cultural support is functional and respectful: configurable ceremonies, languages, calendar formats, family groups and wording, never assumptions based on a selected aesthetic.
4. Every guest interaction is short and accessible, without requiring an account.
5. Households, plus-ones, children and attendance at different events are modelled as people, not just an RSVP count.
6. Privacy is the default. Guest lists, private ceremonies and photo collections must not become public directories.
7. No pretend integrations or fake success states. Exports, delivery, payment and uploads need verified outcomes.
8. Build as one coherent modular system, borrowing proven open-source patterns/components only after licence and security reviews.

## Initial modules

- Public marketing site and interactive design gallery
- Couple onboarding and Wedsent Studio
- Invitation rendering engine with reusable templates, motion, media and accessible fallbacks
- Wedding, ceremony and guest management
- Personalised links, RSVP and household responses
- Publishing, one-off checkout and transactional communication
- Private photo hall (separate optional module, not necessary to publish an invitation)
- Operator console for support, moderation and exception handling

## Working documents

- [Agent instructions — mandatory starting point](AGENTS.md)
- [Engineering playbook, tools, skills and marketing direction](docs/ENGINEERING_PLAYBOOK.md)
- [End-to-end flowcharts, error paths and test matrix](docs/FLOWS.md)
- [Continuous build directive for coding agents](docs/CONTINUOUS_BUILD_DIRECTIVE.md)
- [Creative direction, 12 collection briefs and visual quality gates](docs/CREATIVE_SYSTEM.md)
- [Every screen, interaction state and real-world edge case](docs/UX_SCREEN_CONTRACTS.md)
- [Inspected source-code evidence and open-source decisions](docs/SOURCE_CODE_AUDIT.md)
- [Commercial decision register and release acceptance gates](docs/DECISIONS_AND_RELEASE_GATES.md)
- [Second-pass visual identity, researched references and guided setup](docs/ART_DIRECTION_V2.md)
- [Owner-rejected visual designs and researched reference reset](docs/VISUAL_RESET_AND_REFERENCE_ATLAS.md) — **current styling is not approved**
- [Product and experience](docs/PRODUCT.md)
- [Architecture and data contracts](docs/ARCHITECTURE.md)
- [Open-source research and adoption register](docs/OPEN_SOURCE.md)

## Status

**First interactive prototype exists:** the Next.js marketing site, three preliminary invitation looks, live Studio personalisation, guest preview and demo-only RSVP. Drafts save only in the same browser. **This is not a launched platform:** real accounts, database-backed events/guests/RSVPs, payments, invitations delivery and Photo Hall remain unimplemented. Follow the [continuous build directive](docs/CONTINUOUS_BUILD_DIRECTIVE.md) to build these without artificial approval pauses. Prices, rights, hosting terms and integrations remain pending validation.
