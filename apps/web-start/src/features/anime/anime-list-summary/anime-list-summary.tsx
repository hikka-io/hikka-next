import type { FC } from 'react';

import { useAnimeSearchQuery } from '../anime-list/use-anime-search-query';
import { CatalogSummary } from '@/features/catalog';

type Props = {
    pageSize?: number;
};

const AnimeListSummary: FC<Props> = ({ pageSize }) => {
    const { pagination, isLoading } = useAnimeSearchQuery(pageSize);

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default AnimeListSummary;
