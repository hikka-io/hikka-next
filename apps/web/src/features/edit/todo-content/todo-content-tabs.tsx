import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import { CONTENT_TYPES } from '@/utils/labels';

import type { TodoContentType } from '../hooks/use-todo-content-list';

// Each tab has its own filter set, so switching drops the rest of the search.
const TAB_OPTIONS: ChipTabOption<TodoContentType>[] = [
    {
        label: CONTENT_TYPES[ContentTypeEnum.ANIME].plural,
        value: ContentTypeEnum.ANIME,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.ANIME],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.ANIME },
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.MANGA].plural,
        value: ContentTypeEnum.MANGA,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.MANGA],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.MANGA },
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.NOVEL].plural,
        value: ContentTypeEnum.NOVEL,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.NOVEL],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.NOVEL },
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.CHARACTER].plural,
        value: ContentTypeEnum.CHARACTER,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.CHARACTER],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.CHARACTER },
    },
    {
        label: CONTENT_TYPES[ContentTypeEnum.PERSON].plural,
        value: ContentTypeEnum.PERSON,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.PERSON],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.PERSON },
    },
];

type Props = {
    value: TodoContentType;
    className?: string;
};

const TodoContentTabs: FC<Props> = ({ value, className }) => (
    <ChipTabs value={value} className={className} options={TAB_OPTIONS} />
);

export default TodoContentTabs;
