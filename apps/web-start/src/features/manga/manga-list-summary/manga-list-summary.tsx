import type { FC } from 'react';

import { CatalogSummary } from '@/features/content';
import { useMangaSearchQuery } from '../manga-list/use-manga-search-query';

type Props = {
    pageSize?: number;
};

const MangaListSummary: FC<Props> = ({ pageSize }) => {
    const { pagination, isLoading } = useMangaSearchQuery(pageSize);

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default MangaListSummary;
