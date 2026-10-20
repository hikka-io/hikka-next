import type { FC } from 'react';

import { Star } from 'lucide-react-native';
import { View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import type { MainContentTypeEnum } from '@hikka/api';
import { getMediaTypeLabel, parseTextFromMarkDown } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { listEntryHref } from '@/components/tracking';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { useTitle } from '@/services/session';
import { contentHref } from '@/utils/content-href';

import { statusLabel } from '../list-status';
import type { UserListEntry } from '../queries';
import { entryContent, entryProgress, entryRepeats } from './list-entry';

const STATUS_BADGES = [
    'planned',
    'watching',
    'reading',
    'completed',
    'on_hold',
    'dropped',
] as const;

type BadgeStatus = (typeof STATUS_BADGES)[number];

const isBadgeStatus = (value: string): value is BadgeStatus =>
    (STATUS_BADGES as readonly string[]).includes(value);

type Props = {
    entry: UserListEntry;
    contentType: MainContentTypeEnum;
    owner: boolean;
    showStatus: boolean;
};

/**
 * The web table's row: title, progress, rewatches, score and, for the owner, the note. The
 * owner's rows open the edit sheet; everyone else's open the title.
 */
const ListEntryRow: FC<Props> = ({ entry, contentType, owner, showStatus }) => {
    const getTitle = useTitle();
    const { color: starColor } = useResolveClassNames('text-yellow-400');
    const content = entryContent(entry);
    const repeats = entryRepeats(entry);
    const note =
        owner && entry.note
            ? parseTextFromMarkDown(entry.note).replace(/\s+/g, ' ').trim()
            : '';
    const meta = [getMediaTypeLabel(content.media_type), entryProgress(entry)]
        .filter(Boolean)
        .join(' · ');

    return (
        <HorizontalCard
            href={
                owner
                    ? listEntryHref(contentType, content.slug)
                    : contentHref(contentType, content.slug)
            }
            className="px-4 py-2"
        >
            <HorizontalCardImage image={content.image} />
            <HorizontalCardContainer className="gap-1.5">
                <HorizontalCardTitle
                    titleMeta={
                        entry.score > 0 ? (
                            <View
                                accessibilityLabel={`Оцінка ${entry.score}`}
                                className="shrink-0 flex-row items-center gap-1"
                            >
                                <Text
                                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                                    className="font-bold text-sm tabular-nums"
                                >
                                    {entry.score}
                                </Text>
                                <Icon
                                    as={Star}
                                    fill={
                                        typeof starColor === 'string'
                                            ? starColor
                                            : undefined
                                    }
                                    className="size-3.5 text-yellow-400"
                                />
                            </View>
                        ) : null
                    }
                >
                    {getTitle(content)}
                </HorizontalCardTitle>
                <HorizontalCardDescription>{meta}</HorizontalCardDescription>
                {note ? (
                    <Text
                        numberOfLines={2}
                        className="text-muted-foreground text-xs"
                    >
                        {note}
                    </Text>
                ) : null}
                {(showStatus && isBadgeStatus(entry.status)) || repeats ? (
                    <View className="flex-row flex-wrap gap-2">
                        {showStatus && isBadgeStatus(entry.status) ? (
                            <Badge variant="status" status={entry.status}>
                                {statusLabel(contentType, entry.status)}
                            </Badge>
                        ) : null}
                        {repeats ? (
                            <Badge variant="warning">{repeats}</Badge>
                        ) : null}
                    </View>
                ) : null}
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default ListEntryRow;
