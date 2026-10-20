import type { CollectionContentResponse, CollectionResponse } from '@hikka/api';

export const COLLECTION_COLUMNS = 3;

export type CollectionGroup = {
    label?: string;
    items: CollectionContentResponse[];
};

export type CollectionRow =
    | { kind: 'label'; label: string; key: string }
    | { kind: 'entries'; items: CollectionContentResponse[]; key: string };

/** The web's grouping: labelled groups in `labels_order`, then the unlabelled entries; no labels means one group. */
export function groupCollection(
    collection: Pick<CollectionResponse, 'labels_order' | 'collection'>,
): CollectionGroup[] {
    if (collection.labels_order.length === 0) {
        return [{ items: collection.collection }];
    }

    const byLabel = new Map<string, CollectionContentResponse[]>();
    const unlabelled: CollectionContentResponse[] = [];

    for (const item of collection.collection) {
        if (!item.label) {
            unlabelled.push(item);
            continue;
        }
        const group = byLabel.get(item.label) ?? [];
        group.push(item);
        byLabel.set(item.label, group);
    }

    // A label missing from `labels_order` still shows, after the ordered ones.
    const labels = [
        ...collection.labels_order.filter((label) => byLabel.has(label)),
        ...[...byLabel.keys()].filter(
            (label) => !collection.labels_order.includes(label),
        ),
    ];

    return [
        ...labels.map((label) => ({ label, items: byLabel.get(label) ?? [] })),
        ...(unlabelled.length > 0 ? [{ items: unlabelled }] : []),
    ];
}

/** Grid rows for a virtualized list: a label row per labelled group, then its entries `columns` at a time. */
export function collectionRows(
    groups: CollectionGroup[],
    columns = COLLECTION_COLUMNS,
): CollectionRow[] {
    return groups.flatMap((group, groupIndex) => {
        const rows: CollectionRow[] = group.label
            ? [
                  {
                      kind: 'label',
                      label: group.label,
                      key: `label-${groupIndex}`,
                  },
              ]
            : [];

        for (let start = 0; start < group.items.length; start += columns) {
            rows.push({
                kind: 'entries',
                items: group.items.slice(start, start + columns),
                key: `entries-${groupIndex}-${start}`,
            });
        }

        return rows;
    });
}
