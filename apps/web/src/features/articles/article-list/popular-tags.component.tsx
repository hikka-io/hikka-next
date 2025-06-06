'use client';

import { useArticleStats } from '@hikka/react';
import { useParams, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import BadgeFilter from '../../filters/badge-filter';
import useChangeParam from '../../filters/use-change-param';

interface Props {}

const PopularTags: FC<Props> = () => {
    const params = useParams();
    const { data: articleTop } = useArticleStats();
    const searchParams = useSearchParams()!;
    const tags = searchParams.getAll('tags');
    const handleChangeParam = useChangeParam();

    return (
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
    );
};

export default PopularTags;
