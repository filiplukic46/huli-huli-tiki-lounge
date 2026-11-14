# Huli Huli Tiki Lounge

Website for Huli Huli Tiki Lounge, a tiki bar in Powell, Ohio. Built with Astro, GSAP and Lenis.

## Run it locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The output goes to `dist/`.

## Hosting

Every push to `main` builds the site and publishes it to GitHub Pages:
https://filiplukic46.github.io/huli-huli-tiki-lounge/

The Pages build runs with `PAGES=1`, which serves the site under `/huli-huli-tiki-lounge/`. A build without it uses the client's own domain, hulihulipowell.com.

## Placeholders

- The hero mug photo and the flaming drink photos are AI stand-ins. The client should shoot real ones.
- The form email address and the newsletter endpoint are placeholders, in `src/data/site.ts`.
- Three drink names on the cocktail photos are guesses. Only Pat's Barrel is confirmed.
