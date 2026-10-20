import type { FC } from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import type {
    ArticleAnimeContentResponse,
    ArticleMangaNovelContentResponse,
    ContentTypeEnum,
} from '@hikka/api';
import { CONTENT_TYPES } from '@hikka/core';

import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { useTitle } from '@/services/session';
import { contentHref } from '@/utils/content-href';

type Props = {
    content: ArticleAnimeContentResponse | ArticleMangaNovelContentResponse;
};

/** The web's `ContentRefChip`: the title the article is about and its type, linking to it. */
const ArticleContentChip: FC<Props> = ({ content }) => {
    const router = useRouter();
    const getTitle = useTitle();
    const type = content.data_type as ContentTypeEnum;

    return (
        <Chip
            accessibilityRole="link"
            className="max-w-full shrink bg-secondary/40"
            containerClassName="max-w-full self-start"
            textClassName="text-muted-foreground"
            onPress={() => router.push(contentHref(type, content.slug))}
        >
            <Text numberOfLines={1} className="shrink text-foreground">
                {getTitle(content)}
            </Text>
            <View className="size-1 shrink-0 rounded-full bg-muted-foreground" />
            <Text className="shrink-0">{CONTENT_TYPES[type].title_ua}</Text>
        </Chip>
    );
};

export default ArticleContentChip;
