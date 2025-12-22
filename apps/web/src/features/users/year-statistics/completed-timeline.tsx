'use client';

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
    ContentType,
    MONTHS,
    MONTH_LABELS_FULL,
    YearCompletedContent,
    YearStatistics,
} from '@/types/year-statistics';
import { getDeclensionWord } from '@/utils/i18n';

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
    anime: 'Аніме',
    manga: 'Манґа',
    novel: 'Ранобе',
};

interface Props {
    data: YearStatistics;
}

const YearCompletedTimeline: FC<Props> = ({ data }) => {
    const monthsWithContent = MONTHS.filter((month) => {
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
                {monthsWithContent.map((month) => (
                    <MonthSection
                        key={month}
                        month={month}
                        anime={data.completed.anime[month]}
                        manga={data.completed.manga[month]}
                        novel={data.completed.novel[month]}
                    />
                ))}
            </div>
        </Block>
    );
};

interface MonthSectionProps {
    month: (typeof MONTHS)[number];
    anime: YearCompletedContent[];
    manga: YearCompletedContent[];
    novel: YearCompletedContent[];
}

const MonthSection: FC<MonthSectionProps> = ({
    month,
    anime,
    manga,
    novel,
}) => {
    const contentSections: {
        type: ContentType;
        items: YearCompletedContent[];
    }[] = [
        { type: 'anime', items: anime },
        { type: 'manga', items: manga },
        { type: 'novel', items: novel },
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
                {contentSections.map(({ type, items }) => (
                    <div key={type} className="flex flex-col gap-4">
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle variant="h3">
                                    {CONTENT_TYPE_LABELS[type]}
                                </HeaderTitle>
                                <Badge variant="secondary">
                                    {items.length}{' '}
                                    {getDeclensionWord(items.length, [
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
                                            <span className="text-xs">
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
