'use client';

import { ContentTypeEnum } from '@hikka/client';
import { format } from 'date-fns';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderDescription,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import {
    YearCompletedContent,
    YearContentType,
    YearStatistics,
} from '@/types/year-statistics';
import { getDeclensionWord } from '@/utils/i18n';

import {
    CONTENT_TYPE_LABELS,
    MONTHS,
    MONTH_LABELS_FULL,
    Month,
} from './constants';

interface Props {
    data: YearStatistics;
}

const YearCompletedTimeline: FC<Props> = ({ data }) => {
    const monthsWithContent = MONTHS.filter((month: Month) => {
        return (
            data.completed.anime[month].length > 0 ||
            data.completed.manga[month].length > 0 ||
            data.completed.novel[month].length > 0
        );
    });

    if (monthsWithContent.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle variant="h2">Хронологія</HeaderTitle>
                    <HeaderDescription>
                        Перегляньте історію переглянутого та прочитаного
                        контенту
                    </HeaderDescription>
                </HeaderContainer>
            </Header>

            <div className="flex flex-col">
                {monthsWithContent.map((month: Month) => (
                    <MonthSection
                        key={month}
                        month={month}
                        anime={data.completed.anime[month]}
                        animeCount={data.completed_count.anime[month]}
                        manga={data.completed.manga[month]}
                        mangaCount={data.completed_count.manga[month]}
                        novel={data.completed.novel[month]}
                        novelCount={data.completed_count.novel[month]}
                    />
                ))}
            </div>
        </Block>
    );
};

interface MonthSectionProps {
    month: Month;
    anime: YearCompletedContent[];
    manga: YearCompletedContent[];
    novel: YearCompletedContent[];
    animeCount: number;
    mangaCount: number;
    novelCount: number;
}

const MonthSection: FC<MonthSectionProps> = ({
    month,
    anime,
    manga,
    novel,
    animeCount,
    mangaCount,
    novelCount,
}) => {
    const contentSections: {
        type: YearContentType;
        items: YearCompletedContent[];
        count: number;
    }[] = [
        {
            type: ContentTypeEnum.ANIME as YearContentType,
            items: anime,
            count: animeCount,
        },
        {
            type: ContentTypeEnum.MANGA as YearContentType,
            items: manga,
            count: mangaCount,
        },
        {
            type: ContentTypeEnum.NOVEL as YearContentType,
            items: novel,
            count: novelCount,
        },
    ].filter((section) => section.items.length > 0);

    return (
        <div className="flex md:gap-8 gap-4 relative">
            <div className="flex flex-col items-center h-auto">
                <div className="flex p-2 w-20 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground border-2 border-primary-border sticky top-28 md:top-20">
                    <span className="text-xs font-semibold">
                        {MONTH_LABELS_FULL[month]}
                    </span>
                </div>
                <div className="w-[1px] flex-1 bg-border" />
            </div>

            <div className="flex flex-col gap-6 flex-1 pb-8">
                {contentSections.map(({ type, items, count }) => (
                    <div key={type} className="flex flex-col gap-4">
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle variant="h3">
                                    {CONTENT_TYPE_LABELS[type]}
                                </HeaderTitle>
                                <Badge variant="secondary">
                                    {count}{' '}
                                    {getDeclensionWord(count, [
                                        'тайтл',
                                        'тайтли',
                                        'тайтлів',
                                    ])}
                                </Badge>
                            </HeaderContainer>
                        </Header>

                        <Stack size={4} extendedSize={4} extended>
                            {items.map((item) => (
                                <ContentCard
                                    key={item.slug}
                                    title={
                                        item.title_ua ||
                                        item.title_en ||
                                        item.title_ja ||
                                        item.title_original ||
                                        null
                                    }
                                    image={item.image}
                                    href={`/${type}/${item.slug}`}
                                >
                                    <div className="absolute flex items-start justify-end top-0 w-full h-16 p-2 left-0 bg-gradient-to-b from-black/60 to-transparent">
                                        <div className="bg-secondary/20 backdrop-blur rounded-md px-2 py-1">
                                            <span className="text-xs text-white">
                                                {format(
                                                    item.date * 1000,
                                                    'd MMMM',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </ContentCard>
                            ))}
                        </Stack>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YearCompletedTimeline;
