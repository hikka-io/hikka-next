import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';

import type { TodoContentType } from '../hooks/use-todo-content-list';

// Each tab has its own filter set, so switching drops the rest of the search.
const CONTENT_TYPES: ChipTabOption<TodoContentType>[] = [
    {
        label: 'Аніме',
        value: ContentTypeEnum.ANIME,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.ANIME],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.ANIME },
    },
    {
        label: 'Манґа',
        value: ContentTypeEnum.MANGA,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.MANGA],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.MANGA },
    },
    {
        label: 'Ранобе',
        value: ContentTypeEnum.NOVEL,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.NOVEL],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.NOVEL },
    },
    {
        label: 'Персонажі',
        value: ContentTypeEnum.CHARACTER,
        icon: CONTENT_TYPE_ICONS[ContentTypeEnum.CHARACTER],
        to: '/edit/content',
        search: { tab: ContentTypeEnum.CHARACTER },
    },
    {
        label: 'Люди',
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
    <ChipTabs value={value} className={className} options={CONTENT_TYPES} />
);

export default TodoContentTabs;
