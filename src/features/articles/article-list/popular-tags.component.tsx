'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import BadgeFilter from '@/features/filters/badge-filter';
import useChangeParam from '@/features/filters/use-change-param';

interface Props {}

const PopularTags: FC<Props> = () => {
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
                properties={['тег1', 'тег2', 'тег3', 'тег4']}
                selected={tags}
                property="tags"
                onParamChange={handleChangeParam}
            />
        </Block>
    );
};

export default PopularTags;
