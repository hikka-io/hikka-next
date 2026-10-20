import { Redirect, useLocalSearchParams } from 'expo-router';

import { MainContentTypeEnum } from '@hikka/api';

import { ListEntrySheet } from '@/components/tracking';

const CONTENT_TYPES: readonly string[] = Object.values(MainContentTypeEnum);

const isContentType = (value: string): value is MainContentTypeEnum =>
    CONTENT_TYPES.includes(value);

export default function ListEntryScreen() {
    const { content_type, slug } = useLocalSearchParams<{
        content_type: string;
        slug: string;
    }>();

    if (!isContentType(content_type) || !slug) return <Redirect href="/" />;

    return (
        <ListEntrySheet
            key={`${content_type}/${slug}`}
            contentType={content_type}
            slug={slug}
        />
    );
}
