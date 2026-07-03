import { PETAL_PALETTES, type PetalPalette } from './config';
import { random, type SpriteCache, tracePetalPath } from './utils';

function petalSpriteLogicalSize(sizeBucket: number, blur: number): number {
    const pad = blur > 0 ? Math.ceil(blur * 3) : 0;
    return sizeBucket + pad * 2;
}

function renderPetalCanvas(
    sizeBucket: number,
    curl: number,
    palette: PetalPalette,
    blur: number,
    scale: number,
): HTMLCanvasElement {
    const logicalSize = petalSpriteLogicalSize(sizeBucket, blur);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(logicalSize * scale));
    c.height = c.width;
    const ctx = c.getContext('2d')!;

    // Draw in logical (CSS px) units on a scaled bitmap.
    ctx.scale(scale, scale);
    if (blur > 0) ctx.filter = `blur(${blur}px)`;

    const cx = logicalSize / 2;
    const s = sizeBucket;

    ctx.translate(cx, cx);

    tracePetalPath(ctx, s, curl);

    const grad = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
    grad.addColorStop(0, palette.highlight);
    grad.addColorStop(0.4, palette.base);
    grad.addColorStop(1, palette.tip);

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -s * 0.35);
    ctx.quadraticCurveTo(s * curl * 0.5, 0, 0, s * 0.4);
    ctx.strokeStyle = palette.tip;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    return c;
}

class Petal {
    private static getCachedCanvas(
        cache: SpriteCache,
        size: number,
        curl: number,
        paletteIndex: number,
        blur: number,
        scale: number,
    ): HTMLCanvasElement {
        const sizeBucket = Math.round(size);
        const curlBucket = Math.round(curl * 20) / 20;
        const key = `${sizeBucket}|${curlBucket}|${paletteIndex}|${blur}|${scale}`;

        let c = cache.get(key);
        if (!c) {
            c = renderPetalCanvas(
                sizeBucket,
                curlBucket,
                PETAL_PALETTES[paletteIndex],
                blur,
                scale,
            );
            cache.set(key, c);
        }
        return c;
    }

    /**
     * Discretized blur based on depth layer. Baked into the sprite at render
     * time so the hot path never touches `ctx.filter`. Three buckets keep the
     * sprite cache size bounded while still producing a visible parallax haze.
     */
    private static blurForDepth(depth: number): number {
        if (depth < 0.33) return 2.5;
        if (depth < 0.66) return 1;
        return 0;
    }

    x: number;
    y: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
    swayPhase: number;
    swayFrequency: number;
    swayAmplitude: number;
    fallSpeed: number;
    depth: number;
    private size: number;
    private curl: number;
    private paletteIndex: number;
    private blur: number;
    private cachedCanvas!: HTMLCanvasElement;
    private logicalSize = 0;
    // Per-frame trig cache — written in update(), read in draw(). Avoids
    // recomputing cos/sin/scaleX three times per petal per frame.
    private cosR = 1;
    private sinR = 0;
    private scaleX = 1;

    constructor(
        cache: SpriteCache,
        width: number,
        height: number,
        scale: number,
    ) {
        const depth = Math.random();
        const depthScale = 0.6 + depth * 0.4;
        const size = random(20, 32) * depthScale;
        const curl = random(-0.15, 0.15);
        const paletteIndex = Math.floor(Math.random() * PETAL_PALETTES.length);

        this.x = random(0, width);
        this.y = random(-height * 0.1, height);
        // Base opacity plus an atmospheric-depth multiplier: far petals
        // (low depth) are more translucent, giving a cheap haze effect.
        this.opacity = (random(0.4, 0.7) + depth * 0.2) * (0.5 + depth * 0.5);
        this.rotation = random(0, Math.PI * 2);
        this.rotationSpeed = random(0.004, 0.012) * depthScale;
        this.swayPhase = random(0, Math.PI * 2);
        this.swayFrequency = random(0.004, 0.012);
        // Scale sway amplitude by depth so far petals sway a smaller apparent
        // distance, reinforcing the parallax illusion along with size/speed.
        this.swayAmplitude = random(20, 45) * 0.008 * depthScale;
        this.fallSpeed = random(0.15, 0.42) * depthScale;
        this.depth = depth;
        this.size = size;
        this.curl = curl;
        this.paletteIndex = paletteIndex;
        this.blur = Petal.blurForDepth(depth);
        this.bindSprite(cache, scale);
    }

    /** (Re)resolve the cached sprite for the given render scale. */
    bindSprite(cache: SpriteCache, scale: number) {
        this.cachedCanvas = Petal.getCachedCanvas(
            cache,
            this.size,
            this.curl,
            this.paletteIndex,
            this.blur,
            scale,
        );
        // Logical size is in CSS px, independent of the sprite bitmap size.
        this.logicalSize = petalSpriteLogicalSize(
            Math.round(this.size),
            this.blur,
        );
    }

    static createPetals(
        cache: SpriteCache,
        count: number,
        width: number,
        height: number,
        scale: number,
    ): Petal[] {
        const petals: Petal[] = Array.from(
            { length: count },
            () => new Petal(cache, width, height, scale),
        );
        petals.sort((a, b) => a.depth - b.depth);
        return petals;
    }

    update(W: number, H: number, framesPassed: number, time: number) {
        this.y += this.fallSpeed * framesPassed;
        this.x +=
            Math.sin(time * this.swayFrequency + this.swayPhase) *
            this.swayAmplitude *
            framesPassed;
        this.rotation += this.rotationSpeed * framesPassed;

        if (this.y > H + 30) {
            this.y = random(-40, -20);
            this.x = random(0, W);
        }

        this.cosR = Math.cos(this.rotation);
        this.sinR = Math.sin(this.rotation);
        // Pseudo-3D flip via non-uniform X scale. The 1.3× multiplier
        // decouples the flip cycle from the spin cycle so the petal appears
        // to tumble. Clamped away from zero so the sprite never collapses to
        // a degenerate sliver (which both looks bad and risks numerical
        // instability in the resulting transform matrix).
        let scaleX = Math.cos(this.rotation * 1.3);
        if (Math.abs(scaleX) < 0.1) scaleX = scaleX < 0 ? -0.1 : 0.1;
        this.scaleX = scaleX;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number) {
        const alpha = this.opacity;
        if (alpha <= 0) return;

        const { cosR, sinR, scaleX } = this;
        ctx.setTransform(
            cosR * scaleX * scale,
            sinR * scaleX * scale,
            -sinR * scale,
            cosR * scale,
            this.x * scale,
            this.y * scale,
        );

        ctx.globalAlpha = alpha;
        const half = this.logicalSize / 2;
        ctx.drawImage(
            this.cachedCanvas,
            -half,
            -half,
            this.logicalSize,
            this.logicalSize,
        );
    }
}

export default Petal;
