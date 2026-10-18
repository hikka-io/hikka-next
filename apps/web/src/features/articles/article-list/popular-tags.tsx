import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { API_LIMITS, getArticleTopOptions } from '@hikka/api';

import { BadgeFilter } from '@/components/ui/badge-filter';
import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';
import { useChangeParam } from '@/features/filters';
import { useRouteSearch } from '@/utils/navigation';
import type { ArticlesSearch } from '@/utils/search-schemas';

type Props = {};

const ArticleListPopularTags: FC<Props> = () => {
    const { data: articleTop } = useQuery(getArticleTopOptions());
    const search = useRouteSearch<Pick<ArticlesSearch, 'tags'>>();
    const tags = search.tags
        ? Array.isArray(search.tags)
            ? search.tags
            : [search.tags]
        : [];
    const handleChangeParam = useChangeParam();

    return (
        <Block variant="card">
            <Header>
                <HeaderTitle>Популярні теги</HeaderTitle>
            </Header>
            <BadgeFilter
                disabled={tags.length >= API_LIMITS.tags.max}
                properties={articleTop?.tags?.map((tag) => tag.name) || []}
                selected={tags}
                property="tags"
                onParamChange={handleChangeParam}
            />
        </Block>
    );
};

export default ArticleListPopularTags;
