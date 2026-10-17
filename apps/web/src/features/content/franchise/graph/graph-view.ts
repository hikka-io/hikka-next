import type { MainContentTypeEnum } from '@hikka/api';

import type {
    FranchiseContent,
    FranchiseModel,
    FranchiseNode,
    GraphEdge,
    GraphEdgeType,
} from '../franchise-model';
import type { GraphLayout } from './graph-layout';

const DENSE_THRESHOLD = 40;

export type DrawnEdge = GraphEdge & {
    key: string;
    path: string;
    /** Touches the current title or links two main-story titles. */
    anchor: boolean;
    touched: boolean;
};

export type GraphView = {
    edges: DrawnEdge[];
    linked: Set<string>;
    near: Set<string>;
    dense: boolean;
};

export const CELL = 100;
const CORNER = 20;
const TRACK_GAP = 6;
// Vertical runs spread both ways within the gap beside a column or year. A row boundary sits just
// under a media label, so runs along it spread downwards into the strip above the next poster.
// The gap between lanes (horizontal view) is wider: its runs centre on the free strip between
// the upper lane's labels and the lower lane's posters, a little below the boundary.
const TRACK_ROOM = { x: 40, row: 16, lane: 34 };
const LANE_CENTRE = 6;

type Point = [number, number];

/** A polyline with its corners rounded off. */
function roundedPath(points: Point[]): string {
    let path = `M${points[0][0]} ${points[0][1]}`;

    for (let index = 1; index < points.length - 1; index++) {
        const [px, py] = points[index - 1];
        const [x, y] = points[index];
        const [nx, ny] = points[index + 1];
        const into = Math.hypot(x - px, y - py);
        const out = Math.hypot(nx - x, ny - y);
        const radius = Math.min(CORNER, into / 2, out / 2);
        const ax = x - ((x - px) / into) * radius;
        const ay = y - ((y - py) / into) * radius;
        const bx = x + ((nx - x) / out) * radius;
        const by = y + ((ny - y) / out) * radius;
        path += ` L${ax} ${ay} Q${x} ${y} ${bx} ${by}`;
    }

    const [lx, ly] = points[points.length - 1];
    return `${path} L${lx} ${ly}`;
}

type TrackedLine = { points: Point[]; anchor: boolean };

type Run = {
    line: TrackedLine;
    index: number;
    vertical: boolean;
    lo: number;
    hi: number;
};

const trackShift = (track: number, gap: number, symmetric: boolean) =>
    !symmetric || track === 0
        ? track * gap
        : (track % 2 ? 1 : -1) * Math.ceil(track / 2) * gap;

/**
 * Straight runs that share a channel (the same x, or the same y) and overlap get their own track,
 * so the lines sit side by side instead of on top of each other. Runs that only touch end to end
 * stay put, anchor lines (the current title, the main story) keep the centre, and a line's first
 * and last segments never move, so it still starts and ends under its posters.
 */
function spreadTracks(lines: TrackedLine[], horizontal: boolean): Point[][] {
    const channels = new Map<string, Run[]>();

    for (const line of lines) {
        for (let index = 2; index < line.points.length - 1; index++) {
            const [ax, ay] = line.points[index - 1];
            const [bx, by] = line.points[index];
            const vertical = ax === bx;
            if (!vertical && ay !== by) continue;

            const [lo, hi] = vertical
                ? [Math.min(ay, by), Math.max(ay, by)]
                : [Math.min(ax, bx), Math.max(ax, bx)];
            const key = vertical ? `x${ax}` : `y${ay}`;
            channels.set(key, [
                ...(channels.get(key) ?? []),
                { line, index, vertical, lo, hi },
            ]);
        }
    }

    const spread = new Map(
        lines.map((line) => [line, line.points.map(([x, y]): Point => [x, y])]),
    );

    for (const runs of channels.values()) {
        const clusters: Run[][] = [];
        let reach = Number.NEGATIVE_INFINITY;
        for (const run of [...runs].sort((a, b) => a.lo - b.lo)) {
            if (run.lo < reach) clusters[clusters.length - 1].push(run);
            else clusters.push([run]);
            reach = Math.max(reach, run.hi);
        }

        for (const cluster of clusters) {
            if (cluster.length < 2) continue;

            const ends: number[] = [];
            const placed = [...cluster]
                .sort(
                    (a, b) =>
                        Number(b.line.anchor) - Number(a.line.anchor) ||
                        a.lo - b.lo,
                )
                .map((run) => {
                    let track = ends.findIndex((end) => end <= run.lo);
                    if (track < 0) track = ends.length;
                    ends[track] = run.hi;
                    return { run, track };
                });
            if (ends.length < 2) continue;

            for (const { run, track } of placed) {
                const room = run.vertical
                    ? TRACK_ROOM.x
                    : horizontal
                      ? TRACK_ROOM.lane
                      : TRACK_ROOM.row;
                const lane = horizontal && !run.vertical;
                const gap = Math.min(TRACK_GAP, room / ends.length);
                const shift =
                    (lane ? LANE_CENTRE : 0) +
                    trackShift(track, gap, run.vertical || lane);
                const points = spread.get(run.line) as Point[];
                const axis = run.vertical ? 0 : 1;
                points[run.index - 1][axis] += shift;
                points[run.index][axis] += shift;
            }
        }
    }

    return lines.map((line) => spread.get(line) as Point[]);
}

/** A straight line between two titles; a long one gets stubs so only its middle may spread. */
function straightLine(from: Point, to: Point, horizontal: boolean): Point[] {
    const axis = horizontal ? 0 : 1;
    const length = to[axis] - from[axis];
    if (Math.abs(length) <= CELL) return [from, to];

    const stub = (Math.sign(length) * CELL) / 2;
    const first: Point = [...from];
    const last: Point = [...to];
    first[axis] += stub;
    last[axis] -= stub;

    return [from, first, last, to];
}

/**
 * Lane and step are layout units (column and year row in the vertical view). An edge whose curve
 * would pass behind another title leaves its source through the gap between rows, runs down the
 * gap between columns beside the target, and turns into the target only at the end.
 */
function routeAround(
    [laneA, stepA]: Point,
    [laneB, stepB]: Point,
    occupied: Set<string>,
    lanes: number,
): Point[] | null {
    const isTaken = (lane: number, step: number) =>
        occupied.has(`${lane},${step}`);
    const [from, to] = stepA <= stepB ? [stepA, stepB] : [stepB, stepA];

    if (from === to) {
        const [low, high] = laneA < laneB ? [laneA, laneB] : [laneB, laneA];
        let blocked = false;
        for (let lane = low + 1; lane < high; lane++) {
            if (isTaken(lane, from)) blocked = true;
        }
        if (!blocked) return null;

        const gap = (from + 1) * CELL;
        return [
            [(laneA + 0.5) * CELL, (from + 0.5) * CELL],
            [(laneA + 0.5) * CELL, gap],
            [(laneB + 0.5) * CELL, gap],
            [(laneB + 0.5) * CELL, (to + 0.5) * CELL],
        ];
    }

    let blocked = false;
    for (let step = from + 1; step < to; step++) {
        if (isTaken(laneA, step) || isTaken(laneB, step)) blocked = true;
    }
    if (!blocked) return null;

    const [start, end] = stepA <= stepB ? [laneA, laneB] : [laneB, laneA];
    const gutter =
        end > start ? end : end < start || end + 1 < lanes ? end + 1 : end;

    return [
        [(start + 0.5) * CELL, (from + 0.5) * CELL],
        [(start + 0.5) * CELL, (from + 1) * CELL],
        [gutter * CELL, (from + 1) * CELL],
        [gutter * CELL, to * CELL],
        [(end + 0.5) * CELL, to * CELL],
        [(end + 0.5) * CELL, (to + 0.5) * CELL],
    ];
}

/** Adaptations start hidden unless they are the only relations there are. */
export function defaultHiddenTypes(model: FranchiseModel): Set<GraphEdgeType> {
    const onlyAdaptations = model.edges.every(
        (edge) => edge.type === 'adaptation',
    );

    return new Set(onlyAdaptations ? [] : ['adaptation']);
}

/** The franchise's default hidden types with the viewer's saved switches applied. */
export function resolveHiddenTypes(
    model: FranchiseModel,
    relations: Partial<Record<GraphEdgeType, boolean>>,
): Set<GraphEdgeType> {
    const hidden = defaultHiddenTypes(model);
    for (const [type, shown] of Object.entries(relations) as [
        GraphEdgeType,
        boolean,
    ][]) {
        if (shown) hidden.delete(type);
        else hidden.add(type);
    }

    return hidden;
}

/**
 * Hidden relation types drop their edges, except the selected title's own:
 * it keeps every edge so filtering never strands the title being inspected.
 */
export function computeGraphView(
    model: FranchiseModel,
    layout: GraphLayout,
    hidden: ReadonlySet<GraphEdgeType>,
    focus: string | null,
    horizontal = false,
): GraphView {
    const { positions } = layout;
    const placed = model.edges.filter(
        (edge) => positions.has(edge.a) && positions.has(edge.b),
    );

    // Layout units: lane across the years, step along them.
    const logical = ([column, row]: Point): Point =>
        horizontal ? [row, column] : [column, row];
    const screen = ([lane, step]: Point): Point =>
        horizontal ? [step, lane] : [lane, step];
    const occupied = new Set(
        [...positions.values()].map((position) => logical(position).join(',')),
    );
    const lanes = horizontal ? layout.rows : layout.columns;

    const seen = new Set<string>();
    const edges: (DrawnEdge & { line?: TrackedLine })[] = [];
    const lines: TrackedLine[] = [];

    for (const edge of placed) {
        const touched =
            focus !== null && (edge.a === focus || edge.b === focus);
        if (hidden.has(edge.type) && !touched) continue;

        const [c1, r1] = positions.get(edge.a) as [number, number];
        const [c2, r2] = positions.get(edge.b) as [number, number];
        const key = `${c1},${r1}|${c2},${r2}|${edge.type}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const x1 = (c1 + 0.5) * CELL;
        const y1 = (r1 + 0.5) * CELL;
        const x2 = (c2 + 0.5) * CELL;
        const y2 = (r2 + 0.5) * CELL;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const a = model.byId.get(edge.a);
        const b = model.byId.get(edge.b);
        const route = routeAround(
            logical([c1, r1]),
            logical([c2, r2]),
            occupied,
            lanes,
        );
        const anchor =
            edge.a === model.current.id ||
            edge.b === model.current.id ||
            (a?.chainIndex != null && b?.chainIndex != null);
        const straight = horizontal ? y1 === y2 : x1 === x2;
        const points: Point[] | null = route
            ? route.map(screen)
            : straight
              ? straightLine([x1, y1], [x2, y2], horizontal)
              : null;
        const line = points ? { points, anchor } : null;
        if (line) lines.push(line);

        edges.push({
            ...edge,
            key,
            path: line
                ? ''
                : horizontal
                  ? `M${x1} ${y1} C${midX} ${y1} ${midX} ${y2} ${x2} ${y2}`
                  : `M${x1} ${y1} C${x1} ${midY} ${x2} ${midY} ${x2} ${y2}`,
            line: line ?? undefined,
            anchor,
            touched,
        });
    }

    const spread = spreadTracks(lines, horizontal);
    for (const edge of edges) {
        if (!edge.line) continue;
        edge.path = roundedPath(spread[lines.indexOf(edge.line)]);
        delete edge.line;
    }

    const linked = new Set<string>();
    for (const edge of edges) {
        linked.add(edge.a);
        linked.add(edge.b);
    }

    const near = new Set<string>(focus ? [focus] : []);
    if (focus) {
        for (const edge of edges) {
            if (edge.a === focus) near.add(edge.b);
            if (edge.b === focus) near.add(edge.a);
        }
    }

    return {
        edges,
        linked,
        near,
        dense: model.nodes.length > DENSE_THRESHOLD,
    };
}

export type EdgeStyle = { opacity: number; width: number; dashed: boolean };

/** Dense graphs quiet every edge but the current title's and the main story's. */
export function edgeStyle(
    edge: DrawnEdge,
    dense: boolean,
    hasFocus: boolean,
): EdgeStyle {
    const sequel = edge.type === 'sequel';
    const dashed = edge.type === 'adaptation';
    const width = sequel ? (dense && !edge.anchor ? 2 : 2.5) : 1.5;

    if (hasFocus) {
        return {
            opacity: edge.touched ? 1 : dense ? 0.05 : 0.07,
            width,
            dashed,
        };
    }

    if (dense) {
        return {
            opacity: edge.anchor ? 1 : sequel ? 0.32 : 0.16,
            width,
            dashed,
        };
    }

    return { opacity: sequel ? 1 : dashed ? 0.5 : 0.75, width, dashed };
}

function keepNodes(
    model: FranchiseModel,
    keep: (node: FranchiseModel['nodes'][number]) => boolean,
): FranchiseModel {
    const nodes = model.nodes.filter(keep);
    if (nodes.length === model.nodes.length) return model;

    const kept = new Set(nodes.map((node) => node.id));

    return {
        ...model,
        nodes,
        edges: model.edges.filter(
            (edge) => kept.has(edge.a) && kept.has(edge.b),
        ),
        relations: new Map(
            [...model.relations]
                .filter(([id]) => kept.has(id))
                .map(([id, list]) => [
                    id,
                    list.filter((relation) => kept.has(relation.node.id)),
                ]),
        ),
    };
}

/** Drops the titles of hidden media, with every edge that touches them. */
export function withoutMedia(
    model: FranchiseModel,
    hidden: ReadonlySet<MainContentTypeEnum>,
): FranchiseModel {
    if (!hidden.size) return model;

    return keepNodes(model, (node) => !hidden.has(node.contentType));
}

/**
 * Drops the titles no shown relation reaches, the ones the graph greys out. It ignores the
 * selection, whose hidden edges would otherwise bring titles back and reflow the layout.
 */
export function withoutUnlinked(
    model: FranchiseModel,
    hidden: ReadonlySet<GraphEdgeType>,
): FranchiseModel {
    if (!model.edges.length) return model;

    const linked = new Set([model.current.id]);
    for (const edge of model.edges) {
        if (hidden.has(edge.type)) continue;
        linked.add(edge.a);
        linked.add(edge.b);
    }

    return keepNodes(model, (node) => linked.has(node.id));
}

const titlesOf = (content: FranchiseContent) => [
    content.title_ua,
    content.title_en,
    content.title_native,
    'title_ja' in content ? content.title_ja : content.title_original,
];

/** Titles whose name in any language contains the query, in the graph's year order. */
export function searchNodes(
    model: FranchiseModel,
    query: string,
): FranchiseNode[] {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];

    return model.nodes.filter((node) =>
        titlesOf(node.content).some((title) =>
            title?.toLocaleLowerCase().includes(needle),
        ),
    );
}
