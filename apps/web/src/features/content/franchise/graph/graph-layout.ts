import {
    type FranchiseModel,
    type FranchiseNode,
    RelationGroupEnum,
} from '../franchise-model';

export type GraphBudget = { left: number; right: number };

export const DESKTOP_BUDGET: GraphBudget = { left: 2, right: 3 };
export const PHONE_BUDGET: GraphBudget = { left: 1, right: 2 };

export type GraphBand = { label: string; top: number; height: number };

export type GraphLayout = {
    positions: Map<string, [column: number, row: number]>;
    columns: number;
    rows: number;
    bands: GraphBand[];
    sourceColumns: number;
};

const ANNOUNCED_YEAR = Number.MAX_SAFE_INTEGER;

const RIGHT_ORDER: RelationGroupEnum[] = [
    RelationGroupEnum.SIDE,
    RelationGroupEnum.SUMMARY,
    RelationGroupEnum.ALTERNATIVE,
    RelationGroupEnum.SPIN_OFF,
];

const yearOf = (node: FranchiseNode) => node.content.year ?? ANNOUNCED_YEAR;

/**
 * Rows are years; the spine holds the main story, other media sit to its left
 * and every other relation to its right. Each zone has a fixed column budget,
 * so a crowded year wraps into extra rows under the same label instead of
 * widening the graph.
 */
export function layoutGraph(
    model: FranchiseModel,
    budget: GraphBudget,
): GraphLayout {
    const years = [...new Set(model.nodes.map(yearOf))].sort((a, b) => a - b);
    const bands = years.map((year) => {
        const nodes = model.nodes
            .filter((node) => yearOf(node) === year)
            .sort((a, b) => a.when - b.when);

        return {
            year,
            main: nodes
                .filter((node) => node.lane === 'main')
                .sort((a, b) => (a.chainIndex ?? 0) - (b.chainIndex ?? 0)),
            left: nodes.filter((node) => node.lane === 'source'),
            right: nodes
                .filter((node) => node.lane === 'right')
                .sort(
                    (a, b) =>
                        RIGHT_ORDER.indexOf(a.group) -
                        RIGHT_ORDER.indexOf(b.group),
                ),
        };
    });

    const left = Math.min(
        budget.left,
        Math.max(0, ...bands.map((band) => band.left.length)),
    );
    const right = Math.min(
        budget.right,
        Math.max(1, ...bands.map((band) => band.right.length)),
    );

    const positions: GraphLayout['positions'] = new Map();
    const rows: GraphBand[] = [];
    let top = 0;

    for (const band of bands) {
        const height = Math.max(
            1,
            band.main.length,
            left ? Math.ceil(band.left.length / left) : 0,
            Math.ceil(band.right.length / right),
        );

        band.main.forEach((node, index) => {
            positions.set(node.id, [left, top + index]);
        });
        band.left.forEach((node, index) => {
            positions.set(node.id, [
                left - 1 - (index % left),
                top + Math.floor(index / left),
            ]);
        });
        band.right.forEach((node, index) => {
            positions.set(node.id, [
                left + 1 + (index % right),
                top + Math.floor(index / right),
            ]);
        });

        rows.push({
            label: band.year === ANNOUNCED_YEAR ? 'Анонс' : String(band.year),
            top,
            height,
        });
        top += height;
    }

    return {
        positions,
        columns: left + 1 + right,
        rows: top,
        bands: rows,
        sourceColumns: left,
    };
}
