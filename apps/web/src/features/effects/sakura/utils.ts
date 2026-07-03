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

/**
 * Particle-canvas resolution multiplier. Deliberately capped below raw
 * devicePixelRatio: rendering the full-viewport particle canvas at DPR 3
 * on mobile was fill-rate bound on weak GPUs (a past regression). DPR-1
 * devices are unaffected (scale 1 = today's cost).
 */
export function computeRenderScale(dpr: number, maxScale: number): number {
    return Math.max(1, Math.min(dpr, maxScale));
}

/**
 * Trace (and close) the shared petal silhouette centered on the origin.
 * Spans ±s*0.5 vertically; positive curl bows the right edge outward.
 * Used by both the falling-petal sprite and the branch blossoms so the
 * two stay visually consistent.
 */
export function tracePetalPath(
    ctx: CanvasRenderingContext2D,
    s: number,
    curl: number,
) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.bezierCurveTo(
        s * (0.38 + curl),
        -s * 0.42,
        s * (0.42 + curl * 0.5),
        s * 0.15,
        0,
        s * 0.5,
    );
    ctx.bezierCurveTo(
        -s * (0.38 - curl),
        s * 0.15,
        -s * (0.42 - curl * 0.5),
        -s * 0.42,
        0,
        -s * 0.5,
    );
    ctx.closePath();
}
