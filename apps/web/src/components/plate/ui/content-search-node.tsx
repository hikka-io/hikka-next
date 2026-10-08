import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { Ellipsis } from 'lucide-react';
import type { PlateEditor, PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import {
    type AnimeResponse,
    API_LIMITS,
    type CharacterResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaResponse,
    type NovelResponse,
    type PersonResponse,
    searchAnimeOptions,
    searchCharactersOptions,
    searchMangaOptions,
    searchNovelOptions,
    searchPeopleOptions,
} from '@hikka/api';

import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { useSessionUI } from '@/services/session';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { SYMBOL_FORMS } from '@/utils/i18n/word-forms';
import { CONTENT_TYPES } from '@/utils/labels';
import { getTitle } from '@/utils/title/get-title';

import { insertContentLink } from '../editor/transforms';
import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxGroupLabel,
    InlineComboboxInput,
    InlineComboboxItem,
    InlineComboboxSeparator,
} from './inline-combobox';

type SearchContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;

type SearchContentType =
    | MainContentTypeEnum
    | typeof ContentTypeEnum.CHARACTER
    | typeof ContentTypeEnum.PERSON;

const GROUP_SIZE = 3;
const TOO_SHORT_MESSAGE = `Введіть щонайменше ${API_LIMITS.searchQuery.min} ${getDeclensionWord(API_LIMITS.searchQuery.min, SYMBOL_FORMS)}`;

// The title already follows the viewer's language preference, so the subtitle
// picks the first alternate that differs from it rather than a fixed field.
const subtitleOf = (item: SearchContent, title: string) => {
    const year = (item as AnimeResponse).year;

    if (year) return String(year);

    const alternates = [
        (item as CharacterResponse).name_ja,
        (item as PersonResponse).name_native,
        (item as CharacterResponse).name_en,
        (item as CharacterResponse).name_ua,
    ];

    return alternates.find((value) => value && value !== title) ?? '';
};

type ContentRowProps = {
    item: SearchContent;
    title: string;
};

function ContentRow({ item, title }: ContentRowProps) {
    const subtitle = subtitleOf(item, title);

    return (
        <div className="flex min-w-0 items-center gap-2">
            <div className="h-8 w-6 shrink-0 overflow-hidden rounded-(--base-radius) bg-secondary">
                {item.image && (
                    <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                    />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate">{title}</p>
                {subtitle && (
                    <p className="truncate text-muted-foreground text-xs">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

type GroupProps = {
    contentType: SearchContentType;
    items: SearchContent[] | undefined;
    hasMore: boolean;
    onShowMore: () => void;
    editor: PlateEditor;
    resolveTitle: (item: SearchContent) => string;
};

function ContentGroup({
    contentType,
    items,
    hasMore,
    onShowMore,
    editor,
    resolveTitle,
}: GroupProps) {
    if (!items?.length) return null;

    return (
        <InlineComboboxGroup>
            <InlineComboboxGroupLabel>
                {CONTENT_TYPES[contentType].plural}
            </InlineComboboxGroupLabel>

            {items.map((item) => {
                const title = resolveTitle(item);

                return (
                    <InlineComboboxItem
                        key={`${contentType}-${item.slug}`}
                        value={`${contentType}-${item.slug}`}
                        onClick={() =>
                            insertContentLink(editor, {
                                type: contentType,
                                slug: item.slug,
                                text: title,
                            })
                        }
                    >
                        <ContentRow item={item} title={title} />
                    </InlineComboboxItem>
                );
            })}

            {hasMore && (
                <InlineComboboxItem
                    keepOpen
                    value={`${contentType}-show-more`}
                    className="justify-center text-muted-foreground text-xs"
                    onClick={onShowMore}
                >
                    <Ellipsis />
                    Показати ще
                </InlineComboboxItem>
            )}
        </InlineComboboxGroup>
    );
}

export function ContentSearchInputElement(props: PlateElementProps) {
    const { children, editor, element } = props;
    const [search, setSearch] = React.useState('');
    const [debouncedSearch] = useDebounce({
        value: search,
        delay: DEBOUNCE_MS.input,
    });
    const { preferences } = useSessionUI();

    const isTooShort =
        debouncedSearch.trim().length < API_LIMITS.searchQuery.min;
    const isPending = search !== debouncedSearch;
    const body = { query: debouncedSearch };
    const enabled = !isTooShort;

    const [sizes, setSizes] = React.useState<Partial<Record<string, number>>>(
        {},
    );

    // A new query starts every group over at the first page.
    React.useEffect(() => setSizes({}), [debouncedSearch]);

    const sizeOf = (contentType: ContentTypeEnum) =>
        sizes[contentType] ?? GROUP_SIZE;

    const showMore = (contentType: ContentTypeEnum) =>
        setSizes((prev) => ({
            ...prev,
            [contentType]: (prev[contentType] ?? GROUP_SIZE) + GROUP_SIZE,
        }));

    // Keeps the previous page on screen while the larger one loads.
    const keepPrevious = { placeholderData: <T,>(prev: T) => prev, enabled };

    const anime = useQuery({
        ...searchAnimeOptions({
            body,
            query: { size: sizeOf(ContentTypeEnum.ANIME) },
        }),
        ...keepPrevious,
    });
    const manga = useQuery({
        ...searchMangaOptions({
            body,
            query: { size: sizeOf(ContentTypeEnum.MANGA) },
        }),
        ...keepPrevious,
    });
    const novel = useQuery({
        ...searchNovelOptions({
            body,
            query: { size: sizeOf(ContentTypeEnum.NOVEL) },
        }),
        ...keepPrevious,
    });
    const characters = useQuery({
        ...searchCharactersOptions({
            body,
            query: { size: sizeOf(ContentTypeEnum.CHARACTER) },
        }),
        ...keepPrevious,
    });
    const people = useQuery({
        ...searchPeopleOptions({
            body,
            query: { size: sizeOf(ContentTypeEnum.PERSON) },
        }),
        ...keepPrevious,
    });

    const resolveTitle = (item: SearchContent) =>
        getTitle(
            item,
            preferences?.title_language ?? 'title_ua',
            preferences?.name_language ?? 'name_ua',
        );

    const isFetching =
        anime.isFetching ||
        manga.isFetching ||
        novel.isFetching ||
        characters.isFetching ||
        people.isFetching;

    const groups = (
        [
            { contentType: ContentTypeEnum.ANIME, result: anime.data },
            { contentType: ContentTypeEnum.MANGA, result: manga.data },
            { contentType: ContentTypeEnum.NOVEL, result: novel.data },
            {
                contentType: ContentTypeEnum.CHARACTER,
                result: characters.data,
            },
            { contentType: ContentTypeEnum.PERSON, result: people.data },
        ] as {
            contentType: SearchContentType;
            result?: {
                list: SearchContent[];
                pagination: { total: number };
            };
        }[]
    )
        .map(({ contentType, result }) => ({
            contentType,
            items: result?.list,
            hasMore:
                (result?.list.length ?? 0) < (result?.pagination.total ?? 0),
        }))
        .filter((group) => group.items?.length);

    return (
        <PlateElement as="span" {...props}>
            <InlineCombobox
                value={search}
                element={element}
                filter={false}
                setValue={setSearch}
                trigger="#"
                hideWhenNoValue
            >
                <InlineComboboxInput />

                <InlineComboboxContent>
                    <InlineComboboxEmpty>
                        {isTooShort
                            ? TOO_SHORT_MESSAGE
                            : isFetching || isPending
                              ? 'Завантаження...'
                              : 'Нічого не знайдено'}
                    </InlineComboboxEmpty>

                    {groups.map((group, index) => (
                        <React.Fragment key={group.contentType}>
                            {index > 0 && <InlineComboboxSeparator />}
                            <ContentGroup
                                contentType={group.contentType}
                                items={group.items}
                                hasMore={group.hasMore}
                                onShowMore={() => showMore(group.contentType)}
                                editor={editor}
                                resolveTitle={resolveTitle}
                            />
                        </React.Fragment>
                    ))}
                </InlineComboboxContent>
            </InlineCombobox>

            {children}
        </PlateElement>
    );
}
