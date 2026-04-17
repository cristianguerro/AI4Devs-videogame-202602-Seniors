# Pixel-Tama Asset Conventions

## Texture Key Contract

Use category-prefixed texture keys in `src/data/textureKeys.js`:

- `board:*` for board tiles
- `pieces:*` for piece sprites
- `markers:*` for interaction markers
- `ui:*` for card and turn-state frames

Never reuse keys across categories. Add new entries to `TEXTURE_ASSETS` so `BootScene` preloads them from file paths.

## Source Dimensions

- Board tiles: `18x18` source, rendered to `18x18` on board cells (`TILE_SIZE - 2`).
- Piece sprites: `16x16` source, rendered to `13x13` (student) and `16x16` (master).
- Markers: `14x14` source, rendered to `14x14` or `15x15` overlays.
- Card frames: `52x28` for player frames, `48x30` for neutral frame.
- Turn indicators: `42x24` source/render size.

Keep dimensions aligned to the current 320x180 pixel-art layout.

## Readability and Contrast Budget

- Board textures stay in low-to-mid contrast neutrals so pieces remain dominant.
- Piece silhouettes carry role identity first (master vs student), color supports owner identity.
- Valid and capture markers must differ by shape and hue.
- Selected state must remain visible while move options are on screen.
- Active turn and selected card states should be recognizable without reading labels.

## Rendering Rules

- Keep `pixelArt: true` in Phaser config.
- Use texture fallback warnings to detect missing keys during scene setup.
- Keep effects subtle: short pulse, short move pop, brief capture flash, quick card swap slide.
