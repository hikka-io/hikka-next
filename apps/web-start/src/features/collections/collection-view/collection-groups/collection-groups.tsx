import type { CollectionContentResponse } from '@hikka/api';
import { getCollectionOptions } from '@hikka/api';
import { useQuery } from '@tanstack/react-query';

import { useParams } from '@/utils/navigation';

import CollectionDisplayGrid from './components/collection-grid';

const CollectionGroups = () => {
    const params = useParams();

    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference: String(params.reference) } }),
    );

    if (!collection) {
        return null;
    }

    const groups =
        collection?.labels_order.length !== 0 &&
        collection?.collection.reduce(
            (acc: Record<string, CollectionContentResponse[]>, item) => {
                if (item.label) {
                    acc[item.label] = acc[item.label] || [];
                    acc[item.label].push(item);
                } else {
                    acc.default = acc.default || [];
                    acc.default.push(item);
                }

                return acc;
            },
            {} as Record<string, CollectionContentResponse[]>,
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
