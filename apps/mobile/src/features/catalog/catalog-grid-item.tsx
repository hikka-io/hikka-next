import type { FC } from 'react';

import type { Href } from 'expo-router';

import { contentPath, getMediaTypeLabel, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';

import type { CatalogItem } from './queries';

type Props = {
    item: CatalogItem;
};

const CatalogGridItem: FC<Props> = ({ item }) => {
    return (
        <PosterCard
            title={getTitle(item)}
            image={item.image ?? undefined}
            href={contentPath(item.data_type, item.slug) as Href}
            leftSubtitle={item.year ? String(item.year) : null}
            rightSubtitle={getMediaTypeLabel(item.media_type)}
        />
    );
};

export default CatalogGridItem;
