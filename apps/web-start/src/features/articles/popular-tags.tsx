'use client';

import { useArticleStats } from '@hikka/react';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { FC } from 'react';

import { BadgeFilter } from '@/components/ui/badge-filter';
import useChangeParam from '@/features/filters/hooks/use-change-param';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

interface Props { }

const PopularTags: FC<Props> = () => {
    const { data: articleTop } = useArticleStats();
    const search = useFilterSearch<{ tags?: string | string[] }>();
    const tags = search.tags
        ? Array.isArray(search.tags)
            ? search.tags
            : [search.tags]
        : [];
    const handleChangeParam = useChangeParam();

    return (
        <Card className="bg-secondary/20 backdrop-blur-xl">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant='h4'>Популярні теги</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <BadgeFilter
                    disabled={tags.length >= 3}
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
