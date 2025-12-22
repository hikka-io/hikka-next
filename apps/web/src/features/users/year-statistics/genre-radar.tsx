'use client';

import { FC, useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    ChartConfig,
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

interface Props {
    data: YearStatistics;
}

const chartConfig = {
    anime: {
        label: 'Аніме',
        color: 'hsl(217 91% 60%)',
    },
    manga: {
        label: 'Манґа',
        color: 'hsl(321 70% 69%)',
    },
    novel: {
        label: 'Ранобе',
        color: 'hsl(142 71% 45%)',
    },
} satisfies ChartConfig;

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

        // Process anime genres
        animeGenres.forEach((g: YearGenre) => {
            const existing = genreMap.get(g.name_ua) || {
                genre: g.name_ua,
                anime: 0,
                manga: 0,
                novel: 0,
            };
            existing.anime = g.count;
            genreMap.set(g.name_ua, existing);
        });

        // Process manga genres
        mangaGenres.forEach((g: YearGenre) => {
            const existing = genreMap.get(g.name_ua) || {
                genre: g.name_ua,
                anime: 0,
                manga: 0,
                novel: 0,
            };
            existing.manga = g.count;
            genreMap.set(g.name_ua, existing);
        });

        // Process novel genres
        novelGenres.forEach((g: YearGenre) => {
            const existing = genreMap.get(g.name_ua) || {
                genre: g.name_ua,
                anime: 0,
                manga: 0,
                novel: 0,
            };
            existing.novel = g.count;
            genreMap.set(g.name_ua, existing);
        });

        // Sort by total count and take top 8
        return Array.from(genreMap.values())
            .sort(
                (a, b) =>
                    b.anime + b.manga + b.novel - (a.anime + a.manga + a.novel),
            )
            .slice(0, 8);
    }, [animeGenres, mangaGenres, novelGenres]);

    const hasData = hasAnime || hasManga || hasNovel;

    if (!hasData || mergedData.length === 0) {
        return (
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Улюблені жанри</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <div className="flex min-h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">Немає даних</p>
                </div>
            </Block>
        );
    }

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>Улюблені жанри</HeaderTitle>
                    <HeaderDescription>
                        Жанри, які Ви найбільше полюбляли у цьому році
                    </HeaderDescription>
                </HeaderContainer>
            </Header>

            <ChartContainer config={chartConfig} className="h-80 w-full">
                <RadarChart data={mergedData}>
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
                            fill="hsl(217 91% 60%)"
                            fillOpacity={0.3}
                            stroke="hsl(217 91% 60%)"
                            strokeWidth={2}
                        />
                    )}
                    {hasManga && (
                        <Radar
                            dataKey="manga"
                            fill="hsl(321 70% 69%)"
                            fillOpacity={0.3}
                            stroke="hsl(321 70% 69%)"
                            strokeWidth={2}
                        />
                    )}
                    {hasNovel && (
                        <Radar
                            dataKey="novel"
                            fill="hsl(142 71% 45%)"
                            fillOpacity={0.3}
                            stroke="hsl(142 71% 45%)"
                            strokeWidth={2}
                        />
                    )}
                </RadarChart>
            </ChartContainer>
        </Card>
    );
};

export default YearGenreRadar;
