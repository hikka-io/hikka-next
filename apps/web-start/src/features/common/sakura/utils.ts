export type SpriteCache = Map<string, HTMLCanvasElement>;

export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomItem<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns 1 for y ≤ 0.75·H, linearly falling to 0 at y = H. Clamped.
 * Used for per-particle alpha fade near the bottom of the viewport.
 */
export function edgeFade(y: number, H: number): number {
    const start = H * 0.75;
    if (y <= start) return 1;
    if (y >= H) return 0;
    return 1 - (y - start) / (H - start);
}
