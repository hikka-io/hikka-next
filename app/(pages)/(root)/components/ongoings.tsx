'use client';

import { FC } from 'react';

import AnimeCard from '@/app/(pages)/(content)/components/anime-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import useAnimeCatalog from '@/services/hooks/anime/useAnimeCatalog';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Ongoings: FC<Props> = ({ className }) => {
    const { list } = useAnimeCatalog({
        status: ['ongoing'],
        page: 1,
        iPage: 1,
    });

    const filteredList = list?.slice(0, 8);

    return (
        <Block className={cn(className)}>
            <Header title="Онґоінґи" href="/anime?statuses=ongoing" />
            <Stack>
                {filteredList?.map((item) => (
                    <AnimeCard anime={item} key={item.slug} />
                ))}
            </Stack>
        </Block>
    );
};

export default Ongoings;
