import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';

import type { TodoContentType } from '../hooks/use-todo-content-list';

// Each tab has its own filter set, so switching drops the rest of the search.
const CONTENT_TYPES: ChipTabOption<TodoContentType>[] = [
    {
        label: 'Аніме',
        value: ContentTypeEnum.ANIME,
        icon: MaterialSymbolsAnimatedImages,
        to: '/edit/content',
        search: { tab: ContentTypeEnum.ANIME },
    },
    {
        label: 'Манґа',
        value: ContentTypeEnum.MANGA,
        icon: MaterialSymbolsPalette,
        to: '/edit/content',
        search: { tab: ContentTypeEnum.MANGA },
    },
    {
        label: 'Ранобе',
        value: ContentTypeEnum.NOVEL,
        icon: MaterialSymbolsMenuBookRounded,
        to: '/edit/content',
        search: { tab: ContentTypeEnum.NOVEL },
    },
    {
        label: 'Персонажі',
        value: ContentTypeEnum.CHARACTER,
        icon: MaterialSymbolsFace3,
        to: '/edit/content',
        search: { tab: ContentTypeEnum.CHARACTER },
    },
    {
        label: 'Люди',
        value: ContentTypeEnum.PERSON,
        icon: MaterialSymbolsPerson,
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
