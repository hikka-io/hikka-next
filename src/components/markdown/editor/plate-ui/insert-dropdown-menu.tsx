'use client';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import {
    ParagraphPlugin,
    type PlateEditor,
    focusEditor,
    useEditorRef,
} from '@udecode/plate-common/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
    EyeOff,
    Link2Icon,
    PilcrowIcon,
    PlusIcon,
    QuoteIcon,
} from 'lucide-react';
import React, { Fragment } from 'react';

import { SpoilerPlugin } from '@/components/markdown/editor/plugins/spoiler-plugin/spoiler-plugin';
import {
    insertBlock,
    insertInlineElement,
} from '@/components/markdown/editor/transforms';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    useOpenState,
} from '@/components/ui/dropdown-menu';

import { ToolbarButton } from './toolbar';

type Group = {
    group: string;
    items: Item[];
};

interface Item {
    icon: React.ReactNode;
    onSelect: (editor: PlateEditor, value: string) => void;
    value: string;
    focusEditor?: boolean;
    label?: string;
}

const groups: Group[] = [
    {
        group: 'Базові блоки',
        items: [
            {
                icon: <PilcrowIcon className="mr-2 size-4" />,
                label: 'Текст',
                value: ParagraphPlugin.key,
            },
            {
                icon: <QuoteIcon className="mr-2 size-4" />,
                label: 'Цитата',
                value: BlockquotePlugin.key,
            },
            {
                icon: <EyeOff className="mr-2 size-4" />,
                label: 'Спойлер',
                value: SpoilerPlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },

    {
        group: 'Вбудовані',
        items: [
            {
                icon: <Link2Icon className="mr-2 size-4" />,
                label: 'Посилання',
                value: LinkPlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertInlineElement(editor, value);
            },
        })),
    },
];

export function InsertDropdownMenu(props: DropdownMenuProps) {
    const editor = useEditorRef();
    const openState = useOpenState();

    return (
        <DropdownMenu modal={false} {...openState} {...props}>
            <DropdownMenuTrigger asChild>
                <ToolbarButton
                    pressed={openState.open}
                    tooltip="Вставити"
                    isDropdown
                >
                    <PlusIcon />
                </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
                align="start"
            >
                {groups.map(({ group, items: nestedItems }, index) => (
                    <Fragment key={group}>
                        {index !== 0 && <DropdownMenuSeparator />}
                        <DropdownMenuGroup key={group}>
                            <DropdownMenuLabel>{group}</DropdownMenuLabel>
                            {nestedItems.map(
                                ({ icon, label, value, onSelect }) => (
                                    <DropdownMenuItem
                                        key={value}
                                        className="min-w-[180px]"
                                        onSelect={() => {
                                            onSelect(editor, value);
                                            focusEditor(editor);
                                        }}
                                    >
                                        {icon}
                                        {label}
                                    </DropdownMenuItem>
                                ),
                            )}
                        </DropdownMenuGroup>
                    </Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
