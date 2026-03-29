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
import {
    type PlateEditor,
    useEditorRef,
    useEditorSelector,
} from 'platejs/react';
import * as React from 'react';

import {
    insertBlock,
    insertInlineElement,
    isInsideBlock,
} from '@/components/plate/editor/transforms';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ELEMENT_SPOILER } from '../editor/plugins/spoiler-kit';
import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

/** Container types that cannot be nested inside themselves */
const NO_NEST_TYPES: Set<string> = new Set([ELEMENT_SPOILER, KEYS.blockquote]);

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

    const disabledTypes = useEditorSelector((editor) => {
        const disabled = new Set<string>();

        for (const type of NO_NEST_TYPES) {
            if (isInsideBlock(editor, type)) {
                disabled.add(type);
            }
        }

        return disabled;
    }, []);

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
                className="flex min-w-0 flex-col overflow-y-auto"
                align="start"
            >
                {groups.map(({ group, items: nestedItems }) => (
                    <ToolbarMenuGroup key={group} label={group}>
                        {nestedItems.map(({ icon, label, value, onSelect }) => {
                            const disabled = disabledTypes.has(value);

                            return (
                                <DropdownMenuItem
                                    key={value}
                                    className="min-w-45"
                                    disabled={disabled}
                                    onSelect={() => {
                                        onSelect(editor, value);
                                        editor.tf.focus();
                                    }}
                                >
                                    {icon}
                                    {label}
                                </DropdownMenuItem>
                            );
                        })}
                    </ToolbarMenuGroup>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
