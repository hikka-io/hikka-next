'use client';

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
    ContentType,
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
    contentType: ContentType;
}

const TOP_CONTENT_CONFIGS: Record<ContentType, TopContentConfig> = {
    anime: {
        title: 'Топ аніме року',
        description: 'Найкращі аніме року за Вашими оцінками',
        contentType: 'anime',
    },
    manga: {
        title: 'Топ манґи року',
        description: 'Найкраща манґа року за Вашими оцінками',
        contentType: 'manga',
    },
    novel: {
        title: 'Топ ранобе року',
        description: 'Найкращі ранобе року за Вашими оцінками',
        contentType: 'novel',
    },
};

const PODIUM_CLASS_NAMES = ['md:w-40 w-20', 'md:w-48 w-24', 'md:w-40 w-20'];
const PODIUM_TEXT_COLORS = [
    'text-slate-400', // Silver (2nd place)
    'text-amber-400', // Gold (1st place)
    'text-orange-600', // Bronze (3rd place)
];
const PODIUM_ORDER = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
const PODIUM_RANKS = [2, 1, 3];

interface TopContentGridProps {
    items: YearTopContentType[];
    contentType: ContentType;
}

const TopContentGrid: FC<TopContentGridProps> = ({ items, contentType }) => {
    if (items.length !== 3) return null;

    const podiumItems = PODIUM_ORDER.map((index) => items[index]);

    return (
        <div className="flex items-end justify-center gap-6">
            {podiumItems.map((item, index) => (
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
                    <div className="flex items-end justify-end p-4 absolute bottom-0 left-0 z-0 h-48 w-full bg-gradient-to-t from-background to-transparent">
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
            ))}
        </div>
    );
};

interface YearTopContentProps {
    data: YearStatistics;
    contentType: ContentType;
}

const YearTopContent: FC<YearTopContentProps> = ({ data, contentType }) => {
    const items = data.top[contentType];
    const config = TOP_CONTENT_CONFIGS[contentType];

    if (items.length === 0) return null;

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>{config.title}</HeaderTitle>
                    <HeaderDescription>{config.description}</HeaderDescription>
                </HeaderContainer>
            </Header>
            <TopContentGrid items={items} contentType={contentType} />
        </Card>
    );
};

export const YearTopAnime: FC<Props> = ({ data }) => (
    <YearTopContent data={data} contentType="anime" />
);

export const YearTopManga: FC<Props> = ({ data }) => (
    <YearTopContent data={data} contentType="manga" />
);

export const YearTopNovel: FC<Props> = ({ data }) => (
    <YearTopContent data={data} contentType="novel" />
);
