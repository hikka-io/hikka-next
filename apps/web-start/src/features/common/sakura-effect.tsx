'use client';

import { useEffect, useRef } from 'react';

const PETAL_COUNT_DESKTOP = 40;
const PETAL_COUNT_MOBILE = 16;
const AMBIENT_COUNT_DESKTOP = 15;
const AMBIENT_COUNT_MOBILE = 6;

const PETAL_PALETTES = [
    { base: '#F9A8B8', tip: '#E8718A', highlight: '#FFDDE4' },
    { base: '#F4929E', tip: '#E05A78', highlight: '#FFD1DC' },
    { base: '#FFB0C1', tip: '#F07A94', highlight: '#FFE0E8' },
    { base: '#F7A0B5', tip: '#E66B88', highlight: '#FFDAE3' },
];

const AMBIENT_COLORS = ['#FFF5E6', '#FFE4B5', '#FFFAF0'];

// --- Interfaces ---

interface Petal {
    x: number;
    y: number;
    size: number;
    palette: (typeof PETAL_PALETTES)[number];
    opacity: number;
    rotation: number;
    rotationSpeed: number;
    swayPhase: number;
    swayFrequency: number;
    swayAmplitude: number;
    fallSpeed: number;
    depth: number;
    curl: number;
    cachedCanvas: HTMLCanvasElement;
}

interface AmbientParticle {
    x: number;
    y: number;
    radius: number;
    color: string;
    opacity: number;
    baseOpacity: number;
    opacityPhase: number;
    opacitySpeed: number;
    driftX: number;
    driftY: number;
    wanderPhase: number;
    wanderSpeed: number;
    glowCanvas: HTMLCanvasElement;
}

interface BranchTree {
    originX: number;
    originY: number;
    canvas: HTMLCanvasElement; // pre-rendered branch image
    swayPhase: number;
    swaySpeed: number;
}

// --- Utilities ---

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- Petal creation ---

function renderPetalCanvas(
    size: number,
    curl: number,
    palette: (typeof PETAL_PALETTES)[number],
    blur: number,
): HTMLCanvasElement {
    const padding = blur > 0.5 ? Math.ceil(blur * 3) : 0;
    const canvasSize = Math.ceil(size + padding * 2);
    const c = document.createElement('canvas');
    c.width = canvasSize;
    c.height = canvasSize;
    const ctx = c.getContext('2d')!;

    if (blur > 0.5) {
        ctx.filter = `blur(${blur.toFixed(1)}px)`;
    }

    const cx = canvasSize / 2;
    const s = size;

    ctx.translate(cx, cx);

    // Petal shape
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

    const grad = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
    grad.addColorStop(0, palette.highlight);
    grad.addColorStop(0.4, palette.base);
    grad.addColorStop(1, palette.tip);

    ctx.fillStyle = grad;
    ctx.fill();

    // Center vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.35);
    ctx.quadraticCurveTo(s * curl * 0.5, 0, 0, s * 0.4);
    ctx.strokeStyle = palette.tip;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    return c;
}

function createPetal(width: number, height: number, startAbove = false): Petal {
    const depth = Math.random();
    const depthScale = 0.6 + depth * 0.4;
    const size = random(16, 28) * depthScale;
    const curl = random(-0.15, 0.15);
    const palette = randomItem(PETAL_PALETTES);
    const blur = (1 - depth) * 2.5;

    return {
        x: random(0, width),
        y: startAbove
            ? random(-height * 0.2, -20)
            : random(-height * 0.1, height),
        size,
        palette,
        opacity: random(0.4, 0.7) + depth * 0.2,
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(0.003, 0.014) * depthScale,
        swayPhase: random(0, Math.PI * 2),
        swayFrequency: random(0.004, 0.012),
        swayAmplitude: random(20, 45),
        fallSpeed: random(0.12, 0.35) * depthScale,
        depth,
        curl,
        cachedCanvas: renderPetalCanvas(size, curl, palette, blur),
    };
}

function createGlowCanvas(radius: number, color: string): HTMLCanvasElement {
    const size = Math.ceil(radius * 2 + 2);
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const g = c.getContext('2d')!;
    const cx = size / 2;
    const gradient = g.createRadialGradient(cx, cx, 0, cx, cx, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    g.fillStyle = gradient;
    g.beginPath();
    g.arc(cx, cx, radius, 0, Math.PI * 2);
    g.fill();
    return c;
}

function createAmbientParticle(width: number, height: number): AmbientParticle {
    const radius = random(1.5, 3.5);
    const color = randomItem(AMBIENT_COLORS);
    return {
        x: random(0, width),
        y: random(0, height),
        radius,
        color,
        baseOpacity: random(0.15, 0.4),
        opacity: random(0.15, 0.4),
        opacityPhase: random(0, Math.PI * 2),
        opacitySpeed: random(0.003, 0.008),
        driftX: random(-0.1, 0.1),
        driftY: random(-0.08, 0.15),
        wanderPhase: random(0, Math.PI * 2),
        wanderSpeed: random(0.002, 0.005),
        glowCanvas: createGlowCanvas(radius, color),
    };
}

// --- Recursive branch rendering ---

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

    // Center
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

/**
 * Draw a curved branch segment and return the endpoint.
 */
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

/**
 * Recursively draw a twig (short sub-branch that terminates in blossoms).
 */
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

    // Terminal: draw blossom or bud
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

    // Fork into 2 sub-twigs
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

/**
 * Draw a main branch with evenly distributed sub-branches along its length.
 * The main branch is drawn as multiple connected segments, with sub-branches
 * sprouting at regular intervals — like the reference image.
 */
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
        // Slight angle drift along the main branch for organic feel
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

        // Spawn a sub-branch at each joint (skip first segment)
        if (i > 0) {
            const sideSign = i % 2 === 0 ? 1 : -1;
            const subAngle =
                curAngle + sideSign * random(0.6, 1.0) + random(-0.1, 0.1);
            const subLen = segLen * random(0.6, 0.9);
            const subThick = Math.max(2.5, curThick * random(0.5, 0.65));

            drawTwig(ctx, curX, curY, subLen, subAngle, subThick, 2, isNarrow);
        }

        // Taper
        curThick = Math.max(1.5, curThick * random(0.8, 0.9));
        curX = endX;
        curY = endY;
    }

    // Terminal fork at the end of main branch — 2 twigs
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

/**
 * Pre-render a full branch tree to an offscreen canvas.
 * The branch grows from (originX, originY) and the offscreen canvas
 * is sized to a bounding area around the origin.
 */
function createBranchTree(
    mirrored: boolean,
    viewW: number,
    viewH: number,
): BranchTree {
    const isNarrow = viewW < 768;

    // Branch area — generous padding for blossoms and sub-branches
    const areaW = isNarrow ? viewW * 0.4 : viewW * 0.35;
    const areaH = isNarrow ? viewH * 0.35 : viewH * 0.32;

    const offscreen = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    offscreen.width = areaW * dpr;
    offscreen.height = areaH * dpr;

    const ctx = offscreen.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Branch starts from top corner of offscreen canvas
    const startX = mirrored ? areaW - 10 : -25;
    const startY = 45;

    // Initial angle: nearly horizontal, very slight downward slant
    const baseAngle = mirrored ? random(0.03, 0.08) : random(0.04, 0.1);

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

    // Position on viewport: top corner
    const originX = mirrored ? viewW - areaW : 0;
    const originY = 0;

    return {
        originX,
        originY,
        canvas: offscreen,
        swayPhase: random(0, Math.PI * 2),
        swaySpeed: random(0.006, 0.012),
    };
}

// --- Draw functions ---

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.rotation);

    const scaleX = Math.cos(petal.rotation * 2.5);
    ctx.scale(scaleX === 0 ? 0.1 : scaleX, 1);

    ctx.globalAlpha = petal.opacity;
    const c = petal.cachedCanvas;
    ctx.drawImage(c, -c.width / 2, -c.height / 2);

    ctx.restore();
}

function drawAmbientParticle(
    ctx: CanvasRenderingContext2D,
    particle: AmbientParticle,
) {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    const size = particle.glowCanvas.width;
    ctx.drawImage(
        particle.glowCanvas,
        particle.x - size / 2,
        particle.y - size / 2,
    );
    ctx.restore();
}

// --- Component ---

const SakuraEffect = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const dpr = window.devicePixelRatio || 1;

        let branches: BranchTree[] = [];
        let W = window.innerWidth;
        let H = window.innerHeight;

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas!.width = W * dpr;
            canvas!.height = H * dpr;
            canvas!.style.width = `${W}px`;
            canvas!.style.height = `100lvh`;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            branches = [createBranchTree(false, W, H)];
        }

        resize();

        const isNarrow = W < 768;
        const petalCount = isNarrow ? PETAL_COUNT_MOBILE : PETAL_COUNT_DESKTOP;
        const ambientCount = isNarrow ? AMBIENT_COUNT_MOBILE : AMBIENT_COUNT_DESKTOP;

        const petals: Petal[] = Array.from({ length: petalCount }, () =>
            createPetal(W, H),
        );
        petals.sort((a, b) => a.depth - b.depth);

        const ambientParticles: AmbientParticle[] = Array.from(
            { length: ambientCount },
            () => createAmbientParticle(W, H),
        );

        function updatePetal(petal: Petal) {
            petal.y += petal.fallSpeed;
            petal.x +=
                Math.sin(time * petal.swayFrequency + petal.swayPhase) *
                petal.swayAmplitude *
                0.008;
            petal.rotation += petal.rotationSpeed;

            if (petal.y > H + 30) {
                petal.y = random(-40, -20);
                petal.x = random(0, W);
            }
        }

        function updateAmbientParticle(particle: AmbientParticle) {
            particle.x +=
                particle.driftX +
                Math.sin(time * particle.wanderSpeed + particle.wanderPhase) *
                    0.15;
            particle.y += particle.driftY;
            particle.opacity =
                particle.baseOpacity +
                Math.sin(time * particle.opacitySpeed + particle.opacityPhase) *
                    0.12;

            if (particle.x < -10) particle.x = W + 10;
            if (particle.x > W + 10) particle.x = -10;
            if (particle.y < -10) particle.y = H + 10;
            if (particle.y > H + 10) particle.y = -10;
        }

        function animate() {
            time++;
            ctx!.clearRect(0, 0, W, H);

            for (const particle of ambientParticles) {
                updateAmbientParticle(particle);
                drawAmbientParticle(ctx!, particle);
            }

            for (const branch of branches) {
                ctx!.save();

                const swayAngle =
                    Math.sin(time * branch.swaySpeed + branch.swayPhase) *
                    (Math.PI / 120);

                const pivotX =
                    branch.originX + (branch.canvas.width / dpr) * 0.05;
                const pivotY = branch.originY;
                ctx!.translate(pivotX, pivotY);
                ctx!.rotate(swayAngle);
                ctx!.translate(-pivotX, -pivotY);

                ctx!.drawImage(
                    branch.canvas,
                    branch.originX,
                    branch.originY,
                    branch.canvas.width / dpr,
                    branch.canvas.height / dpr,
                );

                ctx!.restore();
            }

            for (const petal of petals) {
                updatePetal(petal);
                drawPetal(ctx!, petal);
            }

            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);

        function onVisibilityChange() {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animationId = requestAnimationFrame(animate);
            }
        }

        let resizeTimeout: ReturnType<typeof setTimeout>;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 150);
        }

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            clearTimeout(resizeTimeout);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100lvh',
                pointerEvents: 'none',
                zIndex: 50,
                maskImage:
                    'linear-gradient(to bottom, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0))',
                WebkitMaskImage:
                    'linear-gradient(to bottom, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0))',
            }}
        />
    );
};

export default SakuraEffect;
