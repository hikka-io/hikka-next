import { PETAL_PALETTES } from './config';
import { random, randomItem } from './utils';

function drawBlossom(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
) {
    const palette = randomItem(PETAL_PALETTES);
    const petalSize = size * 0.45;
    const petalCount = 5;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(random(0, Math.PI * 2));

    for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -size * 0.25);

        ctx.beginPath();
        ctx.moveTo(0, -petalSize * 0.4);
        ctx.bezierCurveTo(
            petalSize * 0.35,
            -petalSize * 0.3,
            petalSize * 0.38,
            petalSize * 0.15,
            0,
            petalSize * 0.45,
        );
        ctx.bezierCurveTo(
            -petalSize * 0.38,
            petalSize * 0.15,
            -petalSize * 0.35,
            -petalSize * 0.3,
            0,
            -petalSize * 0.4,
        );
        ctx.closePath();

        const grad = ctx.createLinearGradient(
            0,
            -petalSize * 0.4,
            0,
            petalSize * 0.45,
        );
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
    startX: number,
    startY: number,
    len: number,
    angle: number,
    thickness: number,
    maxDepth: number,
    depth: number,
) {
    const curveOffset = random(-len * 0.18, len * 0.18);
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
        startX,
        startY,
        len,
        angle,
        thickness,
        3,
        depth,
    );

    if (depth <= 1) {
        if (Math.random() < 0.8) {
            const size = isNarrow ? random(8, 12) : random(10, 15);
            drawBlossom(ctx, endX, endY, size);
        } else if (Math.random() < 0.5) {
            ctx.beginPath();
            ctx.arc(endX, endY, random(2, 4), 0, Math.PI * 2);
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = randomItem(PETAL_PALETTES).base;
            ctx.fill();
        }
        return;
    }

    const spread = random(0.35, 0.65);
    for (let i = 0; i < 2; i++) {
        const childAngle =
            angle + (i === 0 ? -spread : spread) + random(-0.1, 0.1);
        drawTwig(
            ctx,
            endX,
            endY,
            len * random(0.6, 0.75),
            childAngle,
            Math.max(1.2, thickness * 0.7),
            depth - 1,
            isNarrow,
        );
    }
}

function drawMainBranch(
    ctx: CanvasRenderingContext2D,
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
        curAngle += random(-0.08, 0.08);

        const { endX, endY } = drawBranchSegment(
            ctx,
            curX,
            curY,
            segLen + random(-4, 4),
            curAngle,
            curThick,
            segmentCount,
            segmentCount - i,
        );

        if (i > 0) {
            const sideSign = i % 2 === 0 ? 1 : -1;
            const subAngle =
                curAngle + sideSign * random(0.6, 1.0) + random(-0.1, 0.1);
            const subLen = segLen * random(0.6, 0.9);
            const subThick = Math.max(2.5, curThick * random(0.5, 0.65));

            drawTwig(ctx, curX, curY, subLen, subAngle, subThick, 2, isNarrow);
        }

        curThick = Math.max(1.5, curThick * random(0.8, 0.9));
        curX = endX;
        curY = endY;
    }

    const termSpread = random(0.4, 0.7);
    for (let i = 0; i < 2; i++) {
        const tAngle =
            curAngle +
            (i === 0 ? -termSpread : termSpread) +
            random(-0.08, 0.08);
        drawTwig(
            ctx,
            curX,
            curY,
            segLen * random(0.5, 0.7),
            tAngle,
            Math.max(1.5, curThick * 0.6),
            2,
            isNarrow,
        );
    }
}

class Branch {
    originX: number;
    originY: number;
    canvas: HTMLCanvasElement;
    swayPhase: number;
    swaySpeed: number;

    constructor(viewW: number, viewH: number) {
        const isNarrow = viewW < 768;

        const areaW = isNarrow ? viewW * 0.4 : viewW * 0.35;
        const areaH = isNarrow ? viewH * 0.35 : viewH * 0.32;

        const offscreen = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        offscreen.width = areaW * dpr;
        offscreen.height = areaH * dpr;

        const ctx = offscreen.getContext('2d')!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const startX = -25;
        const startY = isNarrow ? 15 : 45;
        const baseAngle = random(0.04, 0.1);
        const totalLen = isNarrow ? random(100, 130) : random(160, 210);
        const initialThickness = isNarrow ? 5.5 : 8;

        drawMainBranch(
            ctx,
            startX,
            startY,
            totalLen,
            baseAngle,
            initialThickness,
            isNarrow,
        );

        this.originX = 0;
        this.originY = 0;
        this.canvas = offscreen;
        this.swayPhase = random(0, Math.PI * 2);
        this.swaySpeed = random(0.006, 0.012);
    }

    /** Blit the pre-rendered branch onto the target canvas once. */
    blit(ctx: CanvasRenderingContext2D, dpr: number) {
        const bW = this.canvas.width / dpr;
        const bH = this.canvas.height / dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(this.canvas, this.originX, this.originY, bW, bH);
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
