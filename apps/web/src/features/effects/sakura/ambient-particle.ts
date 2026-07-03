import { AMBIENT_COLORS } from './config';
import { random, randomItem, type SpriteCache } from './utils';

function glowLogicalSize(radiusBucket: number): number {
    return Math.ceil(radiusBucket * 2 + 2);
}

function renderGlowCanvas(
    radius: number,
    color: string,
    scale: number,
): HTMLCanvasElement {
    const logicalSize = glowLogicalSize(radius);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(logicalSize * scale));
    c.height = c.width;
    const g = c.getContext('2d')!;
    g.scale(scale, scale);
    const cx = logicalSize / 2;
    const gradient = g.createRadialGradient(cx, cx, 0, cx, cx, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    g.fillStyle = gradient;
    g.beginPath();
    g.arc(cx, cx, radius, 0, Math.PI * 2);
    g.fill();
    return c;
}

class AmbientParticle {
    private static getCachedCanvas(
        cache: SpriteCache,
        radius: number,
        color: string,
        scale: number,
    ): HTMLCanvasElement {
        const radiusBucket = Math.round(radius * 2) / 2;
        const key = `amb|${radiusBucket}|${color}|${scale}`;
        let c = cache.get(key);
        if (!c) {
            c = renderGlowCanvas(radiusBucket, color, scale);
            cache.set(key, c);
        }
        return c;
    }

    x: number;
    y: number;
    opacity: number;
    baseOpacity: number;
    opacityPhase: number;
    opacitySpeed: number;
    driftX: number;
    driftY: number;
    wanderPhase: number;
    wanderSpeed: number;
    private radius: number;
    private color: string;
    private glowCanvas!: HTMLCanvasElement;
    private logicalSize = 0;

    constructor(
        cache: SpriteCache,
        width: number,
        height: number,
        scale: number,
    ) {
        const radius = random(1.5, 3.5);
        const color = randomItem(AMBIENT_COLORS);

        this.x = random(0, width);
        this.y = random(0, height);
        this.baseOpacity = random(0.15, 0.4);
        this.opacity = this.baseOpacity;
        this.opacityPhase = random(0, Math.PI * 2);
        this.opacitySpeed = random(0.003, 0.008);
        this.driftX = random(-0.1, 0.1);
        this.driftY = random(-0.08, 0.15);
        this.wanderPhase = random(0, Math.PI * 2);
        this.wanderSpeed = random(0.002, 0.005);
        this.radius = radius;
        this.color = color;
        this.bindSprite(cache, scale);
    }

    /** (Re)resolve the cached glow sprite for the given render scale. */
    bindSprite(cache: SpriteCache, scale: number) {
        this.glowCanvas = AmbientParticle.getCachedCanvas(
            cache,
            this.radius,
            this.color,
            scale,
        );
        this.logicalSize = glowLogicalSize(Math.round(this.radius * 2) / 2);
    }

    static create(
        cache: SpriteCache,
        count: number,
        width: number,
        height: number,
        scale: number,
    ): AmbientParticle[] {
        return Array.from(
            { length: count },
            () => new AmbientParticle(cache, width, height, scale),
        );
    }

    update(W: number, H: number, framesPassed: number, time: number) {
        this.x +=
            (this.driftX +
                Math.sin(time * this.wanderSpeed + this.wanderPhase) * 0.15) *
            framesPassed;
        this.y += this.driftY * framesPassed;
        this.opacity =
            this.baseOpacity +
            Math.sin(time * this.opacitySpeed + this.opacityPhase) * 0.12;

        const spanX = W + 20;
        const spanY = H + 20;
        this.x = ((((this.x + 10) % spanX) + spanX) % spanX) - 10;
        this.y = ((((this.y + 10) % spanY) + spanY) % spanY) - 10;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const alpha = this.opacity;
        if (alpha <= 0) return;

        ctx.globalAlpha = alpha;
        const half = this.logicalSize / 2;
        ctx.drawImage(
            this.glowCanvas,
            this.x - half,
            this.y - half,
            this.logicalSize,
            this.logicalSize,
        );
    }
}

export default AmbientParticle;
