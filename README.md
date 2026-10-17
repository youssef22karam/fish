# FishDraw 3D — Anatomical v10 (split for GitHub)

The original was one 772 KB HTML file. It is now split so every file is under 30 KB.

## Rebuild the runnable app
    node build.mjs        # writes dist/FishDraw_3D_Anatomical_v10.html (byte-identical to the original)
Open that single HTML file in a browser (works offline).

## Layout (read in this order)
| File | What it is |
|---|---|
| `index.template.html` | page shell: head, `{{CSS}}`, UI markup, `{{THREE}}`, `{{APP}}` placeholders |
| `css/style.css` | all styles |
| `js/01_utilities.js` | `'use strict'`, math/colour helpers |
| `js/02_species_a.js`, `js/03_species_b.js` | hand-built species definitions (bass ... goldfish) |
| `js/04_genus_a.js`, `js/05_genus_b.js` | procedural fish genomes: archetypes, fin layouts, palettes, mutations, names, `makeFish`, typed-name hints |
| `js/06_geometry_helper.js`, `js/07_body.js` | geometry helper, headless fish body |
| `js/08_skin_painter.js` | skin/pattern painter |
| `js/09_fins.js`, `js/10_fins_assemble.js` | fins and fin assembly |
| `js/11_genome_adapter_a.js`, `js/12_genome_adapter_b_and_main.js` | genome -> FishDraw adapter, UI wiring, render loop |
| `vendor/three.r128.min.part01..22.js` | minified three.js r128, split into chunks. Not readable code: skip it, do not edit |
| `build.json`, `build.mjs` | build manifest and script |

The `js/*.js` files are consecutive pieces of ONE script and share globals; they are not independent modules. Each starts with a `// @@PART` header line that the build strips. Vendor parts are raw text chunks and are not valid JS on their own.
