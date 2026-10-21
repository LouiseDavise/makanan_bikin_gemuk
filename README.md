# Makanan Bikin Gemuk

Demo website for a fictional school-lunch kitchen (dapur): Rp 15.000 per portion, served in stainless-steel trays (ompreng). Built by STOEDIO for the first "Stoe" Instagram Reel, which shows off **light editing** (the Business package).

React + Vite + TypeScript, in Bahasa Indonesia and English.

## Languages

A pop-up asks first-time visitors to choose Bahasa Indonesia or English. The choice is remembered (`localStorage`, key `mbg-lang`), and the **ID | EN** switch in the header changes it at any time. Add `?lang=id` or `?lang=en` to a URL to skip the pop-up, e.g. `/?lang=id&pemilik` for a screen recording.

Interface text lives in `src/i18n/strings.ts` (one `id` and one `en` object with the same shape). Owner-editable text (headline, intro, dishes, order deadline, address) is stored in both languages in `src/content.ts`. Owner mode edits the language currently on screen. Prices, hours and photos are shared by both languages.

## Pages

| Route | Contents |
| --- | --- |
| `/` | Hero (headline, price, WhatsApp), tray diagram for the chosen day, why us, kitchen photos |
| `/menu` | Mon–Fri menu: tray per day plus the weekly schedule |
| `/sekolah` | Price, minimum order, delivery hours, order deadline; order form by number of students → pre-filled WhatsApp message |
| `/kontak` | Address, kitchen hours, map |

## Light editing (owner mode)

Tap **✎ Mode pemilik** (bottom left), or open any URL with `?pemilik` to start straight in owner mode, which is handy for screen recording. Fields with an orange dashed outline can be edited: headline, intro, price per portion, minimum order, delivery hours, order deadline, every dish in the weekly menu (in the tray or the table), opening hours, address, and photos. **Simpan** publishes the changes; **Batal** discards them.

In this demo, changes are saved in the visitor's browser (`localStorage`, key `mbg-content-v2`). "Kembalikan konten demo" in the footer restores the defaults. A real client build would need a shared content store and an owner login.

## Configuration

`src/config.ts`: `demo: true` shows the "Situs demo oleh STOEDIO" strip, and WhatsApp buttons preview the message (with an option to send it to STOEDIO). For a real kitchen, set `demo: false` and fill in `whatsapp`.
Default content (menu, prices, hours): `src/content.ts`.

`index.html` and `public/robots.txt` keep the site out of search engines (the business is fictional).

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

Deploy: a separate Vercel project (framework: Vite). `vercel.json` sends every path to the SPA. Later it can be moved to a subdomain such as `makananbikingemuk.stoedio.com`.
