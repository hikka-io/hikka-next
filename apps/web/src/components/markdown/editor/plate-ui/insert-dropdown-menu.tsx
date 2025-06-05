'use client';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
    ParagraphPlugin,
    type PlateEditor,
    useEditorRef,
} from '@udecode/plate/react';
import {
    EyeOff,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Link2Icon,
    PilcrowIcon,
    PlusIcon,
    QuoteIcon,
} from 'lucide-react';
import React, { Fragment } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    useOpenState,
} from '../../../ui/dropdown-menu';
import { SpoilerPlugin } from '../plugins/spoiler-plugin/spoiler-plugin';
import { insertBlock, insertInlineElement } from '../transforms';
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

const HEADING_GROUP: Group = {
    group: 'Заголовки',
    items: [
        {
            icon: <Heading3Icon className="mr-2 size-4" />,
            label: 'Заголовок 3',
            value: HEADING_KEYS.h3,
        },
        {
            icon: <Heading4Icon className="mr-2 size-4" />,
            label: 'Заголовок 4',
            value: HEADING_KEYS.h4,
        },
        {
            icon: <Heading5Icon className="mr-2 size-4" />,
            label: 'Заголовок 5',
            value: HEADING_KEYS.h5,
        },
    ].map((item) => ({
        ...item,
        onSelect: (editor, value) => {
            insertBlock(editor, value);
        },
    })),
};

const BASIC_GROUP: Group = {
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
};

const INLINE_GROUP: Group = {
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
};

const BASIC_GROUPS: Group[] = [BASIC_GROUP, INLINE_GROUP];

const ADVANCED_GROUPS: Group[] = [BASIC_GROUP, HEADING_GROUP, INLINE_GROUP];

type InsertType = 'basic' | 'advanced';

const GROUPS: Record<InsertType, Group[]> = {
    basic: BASIC_GROUPS,
    advanced: ADVANCED_GROUPS,
};

interface InsertDropdownMenuProps extends DropdownMenuProps {
    type: InsertType;
}

export function InsertDropdownMenu({
    type,
    ...props
}: InsertDropdownMenuProps) {
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
                {GROUPS[type].map(({ group, items: nestedItems }, index) => (
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
                                            editor.tf.focus();
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
