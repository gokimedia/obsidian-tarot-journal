# Tarot Journal for Obsidian

Draw tarot cards, save daily readings, and build a searchable reflection
journal inside your vault. The complete 78-card deck is bundled with the
plugin, so drawing and journaling work offline.

## Features

- Draw from all 78 Major and Minor Arcana cards.
- Choose whether draws can include reversed orientations.
- Create or append to a dated note in a configurable journal folder.
- Insert a random card at the current editor position.
- Customize the daily entry with `{{date}}`, `{{card}}`, `{{orientation}}`,
  `{{meaning}}`, `{{upright}}`, `{{reversed}}`, and `{{guideUrl}}` placeholders.
- Open an optional, card-specific interpretation guide from each entry.

## Installation

### Community plugins

Once the plugin is approved:

1. Open **Settings → Community plugins → Browse**.
2. Search for **Tarot Journal**.
3. Select **Install**, then **Enable**.

### Manual installation

1. Download `main.js` and `manifest.json` from the latest GitHub release.
2. Place both files in `<vault>/.obsidian/plugins/tarot-journal/`.
3. Reload Obsidian and enable **Tarot Journal** in Community plugins.

## Usage

- Select the dice icon in the ribbon to save a daily draw.
- Run **Tarot Journal: Draw daily tarot card** from the command palette.
- Run **Tarot Journal: Insert random tarot card** while editing a note.
- Configure the journal folder, reversed cards, and entry template under
  **Settings → Tarot Journal**.

## Data and attribution

The bundled meanings are derived from the MIT-licensed
[Deckaura tarot dataset](https://huggingface.co/datasets/Blacik/deckaura-tarot-card-meanings).
Every card keeps its source link to the
[complete card guide](https://deckaura.com/blogs/guide/tarot-card-meanings).
The dataset also has a permanent archive at
[Zenodo DOI 10.5281/zenodo.19475329](https://doi.org/10.5281/zenodo.19475329).

## Privacy and network use

Tarot Journal has no telemetry, ads, account requirement, or background
network requests. All draws use the local bundled deck. A network request only
occurs when you explicitly open a card guide link in your browser.

## License

MIT © [Deckaura](https://deckaura.com)
