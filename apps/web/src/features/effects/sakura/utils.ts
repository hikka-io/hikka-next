export type SpriteCache = Map<string, HTMLCanvasElement>;

export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomItem<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Deterministic 32-bit PRNG (mulberry32). Used so the branch fractal keeps
 * an identical shape across resizes within a session — Math.random() in the
 * branch drawing code made the tree visibly morph on every window resize.
 */
export function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function randomWith(
    rng: () => number,
    min: number,
    max: number,
): number {
    return rng() * (max - min) + min;
}

export function randomItemWith<T>(rng: () => number, arr: readonly T[]): T {
    return arr[Math.floor(rng() * arr.length)];
}
