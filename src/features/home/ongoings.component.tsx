'use client';

import { range } from '@antfu/utils';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import SkeletonCard from '@/components/skeletons/content-card-skeleton';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import useAnimeCatalog from '@/services/hooks/anime/use-anime-catalog';
import getCurrentSeason from '@/utils/get-current-season';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const Ongoings: FC<Props> = ({ className }) => {
    const currentSeason = getCurrentSeason();
    const year = String(new Date().getFullYear());

    const { list, isLoading } = useAnimeCatalog({
        season: [currentSeason!],
        years: [year, year],
        score: [7, 8, 9, 10],
        page: 1,
        iPage: 1,
    });

    const filteredList = list?.slice(0, 8);

    return (
        <Block className={cn(className)}>
            <Header href="/anime?statuses=ongoing">
                <HeaderContainer>
                    <HeaderTitle>Онґоінґи</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={8}>
                {isLoading && range(0, 8).map((v) => <SkeletonCard key={v} />)}
                {filteredList?.map((item) => (
                    <AnimeCard anime={item} key={item.slug} />
                ))}
            </Stack>
        </Block>
    );
};

export default Ongoings;
