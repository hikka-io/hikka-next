import type { FC } from 'react';

import { CatalogSummary } from '@/features/content';
import { useNovelSearchQuery } from '../novel-list/use-novel-search-query';

type Props = {
    pageSize?: number;
};

const NovelListSummary: FC<Props> = ({ pageSize }) => {
    const { pagination, isLoading } = useNovelSearchQuery(pageSize);

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default NovelListSummary;
