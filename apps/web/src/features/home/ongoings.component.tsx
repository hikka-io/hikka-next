'use client';

import { range } from '@antfu/utils';
import { AnimeMediaEnum, SeasonEnum } from '@hikka/client';
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

import getCurrentSeason from '@/utils/season-utils';
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
            sort: ['scored_by:desc', 'score:desc'],
            season: [currentSeason!],
            media_type: [AnimeMediaEnum.TV],
            score: [7, 10],
            years: [Number(year), Number(year)],
        },
        paginationArgs: {
            size: 8,
        },
    });

    return (
        <Block className={cn(className)}>
            <Header href="/anime?statuses=ongoing">
                <HeaderContainer>
                    <HeaderTitle variant="h2">Онґоінґи</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={8}>
                {isLoading && range(0, 8).map((v) => <SkeletonCard key={v} />)}
                {list?.map((item) => (
                    <AnimeCard anime={item} key={item.slug} />
                ))}
            </Stack>
        </Block>
    );
};

export default Ongoings;
