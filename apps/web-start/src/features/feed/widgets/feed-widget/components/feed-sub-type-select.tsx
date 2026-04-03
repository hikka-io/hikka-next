'use client';

import {
    ArticleCategoryEnum,
    CollectionContentType,
    CommentsContentType,
    ContentTypeEnum,
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

import { useSettingsStore } from '@/services/stores/settings-store';

import { FeedFilterEnum } from '../../../types';

const COMMENT_OPTIONS: { value: CommentsContentType; label: string }[] = [
    { value: ContentTypeEnum.ANIME, label: 'Аніме' },
    { value: ContentTypeEnum.MANGA, label: 'Манґа' },
    { value: ContentTypeEnum.NOVEL, label: 'Ранобе' },
    { value: ContentTypeEnum.CHARACTER, label: 'Персонаж' },
    { value: ContentTypeEnum.PERSON, label: 'Автор' },
    { value: ContentTypeEnum.COLLECTION, label: 'Колекція' },
    { value: ContentTypeEnum.ARTICLE, label: 'Стаття' },
    { value: ContentTypeEnum.EDIT, label: 'Правка' },
];

const ARTICLE_CONTENT_OPTIONS: {
    value: FeedArticleContentType;
    label: string;
}[] = [
    { value: ContentTypeEnum.ANIME, label: 'Аніме' },
    { value: ContentTypeEnum.MANGA, label: 'Манґа' },
    { value: ContentTypeEnum.NOVEL, label: 'Ранобе' },
    { value: 'no_content', label: 'Без контенту' },
];

const ARTICLE_CATEGORY_OPTIONS: {
    value: ArticleCategoryEnum;
    label: string;
}[] = [
    { value: ArticleCategoryEnum.ORIGINAL, label: 'Авторське' },
    { value: ArticleCategoryEnum.REVIEWS, label: 'Огляди' },
    { value: ArticleCategoryEnum.NEWS, label: 'Новини' },
];

const COLLECTION_OPTIONS: { value: CollectionContentType; label: string }[] = [
    { value: ContentTypeEnum.ANIME, label: 'Аніме' },
    { value: ContentTypeEnum.MANGA, label: 'Манґа' },
    { value: ContentTypeEnum.NOVEL, label: 'Ранобе' },
    { value: ContentTypeEnum.CHARACTER, label: 'Персонаж' },
    { value: ContentTypeEnum.PERSON, label: 'Людина' },
];

type Prefix = 'comment' | 'article' | 'articleCategory' | 'collection';

function buildPrefixedValues(
    commentTypes: string[],
    articleTypes: string[],
    articleCategories: string[],
    collectionTypes: string[],
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

interface Props {
    filter: FeedFilterEnum;
}

const FeedSubTypeSelect: FC<Props> = ({ filter }) => {
    const { preferences, setFilterPreference } = useSettingsStore();

    const commentTypes = preferences.filters.feedCommentContentTypes || [];
    const articleTypes = preferences.filters.feedArticleContentTypes || [];
    const articleCategories = preferences.filters.feedArticleCategories || [];
    const collectionTypes =
        preferences.filters.feedCollectionContentTypes || [];

    const prefixedValues = useMemo(
        () =>
            buildPrefixedValues(
                commentTypes,
                articleTypes,
                articleCategories,
                collectionTypes,
            ),
        [commentTypes, articleTypes, articleCategories, collectionTypes],
    );

    const handleChange = (values: string[]) => {
        const parsed = parsePrefixedValues(values);
        setFilterPreference('feedCommentContentTypes', parsed.comment);
        setFilterPreference('feedArticleContentTypes', parsed.article);
        setFilterPreference('feedArticleCategories', parsed.articleCategory);
        setFilterPreference('feedCollectionContentTypes', parsed.collection);
    };

    const showComments =
        filter === FeedFilterEnum.ALL || filter === FeedFilterEnum.COMMENTS;
    const showArticles =
        filter === FeedFilterEnum.ALL || filter === FeedFilterEnum.ARTICLES;
    const showCollections =
        filter === FeedFilterEnum.ALL || filter === FeedFilterEnum.COLLECTIONS;

    const visibleValues = useMemo(() => {
        return prefixedValues.filter((v) => {
            if (v.startsWith('comment:')) return showComments;
            if (v.startsWith('article:') || v.startsWith('articleCategory:'))
                return showArticles;
            if (v.startsWith('collection:')) return showCollections;
            return false;
        });
    }, [prefixedValues, showComments, showArticles, showCollections]);

    return (
        <Select multiple value={visibleValues} onValueChange={handleChange}>
            <SelectTrigger size="md">
                <SelectValue placeholder="Фільтри контенту" maxDisplay={1} />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    {showComments && (
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
                    )}
                    {showComments && showArticles && <SelectSeparator />}
                    {showArticles && (
                        <>
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
                                {ARTICLE_CATEGORY_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={`articleCategory:${opt.value}`}
                                        value={`articleCategory:${opt.value}`}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </>
                    )}
                    {showArticles && showCollections && <SelectSeparator />}
                    {showCollections && (
                        <SelectGroup heading="Колекції">
                            {COLLECTION_OPTIONS.map((opt) => (
                                <SelectItem
                                    key={`collection:${opt.value}`}
                                    value={`collection:${opt.value}`}
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default FeedSubTypeSelect;
