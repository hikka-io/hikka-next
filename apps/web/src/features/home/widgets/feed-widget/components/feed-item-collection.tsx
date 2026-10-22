import type { FC } from 'react';

import type { CollectionResponse } from '@hikka/api';

import {
    CollectionBadges,
    CollectionPreviewStrip,
} from '@/features/collections';
import { Link } from '@/utils/navigation';

type Props = {
    data: CollectionResponse;
};

const FeedItemCollection: FC<Props> = ({ data }) => {
    return (
        <div className="flex flex-col gap-4">
            <Link
                to={`/collections/${data.reference}`}
                className="w-fit hover:underline"
            >
                <h3 className="font-semibold text-base">{data.title}</h3>
            </Link>
            <CollectionBadges collection={data} />
            <CollectionPreviewStrip collection={data} />
        </div>
    );
};

export default FeedItemCollection;
