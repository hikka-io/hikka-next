'use client';

import { CollectionContent, CollectionContentResponse } from '@hikka/client';
import { useCollectionByReference } from '@hikka/react';
import { useParams } from 'next/navigation';

import CollectionGrid from './collection-grid';

const CollectionGroups = () => {
    const params = useParams();

    const { data: collection } = useCollectionByReference({
        reference: String(params.reference),
    });

    if (!collection) {
        return null;
    }

    const groups =
        collection?.labels_order.length !== 0 &&
        collection?.collection.reduce(
            (
                acc: Record<
                    string,
                    CollectionContentResponse<CollectionContent>[]
                >,
                item,
            ) => {
                if (item.label) {
                    acc[item.label] = acc[item.label] || [];
                    acc[item.label].push(item);
                } else {
                    acc.default.push(item);
                }

                return acc;
            },
            {},
        );

    return groups ? (
        Object.keys(groups).map((group, i) => (
            <CollectionGrid
                key={`${group}_${i + 1}`}
                group={group}
                items={groups[group]}
                content_type={collection.content_type}
            />
        ))
    ) : (
        <CollectionGrid
            content_type={collection.content_type}
            items={collection?.collection}
        />
    );
};

export default CollectionGroups;
