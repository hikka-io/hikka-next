'use client';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import {
    EyeOffIcon,
    Heading3Icon,
    Link2Icon,
    ListIcon,
    ListOrderedIcon,
    PilcrowIcon,
    PlusIcon,
    QuoteIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { type PlateEditor, useEditorRef } from 'platejs/react';
import * as React from 'react';

import {
    insertBlock,
    insertInlineElement,
} from '@/components/plate/editor/transforms';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ELEMENT_SPOILER } from '../editor/plugins/spoiler-kit';
import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

type Group = {
    group: string;
    items: Item[];
};

interface Item {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: PlateEditor, value: string) => void;
    focusEditor?: boolean;
    label?: string;
}

const COMMENT_GROUPS: Group[] = [
    {
        group: 'Базові блоки',
        items: [
            {
                icon: <PilcrowIcon />,
                label: 'Параграф',
                value: KEYS.p,
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

    {
        group: 'Вбудовані елементи',
        items: [
            {
                icon: <Link2Icon />,
                label: 'Посилання',
                value: KEYS.link,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertInlineElement(editor, value);
            },
        })),
    },
];

const ARTICLE_GROUPS: Group[] = [
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

    {
        group: 'Вбудовані елементи',
        items: [
            {
                icon: <Link2Icon />,
                label: 'Посилання',
                value: KEYS.link,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertInlineElement(editor, value);
            },
        })),
    },
];

export function InsertToolbarButton(
    props: DropdownMenuProps & {
        type: 'comment' | 'article';
    },
) {
    const editor = useEditorRef();
    const [open, setOpen] = React.useState(false);

    const groups = props.type === 'comment' ? COMMENT_GROUPS : ARTICLE_GROUPS;

    return (
        <DropdownMenu
            open={open}
            onOpenChange={setOpen}
            modal={false}
            {...props}
        >
            <DropdownMenuTrigger asChild>
                <ToolbarButton pressed={open} tooltip="Вставити" isDropdown>
                    <PlusIcon />
                </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
                align="start"
            >
                {groups.map(({ group, items: nestedItems }) => (
                    <ToolbarMenuGroup key={group} label={group}>
                        {nestedItems.map(({ icon, label, value, onSelect }) => (
                            <DropdownMenuItem
                                key={value}
                                className="min-w-[180px]"
                                onSelect={() => {
                                    onSelect(editor, value);
                                    editor.tf.focus();
                                }}
                            >
                                {icon}
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </ToolbarMenuGroup>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
