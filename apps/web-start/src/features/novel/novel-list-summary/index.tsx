'use client';

import { FC } from 'react';

import { CatalogSummary } from '@/features/content';

import { useNovelSearchQuery } from '@/features/novel/novel-list/use-novel-search-query';

interface Props {
    pageSize?: number;
}

const NovelListSummary: FC<Props> = ({ pageSize }) => {
    const { pagination, isLoading } = useNovelSearchQuery(pageSize);

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default NovelListSummary;
