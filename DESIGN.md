# Huli Huli Tiki Lounge: design notes

## Brief
- Subject: Huli Huli Tiki Lounge, a tiki bar and kitchen at 26 W. Olentangy St, Powell, Ohio. Opened 2019 in an old antique shop.
- Audience: Powell and Columbus locals on a night out, groups planning a birthday or work party, office managers ordering catering.
- Job: get people in the door (reserve, walk in), get orders (online order), get party and catering requests.
- Client asks: lean hard into tiki, put the mugs and masks up front, show the on-fire drinks as much as possible. Every service gets its own section: flaming drinks, mugs and masks, order online, patio, private parties, catering, reservations, reviews, gallery, newsletter, visit.
- Assets: client photo shoot (interior, exterior, food), old-site drink photos (four cocktails on the bar), the client's own illustrated menus (drinks and food, by Trader Nic), white logo.
- Assumptions (placeholder: true in site.ts): drink names on the four bar photos, the form endpoint, the newsletter endpoint, the party and catering email.

## Concept options

| | Idea | Anchor | Signature | O/F/Fe/P |
|---|---|---|---|---|
| A. Name | *Huli* is Hawaiian for "to turn over". Everything on the site turns: drinks turn over like coasters to show the recipe, the page turns between routes | the name itself, and huli huli chicken turned on the spit | a lineup of four real cocktails that turn over one by one as you scroll, front photo, back recipe and price | 4 / 5 / 4 / 2 |
| B. Material | The site is the client's illustrated menu: sunset peach to lagoon teal for drinks, purple to lava for food | the menus they already print | grounds shift from drink sunset to food lava on scroll | 3 / 5 / 4 / 3 |
| C. Place | Antique shop turned tiki hideaway: every item carries a hand-written price tag | the building's history | tags swing on hover | 3 / 3 / 4 / 3 |

Pick A. It comes from the name, gives a full rule set (turn, flip, swing) and stays cheap: CSS 3D and GSAP, no GL. Steal B for colour: the grounds come from their own printed menus.

## Concept card
```
Idea:        Huli means "turn over": every drink, card and page on the site turns to show its other side.
Metaphor:    a coaster or a carved sign turned over on the bar.
Signature:   "The lineup": four real cocktails stand in a row and turn over one by one as you scroll (front photo, back recipe, strength, price). Pinned sticky stage on desktop, tap-to-turn on phones.
Emotion:     loud, warm, a little ridiculous, like walking under the thatch.
Motion verb: turn over (rotateY around a vertical axis, a short overshoot like a sign settling).
Screenshot:  the lineup mid-turn: two drinks showing photos, one showing its recipe, one on edge.
```

## System
- Palette (from the client's menus and logo):
  - lagoon `#1E8C9E` (drinks menu bottom), sunset `#F26A1B` (fire, primary action), sun `#FFC530` (logo pineapple, highlights), cream `#FFF0D4` (paper), ink `#2B140B` (carved wood), hibiscus `#E8407A` (parties band).
  - Text: ink on cream and sun; cream on ink, lagoon-deep `#0F4F5A` and sunset-deep `#B5410B`. Contrast checked per ground.
- Type: Luckiest Guy (display, poster voice, from the menu headings), Oswald 500/600 uppercase (labels, prices, the menu's condensed voice), DM Sans (body).
  Display at 64 to 200 px, tracking 0, leading 0.9. Labels 13 to 15 px tracked 0.06em.
- Grid: 12 columns, gutter clamp 16 to 40 px. Text hangs from column 1 and column 7.
- Shape: radius 18 px on photo frames and cards, pills for buttons. Thick 3 px ink outlines on cards (the menu's linework).
- Motion: ease `expo.out` for entrances, `back.out(1.4)` for the turn settle. Turns 0.9 s, hovers 0.35 s.
  - CTAs: the label turns over (rotateX letter roll) and the fill floods.
  - Photo cards: turn 8 degrees toward the pointer, like a hanging sign.
  - Nav: underline draws.
- Idle: the hero sign and the lineup's front card sway a few degrees with the pointer and a slow clock (a sign hanging in the breeze). Off under reduced motion.

## Composition plan (each section a different family)
1. Hero: split frame. Cream type on lagoon on the left, the lit Octoskull photo in a tall arch on the right that turns in on load.
2. Fire: full-bleed media. The red bar at night, statement about drinks lit at the table.
3. The lineup (signature): sticky stage, four turning cards.
4. Mugs and masks: gallery wall plus the $45 Octoskull numeral.
5. Our story: statement on cream with the moai photo.
6. Order online: index list of dishes with a floating photo preview.
7. Patio: asymmetric pair.
8. Parties and catering: two stacked equal bands, hibiscus and sun.
9. Reservations: form with the rules beside it.
10. Reviews: big rating numeral and real quotes.
11. Gallery: filmstrip marquee of the room.
12. Visit and newsletter: hours, map link, sign-up.
13. Footer finale: the name at full width.

## Genericness test
- A generic model would give a dark tiki page with a fire gradient hero. Changed: grounds come from the client's own printed menus (lagoon, cream, sun), and the hero is their real lit Octoskull, not a stock flame.
- A generic model would flip cards on hover. Changed: the turn is driven by scroll in a sticky stage, each back is real menu copy, and the same verb drives the page transition and button labels.

## Still page decision
The site breathes at rest through the sign sway on the hero and the lineup card, and the gallery strip drifts. That is the idle state.

## Loader (home, first load only)
The whole screen is the sun band. A pineapple in the middle fills with sunset orange like a glass, swaying slightly, over a percent count
that follows real loading (fonts and the hero mug), 1.1 to 2.6 s. Exit: the count and pineapple drop out,
the sun panel slides down until its ink top edge lands exactly on the hero band, the hero intro starts as
the panel passes the title, and the mug rises from behind the band. Last frame of the loader = the band in
the first frame of the hero. Reduced motion: a 0.3 s fade. No JS: no loader. Other pages have none.
Guards (2026-11-14, after the jury flagged a 20 s phone loader): shown once per session (sessionStorage),
progress capped at 1.5 s, and a CSS fade at 2.3 s that runs even while a slow phone is busy with the
scripts; scripts arriving after 2.2 s skip the loader and the hero intro. Touch screens use native scroll
(no Lenis). Reveals below the fold are set up only when they come near the viewport.
