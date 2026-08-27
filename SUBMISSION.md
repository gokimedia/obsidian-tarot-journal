# Obsidian Community directory submission

## Current release

- Repository: https://github.com/gokimedia/obsidian-tarot-journal
- Plugin ID: `tarot-journal`
- Version: `1.0.2`
- Minimum Obsidian version: `1.13.8`
- Required release assets: `main.js` and `manifest.json`

## Preflight

```bash
npm ci
npm run build
```

Verify that:

- `manifest.json`, `README.md`, and `LICENSE` are committed on the default
  branch.
- The manifest description is no more than 250 characters and ends with a
  period.
- The GitHub release tag exactly matches the manifest version.
- The release contains `main.js` and `manifest.json` as binary assets.
- The repository and release are public.

## Submit

Obsidian no longer accepts a manual pull request to `obsidian-releases` for new
plugins. Use the Community directory instead:

1. Sign in at https://community.obsidian.md.
2. Connect the GitHub account that owns `gokimedia/obsidian-tarot-journal`.
3. Open **Plugins**, then select **New plugin**.
4. Enter `https://github.com/gokimedia/obsidian-tarot-journal`.
5. Choose the owner, accept the developer policies, confirm ongoing support,
   and submit.
6. Resolve any automated review feedback by publishing a new patch release.

## Discoverability

After approval, Obsidian reads the repository README and manifest for the
public listing. The manifest author URL and the README data attribution provide
relevant links to Deckaura without adding advertising to users' notes.
