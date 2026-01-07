'use client';

import { range } from '@antfu/utils';
import { AnimeMediaEnum, SeasonEnum } from '@hikka/client';
import { useSearchAnimes } from '@hikka/react';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import SkeletonCard from '@/components/content-card/content-card-skeleton';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import Stack from '@/components/ui/stack';

import { cn } from '@/utils/cn';
import { getCurrentSeason } from '@/utils/season';

interface Props {
    className?: string;
}

const Ongoings: FC<Props> = ({ className }) => {
    const currentSeason = getCurrentSeason() as SeasonEnum;
    const year = String(new Date().getFullYear());

    const { list, isLoading } = useSearchAnimes({
        args: {
            sort: ['scored_by:desc', 'score:desc', 'native_scored_by:desc', 'native_score:desc'],
            season: [currentSeason!],
            media_type: [AnimeMediaEnum.TV],
            years: [Number(year), Number(year)],
            genres: ["-ecchi", "-hentai"],
            status: ["ongoing"]
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
            {((list && list.length > 0) || isLoading) && (
                <Stack size={8}>
                    {isLoading &&
                        range(0, 8).map((v) => <SkeletonCard key={v} />)}
                    {list &&
                        list.length > 0 &&
                        list?.map((item) => (
                            <AnimeCard anime={item} key={item.slug} />
                        ))}
                </Stack>
            )}
            {list && list.length === 0 && (
                <NotFound
                    title="Не знайдено сезонних онґоінґів"
                    description="Сезон ще не почався або поки немає достатньо оцінених тайтлів"
                />
            )}
        </Block>
    );
};

export default Ongoings;
