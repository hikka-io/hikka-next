'use client';

import { range } from '@antfu/utils';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import SkeletonCard from '@/components/skeletons/content-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useAnimeCatalog from '@/services/hooks/anime/useAnimeCatalog';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Ongoings: FC<Props> = ({ className }) => {
    const { list, isLoading } = useAnimeCatalog({
        status: ['ongoing'],
        page: 1,
        iPage: 1,
    });

    const filteredList = list?.slice(0, 8);

    return (
        <Block className={cn(className)}>
            <Header title="Онґоінґи" href="/anime?statuses=ongoing" />
            <Stack className="grid-min-7">
                {isLoading && range(0, 8).map((v) => <SkeletonCard key={v} />)}
                {filteredList?.map((item) => (
                    <AnimeCard anime={item} key={item.slug} />
                ))}
            </Stack>
        </Block>
    );
};

export default Ongoings;
