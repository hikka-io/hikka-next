import AmbientParticle from './ambient-particle';
import Branch from './branch';
import {
    AMBIENT_COUNT_DESKTOP,
    AMBIENT_COUNT_MOBILE,
    FRAME_HEALTH,
    MAX_RENDER_SCALE_DESKTOP,
    MAX_RENDER_SCALE_MOBILE,
    PETAL_COUNT_DESKTOP,
    PETAL_COUNT_MOBILE,
    TARGET_FRAME_TIME,
} from './config';
import { FrameHealthMonitor } from './frame-health';
import Petal from './petal';
import { computeRenderScale, type SpriteCache } from './utils';

export interface SakuraCanvasConfig {
    isNarrow: boolean;
    branchTopOffset: number;
    reducedMotion: boolean;
}

interface Viewport {
    W: number;
    H: number;
    dpr: number;
}

/**
 * Controller for the sakura animation. Owns the render loop, timing,
 * particles, and resize. React layer only creates/disposes the instance.
 *
 * The branch is drawn once into its DOM canvas and animated purely via
 * CSS transform on that element — it never passes through the rAF render loop.
 */
export class SakuraCanvas {
    private branchCanvas: HTMLCanvasElement;
    private particleCanvas: HTMLCanvasElement;
    private particleCtx: CanvasRenderingContext2D;
    private config: SakuraCanvasConfig;

    private viewport: Viewport;
    private branchH: number;
    private renderScale: number;

    private spriteCache: SpriteCache = new Map();
    private petals: Petal[] = [];
    private ambientParticles: AmbientParticle[] = [];
    private branch: Branch | null = null;

    private lastUpdate = performance.now();
    private time = 0;
    private animationFrame: number | undefined;
    private lastSwayAngle = Number.NaN;

    // One seed per instance: every Branch rebuild (resize) redraws the same
    // tree instead of re-rolling the fractal, which made the branch visibly
    // morph while dragging the window corner.
    private branchSeed = Math.floor(Math.random() * 0xffffffff);

    private frameHealth = new FrameHealthMonitor(FRAME_HEALTH);
    // One-way ratchet: once a device proves too slow for the scaled canvas,
    // stay at 1× for the life of this instance (no oscillation).
    private degraded = false;

    constructor(
        branchCanvas: HTMLCanvasElement,
        particleCanvas: HTMLCanvasElement,
        config: SakuraCanvasConfig,
    ) {
        this.branchCanvas = branchCanvas;
        this.particleCanvas = particleCanvas;
        this.particleCtx = particleCanvas.getContext('2d')!;
        this.config = config;

        this.viewport = this.readViewport();
        this.branchH = this.viewport.H - this.config.branchTopOffset;
        this.renderScale = computeRenderScale(
            this.viewport.dpr,
            config.isNarrow
                ? MAX_RENDER_SCALE_MOBILE
                : MAX_RENDER_SCALE_DESKTOP,
        );

        // transformOrigin is fixed for the lifetime of the branch canvas —
        // set it once here instead of every frame in applyBranchSway.
        this.branchCanvas.style.transformOrigin = '5% 0';

        this.sizeParticleCanvas();
        this.createEntities();
        this.sizeBranchCanvasToBranch();
        this.blitBranch();
        // Reduced motion: the branch renders as static art — no sway, no
        // particles, no render loop.
        if (!config.reducedMotion) {
            this.applyBranchSway(0);
            this.play();
        }
    }

    /**
     * Measure the particle canvas element itself. Its CSS size (w-full,
     * h-lvh) is the ground truth: lvh does not change when the mobile URL
     * bar collapses, so URL-bar resize events yield an identical rect and
     * fall into resize()'s early return instead of rebuilding the branch
     * and remapping every particle mid-scroll. It also keeps the bitmap
     * exactly matching the CSS box (innerHeight-based sizing stretched it).
     */
    private readViewport(): Viewport {
        const rect = this.particleCanvas.getBoundingClientRect();
        return {
            W: Math.round(rect.width),
            H: Math.round(rect.height),
            dpr: window.devicePixelRatio || 1,
        };
    }

    private sizeParticleCanvas() {
        const { W, H } = this.viewport;
        const s = this.renderScale;
        this.particleCanvas.width = Math.round(W * s);
        this.particleCanvas.height = Math.round(H * s);
    }

    /**
     * Size the DOM branch canvas to match the actual branch art (a fraction
     * of the viewport in the top-left corner) rather than the full viewport.
     * The pre-rendered Branch already knows its own area.
     */
    private sizeBranchCanvasToBranch() {
        const b = this.branch;
        if (!b) return;
        const { dpr } = this.viewport;
        this.branchCanvas.width = b.canvas.width;
        this.branchCanvas.height = b.canvas.height;
        this.branchCanvas.style.width = `${b.canvas.width / dpr}px`;
        this.branchCanvas.style.height = `${b.canvas.height / dpr}px`;
    }

    private createEntities() {
        const { W, H } = this.viewport;
        const { isNarrow } = this.config;

        const petalCount = isNarrow ? PETAL_COUNT_MOBILE : PETAL_COUNT_DESKTOP;
        const ambientCount = isNarrow
            ? AMBIENT_COUNT_MOBILE
            : AMBIENT_COUNT_DESKTOP;

        if (!this.config.reducedMotion) {
            this.petals = Petal.createPetals(
                this.spriteCache,
                petalCount,
                W,
                H,
                this.renderScale,
            );
            this.ambientParticles = AmbientParticle.create(
                this.spriteCache,
                ambientCount,
                W,
                H,
                this.renderScale,
            );
        }
        this.branch = new Branch(
            W,
            this.branchH,
            this.config.isNarrow,
            this.viewport.dpr,
            this.branchSeed,
        );
    }

    private blitBranch() {
        if (!this.branch) return;
        const bCtx = this.branchCanvas.getContext('2d')!;
        bCtx.setTransform(1, 0, 0, 1, 0, 0);
        bCtx.clearRect(0, 0, this.branchCanvas.width, this.branchCanvas.height);
        this.branch.blit(bCtx, this.viewport.dpr);
    }

    private applyBranchSway(time: number) {
        if (!this.branch) return;
        const angle = this.branch.computeSway(time);
        // Skip the style write (and the string allocation) when the angle
        // change is below visible threshold (~0.03°).
        if (Math.abs(angle - this.lastSwayAngle) < 0.0005) return;
        this.lastSwayAngle = angle;
        this.branchCanvas.style.transform = `rotate(${angle}rad)`;
    }

    resize() {
        const next = this.readViewport();
        // A hidden/unlaid-out canvas measures 0×0 — keep the old viewport.
        if (next.W === 0 || next.H === 0) return;
        if (
            next.W === this.viewport.W &&
            next.H === this.viewport.H &&
            next.dpr === this.viewport.dpr
        ) {
            return;
        }

        const { W: oldW, H: oldH } = this.viewport;
        this.viewport = next;
        this.branchH = next.H - this.config.branchTopOffset;

        // A DPR change (window dragged between monitors) shifts the render
        // scale, so re-bind every sprite at the new resolution. A degraded
        // instance stays pinned at 1× (the ratchet holds).
        const nextScale = this.degraded
            ? 1
            : computeRenderScale(
                  next.dpr,
                  this.config.isNarrow
                      ? MAX_RENDER_SCALE_MOBILE
                      : MAX_RENDER_SCALE_DESKTOP,
              );
        if (nextScale !== this.renderScale) {
            this.renderScale = nextScale;
            this.clearSpriteCache();
            for (const p of this.petals)
                p.bindSprite(this.spriteCache, nextScale);
            for (const a of this.ambientParticles)
                a.bindSprite(this.spriteCache, nextScale);
        }

        this.sizeParticleCanvas();

        // Positions are kept in CSS pixels — just clamp them to the new
        // bounds. The branch sprite is rebuilt below at the new DPR.
        for (const p of this.petals) {
            p.x = (p.x / oldW) * next.W;
            p.y = (p.y / oldH) * next.H;
        }
        for (const a of this.ambientParticles) {
            a.x = (a.x / oldW) * next.W;
            a.y = (a.y / oldH) * next.H;
        }

        // The branch bakes viewport-dependent geometry — rebuild it, then
        // resize the DOM canvas to match the new branch area.
        this.branch?.dispose();
        this.branch = new Branch(
            next.W,
            this.branchH,
            this.config.isNarrow,
            next.dpr,
            this.branchSeed,
        );
        this.sizeBranchCanvasToBranch();
        this.blitBranch();
    }

    private render(framesPassed: number) {
        const { W, H } = this.viewport;
        const s = this.renderScale;
        const pCtx = this.particleCtx;

        // Clear in bitmap space (identity transform) — the previous frame's
        // last petal draw left a scaled/rotated transform.
        pCtx.setTransform(1, 0, 0, 1, 0, 0);
        pCtx.clearRect(
            0,
            0,
            this.particleCanvas.width,
            this.particleCanvas.height,
        );

        // Ambient glows are axis-aligned — one scale transform covers the
        // whole loop instead of a setTransform per particle.
        pCtx.setTransform(s, 0, 0, s, 0, 0);
        for (const particle of this.ambientParticles) {
            particle.update(W, H, framesPassed, this.time);
            particle.draw(pCtx);
        }

        for (const petal of this.petals) {
            petal.update(W, H, framesPassed, this.time);
            petal.draw(pCtx, s);
        }

        pCtx.globalAlpha = 1;

        this.applyBranchSway(this.time);
    }

    /** Fall back to 1× rendering — exactly the pre-DPR cost profile. */
    private degradeRenderScale() {
        this.degraded = true;
        this.renderScale = 1;
        this.sizeParticleCanvas();
        this.clearSpriteCache();
        for (const p of this.petals) p.bindSprite(this.spriteCache, 1);
        for (const a of this.ambientParticles)
            a.bindSprite(this.spriteCache, 1);
    }

    private loop = () => {
        const now = performance.now();
        const msPassed = now - this.lastUpdate;
        this.lastUpdate = now;

        if (
            !this.degraded &&
            this.renderScale > 1 &&
            this.frameHealth.record(msPassed)
        ) {
            this.degradeRenderScale();
        }

        // Frames that would have passed at the target frame rate (60fps).
        // Cap at 4 frames to avoid huge jumps after tab-hide or long stalls.
        const framesPassed = Math.min(msPassed / TARGET_FRAME_TIME, 4);

        this.time += framesPassed;
        this.render(framesPassed);

        this.animationFrame = requestAnimationFrame(this.loop);
    };

    play() {
        if (this.config.reducedMotion) return;
        if (this.animationFrame !== undefined) return;
        this.lastUpdate = performance.now();
        this.animationFrame = requestAnimationFrame(this.loop);
    }

    pause() {
        if (this.animationFrame !== undefined) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }
    }

    private clearSpriteCache() {
        // Drop sprite canvases so GC can reclaim them (instance-scoped cache).
        for (const c of this.spriteCache.values()) {
            c.width = 0;
            c.height = 0;
        }
        this.spriteCache.clear();
    }

    dispose() {
        this.pause();
        this.branch?.dispose();
        this.branch = null;
        this.petals = [];
        this.ambientParticles = [];
        this.clearSpriteCache();
    }
}

export default SakuraCanvas;
