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
    YearContentType,
    YearStatistics,
    YearTopContent as YearTopContentType,
} from '@/types/year-statistics';
import { cn } from '@/utils/cn';

interface Props {
    data: YearStatistics;
}

interface TopContentConfig {
    title: string;
    description: string;
    contentType: YearContentType;
}

const TOP_CONTENT_CONFIGS: Record<YearContentType, TopContentConfig> = {
    [ContentTypeEnum.ANIME]: {
        title: 'Топ аніме року',
        description: 'Найкращі аніме року за оцінками користувача',
        contentType: ContentTypeEnum.ANIME,
    },
    [ContentTypeEnum.MANGA]: {
        title: 'Топ манґи року',
        description: 'Найкраща манґа року за оцінками користувача',
        contentType: ContentTypeEnum.MANGA,
    },
    [ContentTypeEnum.NOVEL]: {
        title: 'Топ ранобе року',
        description: 'Найкращі ранобе року за оцінками користувача',
        contentType: ContentTypeEnum.NOVEL,
    },
};

const PODIUM_CLASS_NAMES = ['md:w-40 w-20', 'md:w-48 w-24', 'md:w-40 w-20'];
const PODIUM_TEXT_COLORS = [
    'text-slate-400',
    'text-amber-400',
    'text-orange-600',
];
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_RANKS = [2, 1, 3];

interface TopContentGridProps {
    items: (YearTopContentType | null)[];
    contentType: YearContentType;
}

const TopContentGrid: FC<TopContentGridProps> = ({ items, contentType }) => {
    const podiumItems = PODIUM_ORDER.map((index) => items[index]);

    return (
        <div className="flex items-end justify-center gap-6">
            {podiumItems.map((item, index) =>
                item ? (
                    <ContentCard
                        className={cn(PODIUM_CLASS_NAMES[index])}
                        containerClassName="border"
                        key={item.slug}
                        title={item.title_ua || item.title_en || item.title_ja}
                        image={item.image}
                        slug={item.slug}
                        content_type={contentType}
                        leftSubtitle={`${item.score}/10`}
                        href={`/${contentType}/${item.slug}`}
                    >
                        <div className="flex items-end justify-end p-4 absolute bottom-0 left-0 z-0 h-48 w-full bg-gradient-to-t from-black/60 to-transparent">
                            <span
                                className={cn(
                                    'md:text-6xl text-4xl font-black font-mono',
                                    PODIUM_RANKS[index] === 1 &&
                                        'md:text-8xl text-6xl',
                                    PODIUM_TEXT_COLORS[index],
                                )}
                            >
                                {PODIUM_RANKS[index]}
                            </span>
                        </div>
                    </ContentCard>
                ) : (
                    <ContentCard
                        className={cn(PODIUM_CLASS_NAMES[index], 'mb-14')}
                        image={
                            <div className="w-full h-full bg-secondary/20 rounded-lg" />
                        }
                        key={index}
                    />
                ),
            )}
        </div>
    );
};

interface YearTopContentProps {
    data: YearStatistics;
    contentType: YearContentType;
}

const YearTopContent: FC<YearTopContentProps> = ({ data, contentType }) => {
    const items = data.top[contentType];
    const config = TOP_CONTENT_CONFIGS[contentType];

    if (items.length === 0) return null;

    const podiumItems =
        items.length < 3
            ? items.concat(Array(3 - items.length).fill(null))
            : items.slice(0, 3);

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>{config.title}</HeaderTitle>
                    <HeaderDescription>{config.description}</HeaderDescription>
                </HeaderContainer>
            </Header>
            <TopContentGrid items={podiumItems} contentType={contentType} />
        </Card>
    );
};

export const YearTopAnime: FC<Props> = ({ data }) => (
    <YearTopContent data={data} contentType={ContentTypeEnum.ANIME} />
);

export const YearTopManga: FC<Props> = ({ data }) => (
    <YearTopContent data={data} contentType={ContentTypeEnum.MANGA} />
);

export const YearTopNovel: FC<Props> = ({ data }) => (
    <YearTopContent data={data} contentType={ContentTypeEnum.NOVEL} />
);
