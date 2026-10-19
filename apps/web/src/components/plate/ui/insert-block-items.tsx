import type * as React from 'react';

import {
    EyeOffIcon,
    FilmIcon,
    Heading3Icon,
    ImageIcon,
    ListIcon,
    ListOrderedIcon,
    PilcrowIcon,
    QuoteIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { type PlateEditor, useEditorSelector } from 'platejs/react';

import { ELEMENT_SPOILER } from '../editor/plate-types';
import { insertBlock, isInsideBlock } from '../editor/transforms';
import { openImagePicker } from './image-group-add-image';
import { getVideoDialog } from './video-dialog';

// Cannot be nested inside themselves
const NO_NEST_TYPES: Set<string> = new Set([ELEMENT_SPOILER, KEYS.blockquote]);

export type InsertGroup = {
    group: string;
    items: InsertItem[];
};

export type InsertItem = {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: PlateEditor, value: string) => void;
    label?: string;
};

export const ARTICLE_INSERT_GROUPS: InsertGroup[] = [
    {
        group: 'Базові блоки',
        items: [
            {
                icon: <PilcrowIcon />,
                label: 'Параграф',
                value: KEYS.p,
            },
            {
                icon: <Heading3Icon />,
                label: 'Заголовок 3',
                value: 'h3',
            },
            {
                icon: <QuoteIcon />,
                label: 'Цитата',
                value: KEYS.blockquote,
            },
            {
                icon: <EyeOffIcon />,
                label: 'Спойлер',
                value: ELEMENT_SPOILER,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
    {
        group: 'Списки',
        items: [
            {
                icon: <ListIcon />,
                label: 'Непозначений список',
                value: KEYS.ulClassic,
            },
            {
                icon: <ListOrderedIcon />,
                label: 'Нумерований список',
                value: KEYS.olClassic,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
];

export function useDisabledInsertTypes() {
    return useEditorSelector((editor) => {
        const disabled = new Set<string>();

        for (const type of NO_NEST_TYPES) {
            if (isInsideBlock(editor, type)) {
                disabled.add(type);
            }
        }

        return disabled;
    }, []);
}

const MEDIA_GROUP: InsertGroup = {
    group: 'Медіа',
    items: [
        {
            icon: <ImageIcon />,
            label: 'Зображення',
            value: 'image',
            onSelect: (editor) => openImagePicker(editor),
        },
        {
            icon: <FilmIcon />,
            label: 'Відео з YouTube',
            value: 'video',
            onSelect: (editor) => getVideoDialog(editor)?.(),
        },
    ],
};

/** Everything the `/` and "+" menus offer; the touch toolbar has its own media buttons. */
export const BLOCK_MENU_GROUPS = [...ARTICLE_INSERT_GROUPS, MEDIA_GROUP];
