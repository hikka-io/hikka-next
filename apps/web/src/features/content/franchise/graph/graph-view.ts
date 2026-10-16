import type {
    FranchiseModel,
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

/**
 * Hidden relation types drop their edges, except the selected title's own:
 * it keeps every edge so filtering never strands the title being inspected.
 */
export function computeGraphView(
    model: FranchiseModel,
    layout: GraphLayout,
    hidden: ReadonlySet<GraphEdgeType>,
    focus: string | null,
): GraphView {
    const { positions } = layout;
    const placed = model.edges.filter(
        (edge) => positions.has(edge.a) && positions.has(edge.b),
    );

    const linked = new Set<string>();
    for (const edge of placed) {
        if (hidden.has(edge.type)) continue;
        linked.add(edge.a);
        linked.add(edge.b);
    }

    const seen = new Set<string>();
    const edges: DrawnEdge[] = [];

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
        const mid = (y1 + y2) / 2;
        const a = model.byId.get(edge.a);
        const b = model.byId.get(edge.b);

        edges.push({
            ...edge,
            key,
            path: `M${x1} ${y1} C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`,
            anchor:
                edge.a === model.current.id ||
                edge.b === model.current.id ||
                (a?.chainIndex != null && b?.chainIndex != null),
            touched,
        });
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
