import { PETAL_PALETTES } from './config';
import {
    mulberry32,
    randomItemWith,
    randomWith,
    tracePetalPath,
} from './utils';

type Rng = () => number;

function drawBlossom(
    ctx: CanvasRenderingContext2D,
    rng: Rng,
    x: number,
    y: number,
    size: number,
) {
    const palette = randomItemWith(rng, PETAL_PALETTES);
    const petalSize = size * 0.45;
    const petalCount = 5;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(randomWith(rng, 0, Math.PI * 2));

    for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -size * 0.25);

        const s = petalSize * 0.9;
        tracePetalPath(ctx, s, 0);

        const grad = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
        grad.addColorStop(0, palette.highlight);
        grad.addColorStop(0.45, palette.base);
        grad.addColorStop(1, palette.tip);

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#FFD700';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2);
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#FFF8DC';
    ctx.fill();

    ctx.restore();
}

function drawBranchSegment(
    ctx: CanvasRenderingContext2D,
    rng: Rng,
    startX: number,
    startY: number,
    len: number,
    angle: number,
    thickness: number,
    maxDepth: number,
    depth: number,
) {
    const curveOffset = randomWith(rng, -len * 0.18, len * 0.18);
    const endX = startX + Math.cos(angle) * len;
    const endY = startY + Math.sin(angle) * len;
    const ctrlX =
        (startX + endX) / 2 + Math.cos(angle + Math.PI / 2) * curveOffset;
    const ctrlY =
        (startY + endY) / 2 + Math.sin(angle + Math.PI / 2) * curveOffset;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);

    const depthRatio = depth / maxDepth;
    const r = Math.round(72 + (1 - depthRatio) * 50);
    const g = Math.round(45 + (1 - depthRatio) * 45);
    const b = Math.round(35 + (1 - depthRatio) * 40);
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.9;
    ctx.stroke();

    return { endX, endY, ctrlX, ctrlY };
}

function drawTwig(
    ctx: CanvasRenderingContext2D,
    rng: Rng,
    startX: number,
    startY: number,
    len: number,
    angle: number,
    thickness: number,
    depth: number,
    isNarrow: boolean,
) {
    if (depth <= 0 || len < 2) return;

    const { endX, endY } = drawBranchSegment(
        ctx,
        rng,
        startX,
        startY,
        len,
        angle,
        thickness,
        3,
        depth,
    );

    if (depth <= 1) {
        if (rng() < 0.8) {
            const size = isNarrow
                ? randomWith(rng, 8, 12)
                : randomWith(rng, 10, 15);
            drawBlossom(ctx, rng, endX, endY, size);
        } else if (rng() < 0.5) {
            ctx.beginPath();
            ctx.arc(endX, endY, randomWith(rng, 2, 4), 0, Math.PI * 2);
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = randomItemWith(rng, PETAL_PALETTES).base;
            ctx.fill();
        }
        return;
    }

    const spread = randomWith(rng, 0.35, 0.65);
    for (let i = 0; i < 2; i++) {
        const childAngle =
            angle + (i === 0 ? -spread : spread) + randomWith(rng, -0.1, 0.1);
        drawTwig(
            ctx,
            rng,
            endX,
            endY,
            len * randomWith(rng, 0.6, 0.75),
            childAngle,
            Math.max(1.2, thickness * 0.7),
            depth - 1,
            isNarrow,
        );
    }
}

function drawMainBranch(
    ctx: CanvasRenderingContext2D,
    rng: Rng,
    startX: number,
    startY: number,
    totalLen: number,
    baseAngle: number,
    thickness: number,
    isNarrow: boolean,
) {
    const segmentCount = isNarrow ? 4 : 5;
    const segLen = totalLen / segmentCount;

    let curX = startX;
    let curY = startY;
    let curAngle = baseAngle;
    let curThick = thickness;

    for (let i = 0; i < segmentCount; i++) {
        curAngle += randomWith(rng, -0.08, 0.08);

        const { endX, endY } = drawBranchSegment(
            ctx,
            rng,
            curX,
            curY,
            segLen + randomWith(rng, -4, 4),
            curAngle,
            curThick,
            segmentCount,
            segmentCount - i,
        );

        if (i > 0) {
            const sideSign = i % 2 === 0 ? 1 : -1;
            const subAngle =
                curAngle +
                sideSign * randomWith(rng, 0.6, 1.0) +
                randomWith(rng, -0.1, 0.1);
            const subLen = segLen * randomWith(rng, 0.6, 0.9);
            const subThick = Math.max(
                2.5,
                curThick * randomWith(rng, 0.5, 0.65),
            );

            drawTwig(
                ctx,
                rng,
                curX,
                curY,
                subLen,
                subAngle,
                subThick,
                2,
                isNarrow,
            );
        }

        curThick = Math.max(1.5, curThick * randomWith(rng, 0.8, 0.9));
        curX = endX;
        curY = endY;
    }

    const termSpread = randomWith(rng, 0.4, 0.7);
    for (let i = 0; i < 2; i++) {
        const tAngle =
            curAngle +
            (i === 0 ? -termSpread : termSpread) +
            randomWith(rng, -0.08, 0.08);
        drawTwig(
            ctx,
            rng,
            curX,
            curY,
            segLen * randomWith(rng, 0.5, 0.7),
            tAngle,
            Math.max(1.5, curThick * 0.6),
            2,
            isNarrow,
        );
    }
}

class Branch {
    canvas: HTMLCanvasElement;
    swayPhase: number;
    swaySpeed: number;

    constructor(
        viewW: number,
        viewH: number,
        isNarrow: boolean,
        dpr: number,
        seed: number,
    ) {
        const rng = mulberry32(seed);
        const areaW = isNarrow ? viewW * 0.4 : viewW * 0.35;
        const areaH = isNarrow ? viewH * 0.35 : viewH * 0.32;

        const offscreen = document.createElement('canvas');
        offscreen.width = areaW * dpr;
        offscreen.height = areaH * dpr;

        const ctx = offscreen.getContext('2d')!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const startX = -25;
        const startY = isNarrow ? 15 : 45;
        const baseAngle = randomWith(rng, 0.04, 0.1);
        const totalLen = isNarrow
            ? randomWith(rng, 100, 130)
            : randomWith(rng, 160, 210);
        const initialThickness = isNarrow ? 5.5 : 8;

        drawMainBranch(
            ctx,
            rng,
            startX,
            startY,
            totalLen,
            baseAngle,
            initialThickness,
            isNarrow,
        );

        this.canvas = offscreen;
        this.swayPhase = randomWith(rng, 0, Math.PI * 2);
        this.swaySpeed = randomWith(rng, 0.006, 0.012);
    }

    /** Blit the pre-rendered branch onto the target canvas once. */
    blit(ctx: CanvasRenderingContext2D, dpr: number) {
        const bW = this.canvas.width / dpr;
        const bH = this.canvas.height / dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(this.canvas, 0, 0, bW, bH);
    }

    /** Instantaneous sway angle in radians, driven by accumulated time. */
    computeSway(time: number): number {
        return (
            Math.sin(time * this.swaySpeed + this.swayPhase) * (Math.PI / 120)
        );
    }

    dispose() {
        this.canvas.width = 0;
        this.canvas.height = 0;
    }
}

export default Branch;
