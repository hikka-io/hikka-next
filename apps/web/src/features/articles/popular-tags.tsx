import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { API_LIMITS, getArticleTopOptions } from '@hikka/api';

import { BadgeFilter } from '@/components/ui/badge-filter';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { useChangeParam } from '@/features/filters';
import { useRouteSearch } from '@/utils/navigation';

type Props = {};

const PopularTags: FC<Props> = () => {
    const { data: articleTop } = useQuery(getArticleTopOptions());
    const search = useRouteSearch<{ tags?: string | string[] }>();
    const tags = search.tags
        ? Array.isArray(search.tags)
            ? search.tags
            : [search.tags]
        : [];
    const handleChangeParam = useChangeParam();

    return (
        <Card>
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Популярні теги</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <BadgeFilter
                    disabled={tags.length >= API_LIMITS.tags.max}
                    properties={articleTop?.tags?.map((tag) => tag.name) || []}
                    selected={tags}
                    property="tags"
                    onParamChange={handleChangeParam}
                />
            </Block>
        </Card>
    );
};

export default PopularTags;
