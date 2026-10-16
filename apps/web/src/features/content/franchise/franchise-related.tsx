import type { FC } from 'react';

import { range } from '@antfu/utils';

import AnimeCard from '@/components/content-card/anime-card';
import MangaCard from '@/components/content-card/manga-card';
import NovelCard from '@/components/content-card/novel-card';
import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Stack from '@/components/ui/stack';

import type { DirectRelation, FranchiseModel } from './franchise-model';

type Props = {
    model?: FranchiseModel;
};

const SKELETON_CARDS = 5;

const RelatedCard: FC<{ relation: DirectRelation }> = ({
    relation: { node, label },
}) => {
    const { content } = node;

    switch (content.data_type) {
        case 'anime':
            return <AnimeCard item={content} description={label} />;
        case 'manga':
            return <MangaCard item={content} description={label} />;
        default:
            return <NovelCard item={content} description={label} />;
    }
};

const FranchiseRelated: FC<Props> = ({ model }) => (
    <Stack
        extended
        extendedSize={5}
        className="grid-cols-3 lg:grid-cols-5"
        imagePreset="card"
    >
        {model
            ? model.direct.map((relation) => (
                  <RelatedCard key={relation.node.id} relation={relation} />
              ))
            : range(0, SKELETON_CARDS).map((index) => (
                  <PosterCardSkeleton key={index} description />
              ))}
    </Stack>
);

export default FranchiseRelated;
