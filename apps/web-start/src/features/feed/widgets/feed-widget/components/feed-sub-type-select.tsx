'use client';

import {
    ArticleCategoryEnum,
    CollectionContentType,
    CommentsContentType,
    ContentTypeEnum,
    FeedArticleCategory,
    FeedArticleContentType,
} from '@hikka/client';
import { FC, useMemo } from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';
import {
    ARTICLE_CATEGORY_OPTIONS,
    CONTENT_TYPES,
} from '@/utils/constants/common';
import { COLLECTION_CONTENT_TYPE_OPTIONS } from '@/utils/constants/common';

const COMMENT_OPTIONS: { value: CommentsContentType; label: string }[] = (
    [
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
        ContentTypeEnum.CHARACTER,
        ContentTypeEnum.PERSON,
        ContentTypeEnum.COLLECTION,
        ContentTypeEnum.ARTICLE,
        ContentTypeEnum.EDIT,
    ] as CommentsContentType[]
).map((v) => ({ value: v, label: CONTENT_TYPES[v].title_ua }));

const ARTICLE_CONTENT_OPTIONS: {
    value: FeedArticleContentType;
    label: string;
}[] = [
    { value: ContentTypeEnum.ANIME, label: CONTENT_TYPES.anime.title_ua },
    { value: ContentTypeEnum.MANGA, label: CONTENT_TYPES.manga.title_ua },
    { value: ContentTypeEnum.NOVEL, label: CONTENT_TYPES.novel.title_ua },
    { value: 'no_content', label: 'Без контенту' },
];

const FEED_ARTICLE_CATEGORY_OPTIONS: {
    value: FeedArticleCategory;
    label: string;
}[] = (
    Object.keys(ARTICLE_CATEGORY_OPTIONS) as ArticleCategoryEnum[]
)
    .filter((k) => k !== ArticleCategoryEnum.SYSTEM)
    .map((k) => ({
        value: k as FeedArticleCategory,
        label: ARTICLE_CATEGORY_OPTIONS[k].title_ua,
    }));

type Prefix = 'comment' | 'article' | 'articleCategory' | 'collection';

function buildPrefixedValues(
    commentTypes: readonly string[],
    articleTypes: readonly string[],
    articleCategories: readonly string[],
    collectionTypes: readonly string[],
): string[] {
    return [
        ...commentTypes.map((v) => `comment:${v}`),
        ...articleTypes.map((v) => `article:${v}`),
        ...articleCategories.map((v) => `articleCategory:${v}`),
        ...collectionTypes.map((v) => `collection:${v}`),
    ];
}

function parsePrefixedValues(values: string[]): Record<Prefix, string[]> {
    const result: Record<Prefix, string[]> = {
        comment: [],
        article: [],
        articleCategory: [],
        collection: [],
    };

    for (const v of values) {
        const idx = v.indexOf(':');
        if (idx === -1) continue;
        const prefix = v.slice(0, idx) as Prefix;
        const value = v.slice(idx + 1);
        if (prefix in result) {
            result[prefix].push(value);
        }
    }

    return result;
}

const EMPTY: readonly string[] = [];

const FeedSubTypeSelect: FC = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const feedSettings = preferences.feed;

    const prefixedValues = useMemo(
        () =>
            buildPrefixedValues(
                feedSettings.comment_content_types ?? EMPTY,
                feedSettings.article_content_types ?? EMPTY,
                feedSettings.article_categories ?? EMPTY,
                feedSettings.collection_content_types ?? EMPTY,
            ),
        [
            feedSettings.comment_content_types,
            feedSettings.article_content_types,
            feedSettings.article_categories,
            feedSettings.collection_content_types,
        ],
    );

    const handleChange = (values: string[]) => {
        const parsed = parsePrefixedValues(values);
        update({
            preferences: {
                feed: {
                    comment_content_types: parsed.comment.length
                        ? (parsed.comment as CommentsContentType[])
                        : null,
                    article_content_types: parsed.article.length
                        ? (parsed.article as FeedArticleContentType[])
                        : null,
                    article_categories: parsed.articleCategory.length
                        ? (parsed.articleCategory as FeedArticleCategory[])
                        : null,
                    collection_content_types: parsed.collection.length
                        ? (parsed.collection as CollectionContentType[])
                        : null,
                },
            },
        });
    };

    return (
        <Select multiple value={prefixedValues} onValueChange={handleChange}>
            <SelectTrigger size="md">
                <SelectValue placeholder="Фільтри контенту" maxDisplay={1} />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    <SelectGroup heading="Коментарі">
                        {COMMENT_OPTIONS.map((opt) => (
                            <SelectItem
                                key={`comment:${opt.value}`}
                                value={`comment:${opt.value}`}
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup heading="Статті: контент">
                        {ARTICLE_CONTENT_OPTIONS.map((opt) => (
                            <SelectItem
                                key={`article:${opt.value}`}
                                value={`article:${opt.value}`}
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup heading="Статті: категорія">
                        {FEED_ARTICLE_CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem
                                key={`articleCategory:${opt.value}`}
                                value={`articleCategory:${opt.value}`}
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup heading="Колекції">
                        {COLLECTION_CONTENT_TYPE_OPTIONS.map((opt) => (
                            <SelectItem
                                key={`collection:${opt.value}`}
                                value={`collection:${opt.value}`}
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default FeedSubTypeSelect;
