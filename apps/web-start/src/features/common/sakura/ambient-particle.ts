import { AMBIENT_COLORS } from './config';
import { SpriteCache, edgeFade, random, randomItem } from './utils';

function renderGlowCanvas(
    radius: number,
    color: string,
): HTMLCanvasElement {
    const logicalSize = Math.ceil(radius * 2 + 2);
    const c = document.createElement('canvas');
    c.width = logicalSize;
    c.height = logicalSize;
    const g = c.getContext('2d')!;
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
    ): HTMLCanvasElement {
        const radiusBucket = Math.round(radius * 2) / 2;
        const key = `amb|${radiusBucket}|${color}`;
        let c = cache.get(key);
        if (!c) {
            c = renderGlowCanvas(radiusBucket, color);
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
    private glowCanvas: HTMLCanvasElement;
    private logicalSize: number;

    constructor(cache: SpriteCache, width: number, height: number) {
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
        this.glowCanvas = AmbientParticle.getCachedCanvas(cache, radius, color);
        this.logicalSize = this.glowCanvas.width;
    }

    static create(
        cache: SpriteCache,
        count: number,
        width: number,
        height: number,
    ): AmbientParticle[] {
        return Array.from(
            { length: count },
            () => new AmbientParticle(cache, width, height),
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
        this.x = (((this.x + 10) % spanX) + spanX) % spanX - 10;
        this.y = (((this.y + 10) % spanY) + spanY) % spanY - 10;
    }

    draw(ctx: CanvasRenderingContext2D, H: number) {
        const alpha = this.opacity * edgeFade(this.y, H);
        if (alpha <= 0) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = alpha;
        const half = this.logicalSize / 2;
        ctx.drawImage(this.glowCanvas, this.x - half, this.y - half);
    }
}

export default AmbientParticle;
