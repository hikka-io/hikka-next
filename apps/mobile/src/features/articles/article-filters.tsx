import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import type { ArticleCategoryEnum } from '@hikka/api';
import {
    ARTICLE_CATEGORY,
    type ArticlesSearch,
    PUBLIC_ARTICLE_CATEGORIES,
} from '@hikka/core';

import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';

import { singleCategory } from './queries';

type Props = {
    search: ArticlesSearch;
    // Drafts are the viewer's own, so the filter applies only with a session.
    showDraft: boolean;
    onChange: (update: (prev: ArticlesSearch) => ArticlesSearch) => void;
};

const CATEGORY_OPTIONS: { value?: ArticleCategoryEnum; label: string }[] = [
    { label: 'Усі' },
    ...PUBLIC_ARTICLE_CATEGORIES.map((value) => ({
        value,
        label: ARTICLE_CATEGORY[value].title_ua,
    })),
];

/** The web's article filters: categories as a chip row (`ChipTabs`), then the author, tag and draft filters a link set, removable. */
const ArticleFilters: FC<Props> = ({ search, showDraft, onChange }) => {
    const category = singleCategory(search);
    const anyCategory = !search.categories?.length;
    const tags = search.tags ?? [];

    const remove = (update: (prev: ArticlesSearch) => ArticlesSearch) => {
        Haptics.selectionAsync();
        onChange(update);
    };

    return (
        <View className="gap-1 pb-2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-4"
                contentContainerClassName="gap-2 px-4"
            >
                {CATEGORY_OPTIONS.map((option) => {
                    const selected = option.value
                        ? option.value === category
                        : anyCategory;
                    return (
                        <Chip
                            key={option.value ?? 'all'}
                            selected={selected}
                            className={selected ? undefined : 'bg-secondary'}
                            onPress={() => {
                                if (selected) return;
                                Haptics.selectionAsync();
                                onChange((prev) => ({
                                    ...prev,
                                    categories: option.value
                                        ? [option.value]
                                        : undefined,
                                }));
                            }}
                        >
                            {option.label}
                        </Chip>
                    );
                })}
            </ScrollView>
            {(search.author ||
                tags.length > 0 ||
                (showDraft && search.draft)) && (
                <View className="flex-row flex-wrap gap-x-2">
                    {search.author && (
                        <Chip
                            accessibilityLabel={`Прибрати фільтр автора ${search.author}`}
                            className="bg-secondary"
                            onPress={() =>
                                remove((prev) => ({
                                    ...prev,
                                    author: undefined,
                                }))
                            }
                        >
                            {`Автор: ${search.author}`}
                            <Icon as={X} className="size-3.5" />
                        </Chip>
                    )}
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            accessibilityLabel={`Прибрати тег ${tag}`}
                            className="bg-secondary"
                            onPress={() =>
                                remove((prev) => ({
                                    ...prev,
                                    tags: prev.tags?.filter(
                                        (value) => value !== tag,
                                    ),
                                }))
                            }
                        >
                            {tag}
                            <Icon as={X} className="size-3.5" />
                        </Chip>
                    ))}
                    {showDraft && search.draft && (
                        <Chip
                            accessibilityLabel="Прибрати фільтр чернеток"
                            className="bg-secondary"
                            onPress={() =>
                                remove((prev) => ({
                                    ...prev,
                                    draft: undefined,
                                }))
                            }
                        >
                            Чернетки
                            <Icon as={X} className="size-3.5" />
                        </Chip>
                    )}
                </View>
            )}
        </View>
    );
};

export default ArticleFilters;
