import type { FC } from 'react';

import { getMediaTypeLabel, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { contentHref } from '@/utils/content-href';

import type { CatalogItem } from './queries';

type Props = {
    item: CatalogItem;
};

const CatalogGridItem: FC<Props> = ({ item }) => {
    return (
        <PosterCard
            title={getTitle(item)}
            image={item.image ?? undefined}
            href={contentHref(item.data_type, item.slug)}
            leftSubtitle={item.year ? String(item.year) : null}
            rightSubtitle={getMediaTypeLabel(item.media_type)}
        />
    );
};

export default CatalogGridItem;
