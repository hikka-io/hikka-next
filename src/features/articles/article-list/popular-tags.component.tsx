'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import BadgeFilter from '@/features/filters/badge-filter';
import useChangeParam from '@/features/filters/use-change-param';

interface Props {}

const PopularTags: FC<Props> = () => {
    const searchParams = useSearchParams()!;
    const tags = searchParams.getAll('tags');
    const handleChangeParam = useChangeParam();

    return (
        <Block>
            <Header title="Популярні теги" />
            <BadgeFilter
                properties={['тег1', 'тег2', 'тег3', 'тег4']}
                selected={tags}
                property="tags"
                onParamChange={handleChangeParam}
            />
        </Block>
    );
};

export default PopularTags;
