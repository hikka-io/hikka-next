import {
    COMMENT_SORT_OPTIONS,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
} from './comment-sort';
import { formatSort } from './format';

export type SortType =
    | 'anime'
    | 'watch'
    | 'manga'
    | 'novel'
    | 'read'
    | 'edit'
    | 'article'
    | 'comment'
    | 'todo_content'
    | 'todo_person';

export interface SortOption {
    label: string;
    value: string;
    /** Hidden fields auto-appended after this field in API calls. */
    secondaryFields?: string[];
}

export interface SortConfig {
    options: readonly SortOption[];
    defaultSort: string;
    defaultOrder: 'asc' | 'desc';
}

const SHARED_SORT: SortOption[] = [
    {
        label: 'Оцінка MAL',
        value: 'score',
        secondaryFields: ['scored_by'],
    },
    {
        label: 'Оцінка Hikka',
        value: 'native_score',
        secondaryFields: ['native_scored_by'],
    },
    {
        label: 'Тип',
        value: 'media_type',
    },
];

const SORT_CONTENT: SortOption[] = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'Дата створення на сайті',
        value: 'created',
    },
];

const SORT_WATCHLIST: SortOption[] = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'К-сть епізодів',
        value: 'watch_episodes',
    },
    {
        label: 'Дата додавання',
        value: 'watch_created',
    },
    {
        label: 'Власна оцінка',
        value: 'watch_score',
    },
];

const SORT_READLIST: SortOption[] = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'Дата додавання',
        value: 'read_created',
    },
    {
        label: 'К-сть томів',
        value: 'read_volumes',
    },
    {
        label: 'К-сть розділів',
        value: 'read_chapters',
    },
    {
        label: 'Власна оцінка',
        value: 'read_score',
    },
];

const SORT_EDITLIST: SortOption[] = [
    {
        label: 'Номер правки',
        value: 'edit_id',
    },
    {
        label: 'Дата створення',
        value: 'created',
    },
];

const SORT_ARTICLELIST: SortOption[] = [
    {
        label: 'Дата створення',
        value: 'created',
    },
    {
        label: 'Оцінка',
        value: 'vote_score',
    },
];

const SORT_TODO_CONTENT: SortOption[] = [
    {
        label: 'Назва українською',
        value: 'title_ua',
    },
    {
        label: 'Назва англійською',
        value: 'title_en',
    },
    {
        label: 'Оригінальна назва',
        value: 'title_original',
    },
    {
        label: 'Тип',
        value: 'media_type',
    },
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
];

const SORT_TODO_PERSON: SortOption[] = [
    {
        label: "Ім'я українською",
        value: 'name_ua',
    },
    {
        label: "Ім'я англійською",
        value: 'name_en',
    },
    {
        label: "Оригінальне ім'я",
        value: 'name_original',
    },
];

const SORT_CONFIGS: Record<SortType, SortConfig> = {
    anime: {
        options: SORT_CONTENT,
        defaultSort: 'score',
        defaultOrder: 'desc',
    },
    manga: {
        options: SORT_CONTENT,
        defaultSort: 'score',
        defaultOrder: 'desc',
    },
    novel: {
        options: SORT_CONTENT,
        defaultSort: 'score',
        defaultOrder: 'desc',
    },
    watch: {
        options: SORT_WATCHLIST,
        defaultSort: 'watch_score',
        defaultOrder: 'desc',
    },
    read: {
        options: SORT_READLIST,
        defaultSort: 'read_score',
        defaultOrder: 'desc',
    },
    edit: {
        options: SORT_EDITLIST,
        defaultSort: 'edit_id',
        defaultOrder: 'desc',
    },
    article: {
        options: SORT_ARTICLELIST,
        defaultSort: 'created',
        defaultOrder: 'desc',
    },
    comment: {
        options: COMMENT_SORT_OPTIONS,
        defaultSort: DEFAULT_COMMENT_SORT,
        defaultOrder: DEFAULT_COMMENT_ORDER,
    },
    todo_content: {
        options: SORT_TODO_CONTENT,
        defaultSort: 'title_ua',
        defaultOrder: 'asc',
    },
    todo_person: {
        options: SORT_TODO_PERSON,
        defaultSort: 'name_ua',
        defaultOrder: 'asc',
    },
};

export function getSort(sort_type: SortType): readonly SortOption[] {
    return SORT_CONFIGS[sort_type].options;
}

export function expandSort(
    sortType: SortType,
    sort?: string,
    order?: 'asc' | 'desc',
): string[] {
    const config = SORT_CONFIGS[sortType];
    const field = sort || config.defaultSort;
    const dir = order ?? config.defaultOrder;

    const option = config.options.find((o) => o.value === field);

    const expanded = option?.secondaryFields
        ? [field, ...option.secondaryFields]
        : [field];

    return formatSort(expanded, dir);
}

const ONGOINGS_SORT_FIELDS = [
    'score',
    'scored_by',
    'native_score',
    'native_scored_by',
] as const;

const ONGOINGS_SORT: string[] = ONGOINGS_SORT_FIELDS.map((f) => `${f}:desc`);

export function getOngoingsSort(): string[] {
    return ONGOINGS_SORT;
}
