import type { FC } from 'react';

import { Star, User } from 'lucide-react-native';
import { View } from 'react-native';

import { ContentStatusEnum, ContentTypeEnum } from '@hikka/api';
import { getMediaTypeLabel, getTitle, RELEASE_STATUS } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { contentHref } from '@/utils/content-href';

import type { SearchItem } from './queries';

const STATUS_BADGE = new Set<string>(Object.values(ContentStatusEnum));

function subtitle(item: SearchItem) {
    switch (item.data_type) {
        case ContentTypeEnum.ANIME:
            return item.title_ja;
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return item.title_original;
        case ContentTypeEnum.CHARACTER:
            return item.name_ja;
        case ContentTypeEnum.PERSON:
            return item.name_native;
    }
}

type Props = {
    item: SearchItem;
};

/** The web's `SearchCard`: poster, title / original title, and year · type · status · score for content. */
const SearchResultRow: FC<Props> = ({ item }) => {
    const original = subtitle(item);
    const content =
        item.data_type === ContentTypeEnum.ANIME ||
        item.data_type === ContentTypeEnum.MANGA ||
        item.data_type === ContentTypeEnum.NOVEL
            ? item
            : null;
    const meta = content
        ? [
              content.year ? String(content.year) : null,
              getMediaTypeLabel(content.media_type),
          ]
              .filter(Boolean)
              .join(' · ')
        : '';
    const status =
        content?.status && STATUS_BADGE.has(content.status)
            ? (content.status as ContentStatusEnum)
            : null;

    return (
        <HorizontalCard
            href={contentHref(item.data_type, item.slug)}
            className="px-4 py-2"
        >
            <HorizontalCardImage
                image={
                    item.image ?? (
                        <Icon
                            as={User}
                            className="size-6 text-muted-foreground"
                        />
                    )
                }
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{getTitle(item)}</HorizontalCardTitle>
                {original ? (
                    <HorizontalCardDescription>
                        {original}
                    </HorizontalCardDescription>
                ) : null}
                {content ? (
                    <View className="flex-row flex-wrap items-center gap-2">
                        {meta ? (
                            <Text className="text-muted-foreground text-xs">
                                {meta}
                            </Text>
                        ) : null}
                        {status ? (
                            <Badge variant="status" status={status}>
                                {RELEASE_STATUS[status].title_ua}
                            </Badge>
                        ) : null}
                        {content.score > 0 ? (
                            <Badge>
                                {content.score}
                                <Icon as={Star} className="size-3" />
                            </Badge>
                        ) : null}
                    </View>
                ) : null}
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default SearchResultRow;
