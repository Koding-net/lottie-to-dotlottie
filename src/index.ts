/**
 * @koding-net/lottie-to-dotlottie
 *
 * Convert a Lottie JSON animation to the .lottie binary format.
 * Runs entirely in the browser — no server required.
 *
 * .lottie (dotLottie) is a ZIP-based container format created by LottieFiles.
 * It is typically 2–10× smaller than the equivalent JSON and supports
 * multiple animations, themes, and states in a single file.
 *
 * Uses @dotlottie/dotlottie-js for conversion.
 */

export interface LottieJson {
  [key: string]: unknown;
}

export interface ConvertOptions {
  /** Name used for the animation inside the .lottie container (default: "animation") */
  animationName?: string;
}

/**
 * Convert a Lottie JSON object to a .lottie binary (dotLottie format).
 *
 * @param lottieJson    Parsed Lottie JSON object
 * @param options       Conversion options
 * @returns             Uint8Array containing the .lottie binary
 *
 * @example
 * ```ts
 * import { convertToDotLottie, downloadDotLottie } from '@koding-net/lottie-to-dotlottie';
 *
 * const response = await fetch('/animation.json');
 * const lottieJson = await response.json();
 *
 * const binary = await convertToDotLottie(lottieJson);
 * downloadDotLottie(binary, 'animation.lottie');
 * ```
 */
export async function convertToDotLottie(
  lottieJson: LottieJson,
  options: ConvertOptions = {},
): Promise<Uint8Array> {
  const { animationName = 'animation' } = options;

  // Dynamic import — keeps bundle light for pages that don't need it
  const { DotLottie } = await import('@dotlottie/dotlottie-js');

  const dotlottie = new DotLottie();
  dotlottie.addAnimation({
    id: animationName,
    data: lottieJson as never,
  });

  const built  = await dotlottie.build();
  const buffer = await built.toArrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Trigger a browser download of a .lottie binary.
 *
 * @param binary    Uint8Array from `convertToDotLottie`
 * @param filename  Download filename (default: "animation.lottie")
 */
export function downloadDotLottie(binary: Uint8Array, filename = 'animation.lottie'): void {
  const blob = new Blob([binary], { type: 'application/zip' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Read a Lottie JSON `File` object and parse it.
 * Accepts both `.json` and `.lottie` extensions — for `.lottie` files,
 * returns an empty object (the browser cannot parse the binary container;
 * pass it directly to a dotLottie player instead).
 */
export async function readLottieFile(file: File): Promise<LottieJson> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'json') {
    const text = await file.text();
    return JSON.parse(text) as LottieJson;
  }

  if (ext === 'lottie') {
    // .lottie files are ZIP containers — return empty to signal binary input
    return {};
  }

  throw new Error('Unsupported file type. Please upload a .json or .lottie file.');
}
