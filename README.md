# @kodeking/lottie-to-dotlottie

> Convert Lottie JSON to `.lottie` binary format — **browser only, no server required**

[![npm](https://img.shields.io/npm/v/@kodeking/lottie-to-dotlottie)](https://www.npmjs.com/package/@kodeking/lottie-to-dotlottie)
[![license](https://img.shields.io/npm/l/@kodeking/lottie-to-dotlottie)](LICENSE)

Convert `.json` Lottie animations to the modern `.lottie` container format entirely in the browser. `.lottie` files are typically **2–10× smaller** than equivalent JSON and are natively supported by all LottieFiles players. Try it live at [iconking.net/tools/lottie-json-to-dotlottie](https://iconking.net/tools/lottie-json-to-dotlottie).

---

## Install

```bash
npm install @kodeking/lottie-to-dotlottie @dotlottie/dotlottie-js
# or
pnpm add @kodeking/lottie-to-dotlottie @dotlottie/dotlottie-js
```

`@dotlottie/dotlottie-js` is a peer dependency — install it alongside this package.

---

## Usage

### Basic conversion and download

```ts
import { convertToDotLottie, downloadDotLottie } from '@kodeking/lottie-to-dotlottie';

const lottieJson = await fetch('/animation.json').then(r => r.json());

const binary = await convertToDotLottie(lottieJson, { animationName: 'my-animation' });
downloadDotLottie(binary, 'my-animation.lottie');
```

### From a file input

```ts
import { readLottieFile, convertToDotLottie, downloadDotLottie } from '@kodeking/lottie-to-dotlottie';

const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
input.addEventListener('change', async () => {
  const file = input.files?.[0];
  if (!file) return;

  const lottieJson = await readLottieFile(file);
  const binary = await convertToDotLottie(lottieJson);
  downloadDotLottie(binary, file.name.replace('.json', '.lottie'));
});
```

### Get the binary for further processing

```ts
const binary = await convertToDotLottie(lottieJson);

// Upload to your server
const formData = new FormData();
formData.append('file', new Blob([binary], { type: 'application/zip' }), 'animation.lottie');
await fetch('/upload', { method: 'POST', body: formData });
```

---

## API

### `convertToDotLottie(lottieJson, options?): Promise<Uint8Array>`

Converts a Lottie JSON object to a `.lottie` binary.

| Option | Type | Default | Description |
|---|---|---|---|
| `animationName` | `string` | `"animation"` | ID of the animation inside the .lottie container |

Returns `Promise<Uint8Array>` — the raw `.lottie` binary data.

### `downloadDotLottie(binary, filename?): void`

Triggers a browser download of a `.lottie` binary. `filename` defaults to `"animation.lottie"`.

### `readLottieFile(file): Promise<object>`

Reads a browser `File` and returns parsed JSON. Accepts `.json` files. Returns an empty object for `.lottie` files (binary containers cannot be re-parsed in the browser).

---

## What is .lottie?

The `.lottie` format (dotLottie) is a ZIP-based container format created by [LottieFiles](https://lottiefiles.com). Compared to plain JSON:

- **Smaller** — typically 2–10× smaller due to compression
- **Multi-animation** — a single file can contain multiple animations
- **Theming** — supports color themes and dynamic properties
- **State machines** — supports interactive animations (via DotLottie players)

**Compatible players:**
- [@dotlottie/react](https://github.com/dotlottie/dotlottie-web) — React
- [@dotlottie/web](https://github.com/dotlottie/dotlottie-web) — vanilla JS
- [LottieFiles player](https://lottiefiles.com/lottie-player) — web component
- DotLottie iOS and Android SDKs

---

## License

MIT © [KodeKing](https://github.com/Koding-net)

---

## Related packages

| Package | Description |
|---|---|
| [@kodeking/lottie-to-svg](https://github.com/Koding-net/lottie-to-svg) | Extract SVG frames from a Lottie animation |
| [@kodeking/svg-to-lottie](https://github.com/Koding-net/svg-to-lottie) | Wrap an SVG as a Lottie JSON animation |
| [@kodeking/lottie-to-gif](https://github.com/Koding-net/lottie-to-gif) | Render Lottie to animated GIF (Node.js) |
| [@kodeking/lottie-to-mp4](https://github.com/Koding-net/lottie-to-mp4) | Render Lottie to MP4 video (Node.js) |

See all tools at [github.com/Koding-net/lottie-tools](https://github.com/Koding-net/lottie-tools).
