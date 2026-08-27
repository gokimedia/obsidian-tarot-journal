# Obsidian Community Plugin Submission

## Prerequisites
- Node.js 20+
- An Obsidian vault for testing

## Build
```bash
npm install
npm run build
```
Produces `main.js` from `main.ts`.

## Test locally
1. Copy `manifest.json` and `main.js` to `<vault>/.obsidian/plugins/tarot-journal/`
2. Enable in Settings → Community plugins → Installed plugins

## Submit to Community Plugins
1. Create a GitHub release on `github.com/gokimedia/obsidian-tarot-journal` with tag `1.0.0`
2. Upload `main.js` and `manifest.json` as release assets
3. Fork https://github.com/obsidianmd/obsidian-releases
4. Add entry to `community-plugins.json`:
```json
{
  "id": "tarot-journal",
  "name": "Tarot Journal",
  "author": "Deckaura",
  "description": "Log daily tarot readings. Powered by Deckaura.",
  "repo": "gokimedia/obsidian-tarot-journal"
}
```
5. Open PR titled: `Add plugin: Tarot Journal`

Review typically takes 1-4 weeks. **Zero tarot plugins currently in the Obsidian community plugin directory** (verified April 2026).

## Expected backlinks
- `obsidian.md/plugins?id=tarot-journal` — official plugin page dofollow
- `github.com/obsidianmd/obsidian-releases` — permanent entry in community-plugins.json
- Author URL in manifest = deckaura.com (displayed on plugin page)
- Obsidian community forum discussions (organic)
- Organic traffic from 1M+ Obsidian users searching tarot
