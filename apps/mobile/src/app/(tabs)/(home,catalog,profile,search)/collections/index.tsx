import { Stack, useLocalSearchParams } from 'expo-router';

import { CollectionContentTypeEnum } from '@hikka/api';

import { CollectionList } from '@/features/collections';
import { contentCollectionsOptions } from '@/features/content';

const CONTENT_TYPES: readonly string[] = Object.values(
    CollectionContentTypeEnum,
);

const isContentType = (value?: string): value is CollectionContentTypeEnum =>
    !!value && CONTENT_TYPES.includes(value);

export default function CollectionsScreen() {
    const { author, content_type, content } = useLocalSearchParams<{
        author?: string;
        content_type?: string;
        content?: string;
    }>();

    if (isContentType(content_type) && content) {
        return (
            <>
                <Stack.Title>Колекції</Stack.Title>
                <CollectionList
                    key={`${content_type}/${content}`}
                    options={contentCollectionsOptions(content_type, content)}
                    emptyTitle="Колекцій не знайдено"
                    emptyDescription="Цей тайтл ще не додано до жодної колекції"
                />
            </>
        );
    }

    return (
        <>
            <Stack.Title>Колекції</Stack.Title>
            <CollectionList key={author} author={author || undefined} />
        </>
    );
}
