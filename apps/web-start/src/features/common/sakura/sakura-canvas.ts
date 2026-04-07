import AmbientParticle from './ambient-particle';
import Branch from './branch';
import {
    AMBIENT_COUNT_DESKTOP,
    AMBIENT_COUNT_MOBILE,
    PETAL_COUNT_DESKTOP,
    PETAL_COUNT_MOBILE,
    TARGET_FRAME_TIME,
} from './config';
import Petal from './petal';
import { SpriteCache } from './utils';

/**
 * The particle canvas (petals + ambient glows) renders at 1× regardless of
 * the device pixel ratio. On a 2× retina display this drops backing-store
 * pixels by 4× and texture-upload bandwidth proportionally — the dominant
 * cost on the renderer + GPU compositor processes for a full-viewport canvas.
 *
 * Petals are soft organic shapes 16-28px wide; the perceptual softness from
 * 1× rendering is minimal compared to the CPU savings.
 *
 * The branch canvas keeps viewport DPR — it draws once at init and is
 * animated via CSS transform after that, so high DPR there is free.
 */
const PARTICLE_DPR = 1;

export interface SakuraCanvasConfig {
    isNarrow: boolean;
    branchTopOffset: number;
}

interface Viewport {
    W: number;
    H: number;
    dpr: number;
}

function readViewport(): Viewport {
    return {
        W: document.documentElement.clientWidth,
        H: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
    };
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

    private spriteCache: SpriteCache = new Map();
    private petals: Petal[] = [];
    private ambientParticles: AmbientParticle[] = [];
    private branches: Branch[] = [];

    private lastUpdate = performance.now();
    private time = 0;
    private animationFrame: number | undefined;

    constructor(
        branchCanvas: HTMLCanvasElement,
        particleCanvas: HTMLCanvasElement,
        config: SakuraCanvasConfig,
    ) {
        this.branchCanvas = branchCanvas;
        this.particleCanvas = particleCanvas;
        this.particleCtx = particleCanvas.getContext('2d')!;
        this.config = config;

        this.viewport = readViewport();
        this.branchH = this.viewport.H - this.config.branchTopOffset;

        // transformOrigin is fixed for the lifetime of the branch canvas —
        // set it once here instead of every frame in applyBranchSway.
        this.branchCanvas.style.transformOrigin = '5% 0';

        this.sizeParticleCanvas();
        this.createEntities();
        this.sizeBranchCanvasToBranch();
        this.blitBranches();
        this.applyBranchSway(0);
        this.play();
    }

    private sizeParticleCanvas() {
        const { W, H } = this.viewport;
        // Particle canvas backing is at PARTICLE_DPR (1×), CSS-stretched to
        // logical viewport size. See PARTICLE_DPR constant for rationale.
        this.particleCanvas.width = W * PARTICLE_DPR;
        this.particleCanvas.height = H * PARTICLE_DPR;
        this.particleCanvas.style.width = `${W}px`;
        this.particleCanvas.style.height = `${H}px`;
        this.particleCtx.setTransform(PARTICLE_DPR, 0, 0, PARTICLE_DPR, 0, 0);
    }

    /**
     * Size the DOM branch canvas to match the actual branch art (a fraction
     * of the viewport in the top-left corner) rather than the full viewport.
     * The pre-rendered Branch already knows its own area.
     */
    private sizeBranchCanvasToBranch() {
        const b = this.branches[0];
        if (!b) return;
        const { dpr } = this.viewport;
        const logicalW = b.canvas.width / dpr;
        const logicalH = b.canvas.height / dpr;

        this.branchCanvas.width = logicalW * dpr;
        this.branchCanvas.height = logicalH * dpr;
        this.branchCanvas.style.width = `${logicalW}px`;
        this.branchCanvas.style.height = `${logicalH}px`;
    }

    private createEntities() {
        const { W, H } = this.viewport;
        const { isNarrow } = this.config;

        const petalCount = isNarrow ? PETAL_COUNT_MOBILE : PETAL_COUNT_DESKTOP;
        const ambientCount = isNarrow
            ? AMBIENT_COUNT_MOBILE
            : AMBIENT_COUNT_DESKTOP;

        this.petals = Petal.createPetals(
            this.spriteCache,
            petalCount,
            W,
            H,
            PARTICLE_DPR,
        );
        this.ambientParticles = AmbientParticle.create(
            this.spriteCache,
            ambientCount,
            W,
            H,
            PARTICLE_DPR,
        );
        this.branches = [new Branch(W, this.branchH)];
    }

    private disposeBranches() {
        for (const b of this.branches) b.dispose();
        this.branches = [];
    }

    private blitBranches() {
        const bCtx = this.branchCanvas.getContext('2d')!;
        bCtx.setTransform(1, 0, 0, 1, 0, 0);
        bCtx.clearRect(0, 0, this.branchCanvas.width, this.branchCanvas.height);
        for (const branch of this.branches) {
            branch.blit(bCtx, this.viewport.dpr);
        }
    }

    private applyBranchSway(time: number) {
        // Only one branch currently — single-pivot CSS transform is correct.
        // For multiple branches in different viewport corners, this approach
        // would need per-branch DOM elements; note for the future.
        if (this.branches.length === 0) return;
        const angle = this.branches[0].computeSway(time);
        this.branchCanvas.style.transform = `rotate(${angle}rad)`;
    }

    resize() {
        const next = readViewport();
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
        this.sizeParticleCanvas();

        // Particle sprites are baked at PARTICLE_DPR (constant), so monitor
        // DPR changes don't invalidate them — just clamp positions to the
        // new bounds. Branch sprite is rebuilt below at the new viewport DPR.
        for (const p of this.petals) {
            p.x = (p.x / oldW) * next.W;
            p.y = (p.y / oldH) * next.H;
        }
        for (const a of this.ambientParticles) {
            a.x = (a.x / oldW) * next.W;
            a.y = (a.y / oldH) * next.H;
        }

        // Branches bake viewport-dependent geometry — rebuild them, then
        // resize the DOM canvas to match the new branch area.
        this.disposeBranches();
        this.branches = [new Branch(next.W, this.branchH)];
        this.sizeBranchCanvasToBranch();
        this.blitBranches();
    }

    private render(framesPassed: number) {
        const { W, H } = this.viewport;
        const pCtx = this.particleCtx;

        pCtx.setTransform(PARTICLE_DPR, 0, 0, PARTICLE_DPR, 0, 0);
        pCtx.clearRect(0, 0, W, H);

        for (const particle of this.ambientParticles) {
            particle.update(W, H, framesPassed, this.time);
            particle.draw(pCtx, PARTICLE_DPR, H);
        }

        for (const petal of this.petals) {
            petal.update(W, H, framesPassed, this.time);
            petal.draw(pCtx, PARTICLE_DPR, H);
        }

        pCtx.globalAlpha = 1;

        this.applyBranchSway(this.time);
    }

    private loop = () => {
        const now = performance.now();
        const msPassed = now - this.lastUpdate;
        this.lastUpdate = now;

        // Frames that would have passed at the target frame rate (60fps).
        // Cap at 4 frames to avoid huge jumps after tab-hide or long stalls.
        const framesPassed = Math.min(msPassed / TARGET_FRAME_TIME, 4);

        this.time += framesPassed;
        this.render(framesPassed);

        this.animationFrame = requestAnimationFrame(this.loop);
    };

    play() {
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

    dispose() {
        this.pause();
        this.disposeBranches();
        this.petals = [];
        this.ambientParticles = [];
        // Drop sprite canvases so GC can reclaim them (instance-scoped cache).
        for (const c of this.spriteCache.values()) {
            c.width = 0;
            c.height = 0;
        }
        this.spriteCache.clear();
    }
}

export default SakuraCanvas;
