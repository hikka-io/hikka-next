'use client';

import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderDescription,
    HeaderTitle,
} from '@/components/ui/header';

import {
    YearStatistics,
    YearTopContent as YearTopContentType,
} from '@/types/year-statistics';
import { cn } from '@/utils/cn';

interface Props {
    data: YearStatistics;
}

export const YearTopAnime: FC<Props> = ({ data }) => {
    if (data.top.anime.length === 0) return null;

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>Топ аніме року</HeaderTitle>
                    <HeaderDescription>
                        Найкращі аніме року за Вашими оцінками
                    </HeaderDescription>
                </HeaderContainer>
            </Header>
            <TopContentGrid
                items={data.top.anime}
                contentType={ContentTypeEnum.ANIME}
            />
        </Card>
    );
};

export const YearTopManga: FC<Props> = ({ data }) => {
    if (data.top.manga.length === 0) return null;

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>Топ манґи року</HeaderTitle>
                    <HeaderDescription>
                        Найкраща манґа року за Вашими оцінками
                    </HeaderDescription>
                </HeaderContainer>
            </Header>
            <TopContentGrid
                items={data.top.manga}
                contentType={ContentTypeEnum.MANGA}
            />
        </Card>
    );
};

export const YearTopNovel: FC<Props> = ({ data }) => {
    if (data.top.novel.length === 0) return null;

    return (
        <Card>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Топ ранобе року</HeaderTitle>
                </HeaderContainer>
            </Header>
            <TopContentGrid
                items={data.top.novel}
                contentType={ContentTypeEnum.NOVEL}
            />
        </Card>
    );
};

interface TopContentGridProps {
    items: YearTopContentType[];
    contentType:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const TopContentGrid: FC<TopContentGridProps> = ({ items, contentType }) => {
    if (items.length !== 3) return null;

    const podiumClassNames = ['md:w-40 w-20', 'md:w-48 w-24', 'md:w-40 w-20'];
    const podiumBgColors = [
        'text-slate-400',
        'text-amber-400',
        'text-orange-600',
    ];
    const podiumItems = [items[1], items[0], items[2]];
    const podiumRanks = [2, 1, 3];

    return (
        <div className="flex items-end justify-center gap-6">
            {podiumItems.map((item, index) => (
                <ContentCard
                    className={cn(podiumClassNames[index])}
                    containerClassName="border"
                    key={item.slug}
                    title={item.title_ua || item.title_en || item.title_ja}
                    image={item.image}
                    slug={item.slug}
                    content_type={contentType}
                    leftSubtitle={`${item.score}/10`}
                    href={`/${contentType}/${item.slug}`}
                >
                    <div
                        className={cn(
                            'flex items-end justify-end p-4 absolute bottom-0 left-0 z-0 h-48 w-full bg-gradient-to-t from-background to-transparent',
                        )}
                    >
                        <span
                            className={cn(
                                'md:text-6xl text-4xl font-black font-mono',
                                podiumRanks[index] === 1 &&
                                    'md:text-8xl text-6xl',
                                podiumBgColors[index],
                            )}
                        >
                            {podiumRanks[index]}
                        </span>
                    </div>
                </ContentCard>
            ))}
        </div>
    );
};
