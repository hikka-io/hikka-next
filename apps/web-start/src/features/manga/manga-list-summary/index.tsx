'use client';

import type { FC } from 'react';

import { CatalogSummary } from '@/features/content';
import { useMangaSearchQuery } from '@/features/manga/manga-list/use-manga-search-query';

type Props = {
    pageSize?: number;
};

const MangaListSummary: FC<Props> = ({ pageSize }) => {
    const { pagination, isLoading } = useMangaSearchQuery(pageSize);

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default MangaListSummary;
