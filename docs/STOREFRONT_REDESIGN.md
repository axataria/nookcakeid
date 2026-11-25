# Storefront redesign

Product: Pre-order Basque cheesecake for small daily treats and sharing.
Character: warm, unhurried, personal.
World: a small bakery counter, paper boxes and espresso ink.
Moments: one interactive cake study; an oversized brand line.
Signature: numbered steps from choosing a day to enjoying the cake.

The storefront uses an honest manual request flow because no durable database, payment gateway credentials, verified stock feed, delivery configuration, or verified product photography exists in this repository. It never claims payment success or capacity reservations. Payment creation and callbacks fail closed with HTTP 503. Connect durable inventory, authenticated payment webhooks, authoritative prices and genuine payment expiry before restoring online checkout. The 16 bento equivalent guard limits request size, not availability. Whole uses four bento equivalents and slice uses four fifths, consistent with the documented recipe ratio; confirm this with the operator before launch.

Photography is still needed. The hero is explicitly labelled as a 3D illustration; product cards are a typeset menu, not fake photos. No generated customer proof or delivery promises were added. Confirm the introductory price and operational policies before launch.

Design pass order: spacing, color, icons, copy, type, layout, details, visuals, motion. Kept section order and existing serif wordmark. Replaced badges, emojis, gradients, progress tracker, unbounded controls and simulated checkout. Drawer uses Vaul with focus management and gesture dismissal. Reduced motion uses a static selectable pose; rendering pauses offscreen. Verified photos and a branded social preview remain content dependencies.

Method credit: unslop by Damir Sokolovsky (@heydamir), https://heydamir.design/unslop, CC BY 4.0. This credits the workflow; no skill text is copied into product UI.

Browser checks: Chromium desktop and 375px mobile screenshots inspected. No page errors; no overflow at 375, 390, 768, 1280, 1440. Verified missing-date feedback, manual reveal toggle, basket persistence, missing-date copy guard, dialog close and Escape, privacy/terms and 404 routes. Initial visual inspection caught inward-facing outer cake walls; corrected triangle winding and assigned distinct crust and custard material groups. Rendering stops after convergence and resumes on interaction. The Three.js viewer is lazy loaded. The legacy order tracker also no longer fabricates a confirmed order.

## Nine passes

1. Spacing: shared page widths, consistent section rhythm, 44–48px touch controls, safe-area cart and drawer footers.
2. Color: warm neutral ramp, espresso primary action, dark caramel price ink. Removed surface gradients, glows, colored shadows and pulsing badges.
3. Icons: removed emoji art and ornamental icons. Text labels identify actions; simple directional glyphs remain quiet.
4. Copy: Indonesian product headline, specific manual-request instructions, no invented stock counts or confirmed payments. Supplier-origin and popularity claims removed where unsupported.
5. Type: preserved Fraunces wordmark and display headings with Manrope interface text. Regular display weights, tabular amounts, readable supporting text, no italic emphasis.
6. Layout: asymmetric desktop hero, stacked mobile composition, numbered menu rows, existing hero/date/menu/care/philosophy/footer sequence retained.
7. Details: accessible Vaul drawer, labelled controls, focus rings, empty and error states, quantity limits, included packaging, privacy and terms pages, custom 404 and favicon.
8. Visuals: preserved the product-specific procedural cake; repaired inward-facing geometry and separate crust/custard materials. No fabricated product photography. Static branded social preview added.
9. Motion: removed scroll lock theatre, percentage tracker, idle floating and pointer parallax. Reveal is an explicit reversible button. Frame-rate-independent damping settles to an exact pose, reduced motion switches static poses, and rendering pauses at rest/offscreen. Viewer lazy loaded.

## Remaining external dependencies

Verified product photography, an operator-approved delivery/pickup policy, payment provider credentials, persistent inventory and order storage, and the production hostname are not present. The manual handoff supports honest ordering requests without claiming these integrations exist. No messages were sent to customers or to the business.

## Validation

TypeScript and production compilation are checked separately. Browser guard script covers the 16:00 WIB cutoff, product-equivalent intake cap, calculated totals, disabled additions at the cap, reduced-motion reveal, no overflow across five widths, and HTTP 503 from unconfigured payment creation and callbacks. Legal routes return 200 and unknown routes 404. The initial Next.js generated OG endpoint failed on Windows; replaced it with a static 1200×630 PNG to avoid that runtime dependency.


## Current direction update: textured 3D, generated product cards, 60/30/10

User requested scroll parallax and image cards restored. This supersedes the earlier decision to use a static hero and typeset-only menu.

- 60% visual role: warm oatmeal canvas `#FAF7F2`.
- 30% visual role: white product cards and linen date/footer surfaces `#FFFFFF` / `#EEE7DC`.
- 10% visual role: dark caramel `#974B26` for ordering actions, prices, selections, and brand emphasis. These are compositional roles rather than a literal pixel quota; food images retain natural colors.
- Hierarchy: restrained 60px desktop display, 40px mobile headline, 48px section headings, 25–26px product names, 18px prices, 14–16px body, 12px metadata.
- Five separately generated product images, saved as optimized local WebP assets in `public/products/`; image prompts and provenance in `docs/product-image-prompts.json`. Generated images are disclosed below the catalog and in alt text.
- Three.js geometry: denser sectors, deeper sunken center, irregular rim and corrugated sidewalls. Distinct sRGB color maps plus linear bump and roughness maps, pale porous custard, brownie base strip, textured parchment, studio reflection environment and botanical fruit detail.
- Scroll animation: short sticky hero, passive listener throttled by animation frames, updates directly into the engine. Camera orbit and 72-degree slice translation have separate state. Manual Gulir/Utuh/Potongan controls always have explicit precedence and can restore scroll control. Reduced-motion modes show static fitted poses. Offscreen and resting scenes stop rendering.
- Validation: loaded all five local images; browser checked scroll changes the actual canvas pixels, manual whole/scroll mode, reduced-motion slice mode, card addition and price total, and no horizontal overflow at 375, 390, 768, 1280 and 1440. Camera framing corrected after visual inspection showed the detached wedge clipping the right edge.
