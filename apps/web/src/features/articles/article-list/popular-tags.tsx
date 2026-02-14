'use client';

import { useArticleStats } from '@hikka/react';
import { useParams, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { BadgeFilter } from '@/components/badge-filter';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { useChangeParam } from '@/features/filters';

interface Props {}

const PopularTags: FC<Props> = () => {
    const params = useParams();
    const { data: articleTop } = useArticleStats();
    const searchParams = useSearchParams()!;
    const tags = searchParams.getAll('tags');
    const handleChangeParam = useChangeParam();

    return (
        <Card className="bg-secondary/20 backdrop-blur-xl">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Популярні теги</HeaderTitle>
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
