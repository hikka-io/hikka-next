'use client';

import { FC, useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import Card from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Header,
    HeaderContainer,
    HeaderDescription,
    HeaderTitle,
} from '@/components/ui/header';

import { YearGenre, YearStatistics } from '@/types/year-statistics';

import { CONTENT_CHART_CONFIG, CONTENT_COLORS } from './constants';

interface Props {
    data: YearStatistics;
}

interface MergedGenreData {
    genre: string;
    anime: number;
    manga: number;
    novel: number;
}

const YearGenreRadar: FC<Props> = ({ data }) => {
    const animeGenres = data.genres.anime ?? [];
    const mangaGenres = data.genres.manga ?? [];
    const novelGenres = data.genres.novel ?? [];

    const hasAnime = animeGenres.length > 0;
    const hasManga = mangaGenres.length > 0;
    const hasNovel = novelGenres.length > 0;

    const mergedData = useMemo(() => {
        const genreMap = new Map<string, MergedGenreData>();

        const processGenres = (
            genres: YearGenre[],
            type: 'anime' | 'manga' | 'novel',
        ) => {
            genres.forEach((g) => {
                const existing = genreMap.get(g.name_ua) || {
                    genre: g.name_ua,
                    anime: 0,
                    manga: 0,
                    novel: 0,
                };
                existing[type] = g.count;
                genreMap.set(g.name_ua, existing);
            });
        };

        processGenres(animeGenres, 'anime');
        processGenres(mangaGenres, 'manga');
        processGenres(novelGenres, 'novel');

        return Array.from(genreMap.values()).sort(
            (a, b) =>
                b.anime + b.manga + b.novel - (a.anime + a.manga + a.novel),
        );
    }, [animeGenres, mangaGenres, novelGenres]);

    const hasData = hasAnime || hasManga || hasNovel;

    if (!hasData || mergedData.length === 0) {
        return null;
    }

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>Улюблені жанри</HeaderTitle>
                    <HeaderDescription>
                        Жанри, які користувач найбільше полюбляв у цьому році
                    </HeaderDescription>
                </HeaderContainer>
            </Header>

            <ChartContainer
                config={CONTENT_CHART_CONFIG}
                className="h-80 w-full"
            >
                <RadarChart outerRadius={80} data={mergedData}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent labelKey="genre" />}
                    />
                    <PolarAngleAxis dataKey="genre" />
                    <PolarGrid className="fill-muted/60 opacity-50" />
                    <ChartLegend content={<ChartLegendContent />} />
                    {hasAnime && (
                        <Radar
                            dataKey="anime"
                            fill={CONTENT_COLORS.anime}
                            fillOpacity={0.3}
                            stroke={CONTENT_COLORS.anime}
                            strokeWidth={2}
                        />
                    )}
                    {hasManga && (
                        <Radar
                            dataKey="manga"
                            fill={CONTENT_COLORS.manga}
                            fillOpacity={0.3}
                            stroke={CONTENT_COLORS.manga}
                            strokeWidth={2}
                        />
                    )}
                    {hasNovel && (
                        <Radar
                            dataKey="novel"
                            fill={CONTENT_COLORS.novel}
                            fillOpacity={0.3}
                            stroke={CONTENT_COLORS.novel}
                            strokeWidth={2}
                        />
                    )}
                </RadarChart>
            </ChartContainer>
        </Card>
    );
};

export default YearGenreRadar;
