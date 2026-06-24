import type {
    CollectionContent,
    CollectionContentResponse,
} from '@hikka/client';
import { useCollectionByReference } from '@hikka/react';

import { useParams } from '@/utils/navigation';

import CollectionDisplayGrid from './components/collection-grid';

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
                    acc.default = acc.default || [];
                    acc.default.push(item);
                }

                return acc;
            },
            {} as Record<
                string,
                CollectionContentResponse<CollectionContent>[]
            >,
        );

    if (!groups) {
        return (
            <CollectionDisplayGrid
                content_type={collection.content_type}
                items={collection?.collection}
            />
        );
    }

    const orderedKeys = [
        ...collection.labels_order.filter((label) => groups[label]),
        ...(groups.default ? ['default'] : []),
    ];

    return orderedKeys.map((group, i) => (
        <CollectionDisplayGrid
            key={`${group}_${i + 1}`}
            group={group === 'default' ? undefined : group}
            items={groups[group]}
            content_type={collection.content_type}
        />
    ));
};

export default CollectionGroups;
