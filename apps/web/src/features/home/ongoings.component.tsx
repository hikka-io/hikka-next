'use client';

import { range } from '@antfu/utils';
import { SeasonEnum } from '@hikka/client';
import { useSearchAnimes } from '@hikka/react';
import { FC } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import getCurrentSeason from '@/utils/get-current-season';
import { cn } from '@/utils/utils';

import AnimeCard from '../../components/anime-card';
import SkeletonCard from '../../components/skeletons/content-card-skeleton';

interface Props {
    className?: string;
}

const Ongoings: FC<Props> = ({ className }) => {
    const currentSeason = getCurrentSeason() as SeasonEnum;
    const year = String(new Date().getFullYear());

    const { list, isLoading } = useSearchAnimes({
        args: {
            season: [currentSeason!],
            score: [7, 10],
            years: [Number(year), Number(year)],
        },
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
