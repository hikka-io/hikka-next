import type { FC } from 'react';

import { View } from 'react-native';

import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';
import {
    convertHistory,
    formatHistoryTime,
    formatTimestamp,
    getTitle,
    type HistoryFact,
    type NameLanguage,
    type TitleLanguage,
} from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text, TextClassContext } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { contentHref } from '@/utils/content-href';

const IMPORT_TITLES: Partial<Record<HistoryTypeEnum, string>> = {
    [HistoryTypeEnum.WATCH_IMPORT]: 'Імпорт аніме',
    [HistoryTypeEnum.READ_IMPORT]: 'Імпорт манґи та ранобе',
};

const Fact: FC<{ fact: HistoryFact }> = ({ fact }) => (
    <>
        {fact.map((part, index) => (
            <Text
                // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
                key={index}
                className={
                    part.type === 'text'
                        ? undefined
                        : 'font-medium text-foreground'
                }
            >
                {part.text}
            </Text>
        ))}
    </>
);

type Props = {
    item: HistoryResponse;
    titleLanguage?: TitleLanguage;
    nameLanguage?: NameLanguage;
    // The following feed names who made the change; a profile's own history does not.
    showUser?: boolean;
    // Day-grouped lists show the clock time, a flat preview the time since.
    relativeTime?: boolean;
    className?: string;
};

const HistoryRow: FC<Props> = ({
    item,
    titleLanguage,
    nameLanguage,
    showUser = false,
    relativeTime = false,
    className,
}) => {
    const entry = convertHistory(item);
    const content = item.content;
    const title =
        (content && getTitle(content, titleLanguage, nameLanguage)) ||
        IMPORT_TITLES[item.history_type] ||
        'Загальне';

    return (
        <HorizontalCard
            className={className}
            href={
                content
                    ? contentHref(content.data_type, content.slug)
                    : undefined
            }
        >
            <HorizontalCardImage image={content?.image ?? undefined} />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle
                    titleMeta={
                        <Text
                            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                            className="shrink-0 text-muted-foreground text-xs tabular-nums"
                        >
                            {relativeTime
                                ? formatTimestamp(item.created, Date.now())
                                      .label
                                : formatHistoryTime(item.created)}
                        </Text>
                    }
                >
                    {title}
                </HorizontalCardTitle>
                <TextClassContext.Provider value="text-xs text-muted-foreground">
                    <Text
                        numberOfLines={2}
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    >
                        {entry.facts.map((fact, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: facts never reorder
                            <Text key={index}>
                                {index > 0 && ' · '}
                                <Fact fact={fact} />
                            </Text>
                        ))}
                    </Text>
                </TextClassContext.Provider>
                {showUser && (
                    <View className="flex-row items-center gap-1.5">
                        <Avatar className="size-4 rounded-sm">
                            <AvatarImage src={item.user.avatar} size={16} />
                            <AvatarFallback className="rounded-sm" />
                        </Avatar>
                        <Text
                            numberOfLines={1}
                            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                            className="shrink text-muted-foreground text-xs"
                        >
                            {item.user.username}
                        </Text>
                    </View>
                )}
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default HistoryRow;
