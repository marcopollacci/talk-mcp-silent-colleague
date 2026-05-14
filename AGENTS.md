# AGENTS.md — Slide authoring guide

This project uses [p-slides](https://github.com/) as the presentation engine, with Astro as the framework. Slides are custom web components (`<p-slide>`, `<p-fragment>`, etc.).

---

## Project structure

```
src/
├── pages/          # Presentation entry points (one page = one talk)
├── layouts/        # Layout.astro: shared HTML shell for all talks
├── slides/         # .astro files with slide content (one file per section)
├── components/     # Reusable components (PNotes, SpeakerMode, Seo)
├── styles/         # Global and presentation SCSS
└── img/            # Image assets
```

---

## Adding a new talk

1. Create `src/pages/<talk-name>.astro` — import `Layout` and the slide modules.
2. Pass `canRender`, `favIcon`, and `metaData` props to `Layout`.
3. Use `canRender` to gate slides from early access:

```astro
---
const canRender = import.meta.env.DEV || new Date("YYYY-MM-DD") < new Date();
---
<Layout {canRender} {favIcon} {metaData}>
  <CoverSlide />
  {canRender && (
    <>
      <Intro />
      <MainContent />
      <Thanks />
    </>
  )}
</Layout>
```

---

## Slide file structure (`src/slides/`)

Each `.astro` file in `src/slides/` contains **one or more** `<p-slide>` elements. There is no extra wrapper: the tags are direct children of the `Layout` slot.

```astro
---
import PNotes from "../components/PNotes.astro";
import { Image } from "astro:assets";
import myImage from "../img/example.png";
---

<p-slide class="center">
  <h2 class="main-gradient">Slide title</h2>
  <p-fragment>
    <Image src={myImage} alt="description" class="alter-image-size" style="--image-start-size: 8em" />
  </p-fragment>
  <PNotes>
    <p>Speaker notes, visible only in dev/speaker mode.</p>
  </PNotes>
</p-slide>
```

---

## Core elements

### `<p-slide>`

The base container for each slide. Key attributes:

| Attribute | Effect |
|---|---|
| `class="center"` | Centers content vertically and horizontally |
| `class="two-columns"` | Two-column layout using `<p-note>` as cells |
| `class="cover"` | Styling for the opening slide of a talk |
| `autoplay` | Automatically advances to the next slide |
| `timing="N"` | Milliseconds to wait before autoplay |

### `<p-fragment>`

Reveals content step-by-step (click / arrow key). Attributes:

| Attribute | Effect |
|---|---|
| `p-effect="zoom"` | Enters with a zoom effect |
| `p-effect="insert"` | Enters without taking up space until revealed |
| `p-effect="dim"` | Dims the element as the presentation advances |
| `p-effect="snatch"` | Moves the element from one position to another |
| `timing-start="N"` | Delay in ms relative to fragment activation |
| `none` | Invisible but occupies space (`visibility: hidden`) |

### `<p-note>`

A semantic box inside a slide, commonly used in multi-column layouts.

### `<PNotes>`

Wrapper for speaker notes (`src/components/PNotes.astro`). Content is visible **only in development** (`import.meta.env.PROD === false`) and in speaker mode. Never shown in the public presentation.

```astro
<PNotes>
  <p>Explain why this slide matters...</p>
</PNotes>
```

---

## Images

Always use Astro's `<Image>` for optimized images. Control the size with the `.alter-image-size` class and the `--image-start-size` CSS custom property:

```astro
<Image
  src={myImg}
  alt="description"
  class="alter-image-size"
  style="--image-start-size: 8em"
/>
```

The default for `--image-start-size` is `8em`. `--image-width-size` defaults to `auto`.

---

## Code blocks

To display code with a "window" style (traffic-light dots + filename label):

```astro
<pre class="small-line" data-label-file="example.ts">
  <code is:raw class="language-typescript">
    const foo = "bar";
  </code>
</pre>
```

- `data-label-file`: filename shown in the title bar
- `class="small-line"`: reduces `line-height` for compact code
- Use `is:raw` to prevent Astro from processing the content
- Available Prism languages: `javascript`, `typescript`, `scss`

---

## Key style classes (`presentation.scss`)

### Text gradients

| Class | Effect |
|---|---|
| `.main-gradient` | Purple → blue gradient (primary brand) |
| `.main-sub-gradient` | Magenta → orange gradient (accent) |
| `.text-cover` | Magenta → dark blue gradient (cover slides) |
| `.text-sub-section` | Neutral dark grey |
| `.current-gradient` | Follows `--starting-point-gradient` / `--ending-point-gradient` CSS vars |

All of these use `background-clip: text` + `-webkit-text-fill-color: transparent`.

### Layout

| Class | Effect |
|---|---|
| `.columns` | Auto-fit grid with a minimum column width of 5em |
| `.grid` | Grid with `--rows` and `--columns` configurable via CSS vars |
| `.two-columns` | Equal two-column layout (on `<p-slide>`) |
| `.hand-drawing` | Column flexbox with "hand-drawn" borders |
| `.hand-drawing-horizontal` | Same as `.hand-drawing` but in a row |

### Typography and lists

| Class | Effect |
|---|---|
| `.long-list` | Smaller font + `margin-block-end` on `li` |
| `.mid-dimension` | Font 0.7em, compact margins |
| `.more-space` | `line-height: 1.3em` |
| `.more-margin li` | Extra spacing between list items |
| `.small-text` | Reduced text (uses the `smallText` mixin) |
| `.blockquote` | Blockquote style with decorative quotation marks |

### Utility

| Class | Effect |
|---|---|
| `.alter-image-size` | Controls image size via `--image-start-size` |
| `.to-do` | Blinking red element — marks placeholder content to be filled in |
| `.attention` | Bold text with ⚠️ emoji on both sides |
| `.shadow` | Light `box-shadow` |
| `.full-media` | Full-screen media (`.full-media-x` or `.full-media-y`) |
| `.sketchy-arrow` | Animated "hand-drawn" arrow via CSS paint worklet |
| `.our-header` | Left border in brand color, used for section headers |

### Cover and sections

| Class | Effect |
|---|---|
| `.cover` | Styling for the talk opening slide |
| `.cover-internal` | Like `.cover` but for internal section covers |
| `.cover-internal-sub-section` | Sub-section cover with accent gradient |
| `.cover-subSection` | Variant with reduced font size |
| `.bottom-fist-page` | Positions author info centered at the bottom |

---

## Global CSS variables

Defined in `:root` inside `presentation.scss`:

```scss
--brand-color: #822a7c;          /* primary brand purple */
--brand-color-ant: #f60;         /* accent orange */
--starting-point-gradient: #c850c0;
--ending-point-gradient: #4158d0;
--fragment-duration: 300ms;
--sliding-duration: 0ms;
--slide-bg: white;
```

You can override `--starting-point-gradient` and `--ending-point-gradient` on individual slides or sections to change gradient colors locally.

---

## Effects (`effects.scss`)

Additional classes from `effects.scss`, activated via the `p-effect` attribute on `<p-fragment>`:

- `highlight` / `highlight red`: highlights with increased contrast
- `dim`: gradually dims with `--dim-value` (default 0.3)
- `snatch`: moves the element using `--from-x/y` and `--to-x/y`
- `insert`: enters without occupying space before activation

---

## Fonts

The project uses three Graphik variants:

- `var(--talk-marco-graphik-regular)` — body text
- `var(--talk-marco-graphik-medium)` — medium emphasis
- `var(--talk-marco-graphik-semibold)` — headings and gradients

Preloaded automatically by `Layout.astro` via Astro's `<Font>`.

---

## Conventions

- Each thematic section of the presentation lives in a separate file under `src/slides/`.
- Opening and closing slides (`Cover`, `Thanks`) are reusable across talks — they accept props to customise the QR code, URL, and speaker photo.
- Use `<PNotes>` on every slide with non-obvious content: speaker notes are there to support the presenter during the talk.
- The `Thanks` component accepts: `qrLink`, `urlLink`, `qrLinkRating`, `QuestionsSlide`, `meReloaded` — leave `<p-note class="to-do">` placeholders until you have the final values.
- Do not add global styles directly inside slide files: shared rules go in `presentation.scss`, local rules go in a `<style lang="scss">` block inside the slide file.
