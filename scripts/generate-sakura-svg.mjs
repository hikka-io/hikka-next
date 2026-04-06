#!/usr/bin/env node
// Generates static sakura SVG assets from the same geometry the original
// canvas implementation used. Run: `node scripts/generate-sakura-svg.mjs`
//
// Output: apps/web-start/public/sakura/
//   petal-{palette}-{curl}.svg   (12 files, single nominal size, scaled in CSS)
//   branch-desktop-{n}.svg       (5 files, seeded variants)
//   branch-mobile-{n}.svg        (5 files, seeded variants)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(
    __dirname,
    '..',
    'apps',
    'web-start',
    'public',
    'sakura',
);

// ---- Palettes (mirrors sakura-effect.tsx) ----

const PETAL_PALETTES = [
    { base: '#F9A8B8', tip: '#E8718A', highlight: '#FFDDE4' },
    { base: '#F4929E', tip: '#E05A78', highlight: '#FFD1DC' },
    { base: '#FFB0C1', tip: '#F07A94', highlight: '#FFE0E8' },
    { base: '#F7A0B5', tip: '#E66B88', highlight: '#FFDAE3' },
];

// ---- Seeded PRNG (so re-running the script is stable) ----

function mulberry32(seed) {
    return () => {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

let _rand = Math.random;
const random = (min, max) => _rand() * (max - min) + min;
const randomItem = (arr) => arr[Math.floor(_rand() * arr.length)];

// ---- SvgContext: minimal canvas-like API that emits SVG ----

class SvgContext {
    constructor() {
        this.defs = [];
        this.body = [];
        this.idCounter = 0;
        this.stack = [];
        this.current = { transform: '', filter: '' };
        this.fillStyle = '#000';
        this.strokeStyle = '#000';
        this.globalAlpha = 1;
        this.lineWidth = 1;
        this.lineCap = 'butt';
        this.lineJoin = 'miter';
        this.pathD = '';
    }

    set filter(v) {
        const m = String(v).match(/blur\(([\d.]+)px\)/);
        if (m) {
            const stdDev = parseFloat(m[1]);
            const id = `blur-${stdDev.toFixed(1).replace('.', '_')}`;
            if (!this.defs.find((d) => d.includes(`id="${id}"`))) {
                this.defs.push(
                    `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${stdDev}"/></filter>`,
                );
            }
            this.current.filter = id;
        } else {
            this.current.filter = '';
        }
    }

    save() {
        this.stack.push({ ...this.current });
    }

    restore() {
        const popped = this.stack.pop();
        if (popped) this.current = popped;
    }

    translate(x, y) {
        this.current.transform = `${this.current.transform} translate(${fmt(x)} ${fmt(y)})`.trim();
    }

    rotate(angle) {
        const deg = (angle * 180) / Math.PI;
        this.current.transform = `${this.current.transform} rotate(${fmt(deg)})`.trim();
    }

    beginPath() {
        this.pathD = '';
    }

    moveTo(x, y) {
        this.pathD += `M${fmt(x)} ${fmt(y)} `;
    }

    lineTo(x, y) {
        this.pathD += `L${fmt(x)} ${fmt(y)} `;
    }

    bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
        this.pathD += `C${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(x)} ${fmt(y)} `;
    }

    quadraticCurveTo(cx, cy, x, y) {
        this.pathD += `Q${fmt(cx)} ${fmt(cy)} ${fmt(x)} ${fmt(y)} `;
    }

    closePath() {
        this.pathD += 'Z ';
    }

    arc(cx, cy, r, _start, _end) {
        // Only used for full circles in this codebase
        this.pathD = `M${fmt(cx - r)} ${fmt(cy)} A${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(cx + r)} ${fmt(cy)} A${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(cx - r)} ${fmt(cy)} Z`;
    }

    createLinearGradient(x1, y1, x2, y2) {
        const id = `g${this.idCounter++}`;
        const stops = [];
        const ctx = this;
        const obj = {
            __id: id,
            __finalized: false,
            addColorStop(offset, color) {
                stops.push(
                    `<stop offset="${offset}" stop-color="${color}"/>`,
                );
            },
            __finalize() {
                if (this.__finalized) return;
                this.__finalized = true;
                ctx.defs.push(
                    `<linearGradient id="${id}" x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" gradientUnits="userSpaceOnUse">${stops.join('')}</linearGradient>`,
                );
            },
        };
        return obj;
    }

    _wrapAttrs() {
        const t = this.current.transform.trim();
        const f = this.current.filter;
        let s = '';
        if (t) s += ` transform="${t}"`;
        if (f) s += ` filter="url(#${f})"`;
        return s;
    }

    _resolveFill() {
        if (typeof this.fillStyle === 'object' && this.fillStyle.__id) {
            this.fillStyle.__finalize();
            return `url(#${this.fillStyle.__id})`;
        }
        return this.fillStyle;
    }

    fill() {
        const fill = this._resolveFill();
        const alpha =
            this.globalAlpha < 1
                ? ` fill-opacity="${fmt(this.globalAlpha)}"`
                : '';
        this.body.push(
            `<path d="${this.pathD.trim()}" fill="${fill}"${alpha}${this._wrapAttrs()}/>`,
        );
    }

    stroke() {
        const alpha =
            this.globalAlpha < 1
                ? ` stroke-opacity="${fmt(this.globalAlpha)}"`
                : '';
        this.body.push(
            `<path d="${this.pathD.trim()}" fill="none" stroke="${this.strokeStyle}"${alpha} stroke-width="${fmt(this.lineWidth)}" stroke-linecap="${this.lineCap}" stroke-linejoin="${this.lineJoin}"${this._wrapAttrs()}/>`,
        );
    }

    toSVG(viewBox) {
        const defs = this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '';
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${defs}${this.body.join('')}</svg>`;
    }
}

function fmt(n) {
    // Trim noise to keep files small
    if (Number.isInteger(n)) return String(n);
    return Number(n.toFixed(2)).toString();
}

// ---- Geometry (ported verbatim from sakura-effect.tsx) ----

function renderPetal(ctx, size, curl, palette) {
    const s = size;

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

    ctx.beginPath();
    ctx.moveTo(0, -s * 0.35);
    ctx.quadraticCurveTo(s * curl * 0.5, 0, 0, s * 0.4);
    ctx.strokeStyle = palette.tip;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawBlossom(ctx, x, y, size) {
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
    ctx.globalAlpha = 1;
}

function drawBranchSegment(
    ctx,
    startX,
    startY,
    len,
    angle,
    thickness,
    maxDepth,
    depth,
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
    ctx.globalAlpha = 1;

    return { endX, endY };
}

function drawTwig(ctx, startX, startY, len, angle, thickness, depth, isNarrow) {
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
        if (_rand() < 0.8) {
            const size = isNarrow ? random(8, 12) : random(10, 15);
            drawBlossom(ctx, endX, endY, size);
        } else if (_rand() < 0.5) {
            ctx.beginPath();
            ctx.arc(endX, endY, random(2, 4), 0, Math.PI * 2);
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = randomItem(PETAL_PALETTES).base;
            ctx.fill();
            ctx.globalAlpha = 1;
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

function drawMainBranch(ctx, startX, startY, totalLen, baseAngle, thickness, isNarrow) {
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
            curAngle + (i === 0 ? -termSpread : termSpread) + random(-0.08, 0.08);
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

// ---- Generation ----

fs.mkdirSync(OUT, { recursive: true });
// Clean previous output
for (const f of fs.readdirSync(OUT)) {
    if (f.endsWith('.svg')) fs.unlinkSync(path.join(OUT, f));
}

// Petals: 4 palettes × 3 curl variants. Single nominal size of 24, scaled in CSS.
const PETAL_NOMINAL = 24;
const CURLS = [-0.12, 0, 0.12];
let petalManifest = [];
PETAL_PALETTES.forEach((palette, pi) => {
    CURLS.forEach((curl, ci) => {
        const ctx = new SvgContext();
        renderPetal(ctx, PETAL_NOMINAL, curl, palette);
        // Tight bounds: petal extends from -size/2 to +size/2 in both axes.
        // A small safety margin handles bezier control-point overshoot at
        // max curl without inflating the displayed size noticeably.
        const half = PETAL_NOMINAL * 0.52;
        const svg = ctx.toSVG(
            `${fmt(-half)} ${fmt(-half)} ${fmt(half * 2)} ${fmt(half * 2)}`,
        );
        const name = `petal-${pi}-${ci}.svg`;
        fs.writeFileSync(path.join(OUT, name), svg);
        petalManifest.push(name);
    });
});

// Branches: 5 desktop + 5 mobile, seeded for stability.
function generateBranch(isNarrow, seed) {
    _rand = mulberry32(seed);

    // Reference dimensions used by the original at viewport 1440×900 (desktop)
    // and 390×844 (mobile). The SVG viewBox uses these areas; the runtime
    // sizes the <img> in CSS units (vw) so it scales with the viewport.
    const viewW = isNarrow ? 390 : 1440;
    const viewH = isNarrow ? 844 : 900;
    const areaW = isNarrow ? viewW * 0.4 : viewW * 0.35;
    const areaH = isNarrow ? viewH * 0.35 : viewH * 0.32;

    const ctx = new SvgContext();
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

    return ctx.toSVG(`0 0 ${fmt(areaW)} ${fmt(areaH)}`);
}

const VARIANT_COUNT = 5;
let desktopManifest = [];
let mobileManifest = [];
for (let i = 0; i < VARIANT_COUNT; i++) {
    const dName = `branch-desktop-${i}.svg`;
    const mName = `branch-mobile-${i}.svg`;
    fs.writeFileSync(path.join(OUT, dName), generateBranch(false, 100 + i));
    fs.writeFileSync(path.join(OUT, mName), generateBranch(true, 200 + i));
    desktopManifest.push(dName);
    mobileManifest.push(mName);
}

// Manifest for the runtime to consume
fs.writeFileSync(
    path.join(OUT, 'manifest.json'),
    JSON.stringify(
        {
            petals: petalManifest,
            branchesDesktop: desktopManifest,
            branchesMobile: mobileManifest,
        },
        null,
        2,
    ),
);

console.log(
    `Generated ${petalManifest.length} petals + ${desktopManifest.length} desktop branches + ${mobileManifest.length} mobile branches → ${OUT}`,
);
