'use client';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import {
    ParagraphPlugin,
    focusEditor,
    useEditorRef,
    useSelectionFragmentProp,
} from '@udecode/plate-common/react';
import { EyeOff, PilcrowIcon, QuoteIcon } from 'lucide-react';
import React from 'react';

import { SpoilerPlugin } from '@/components/markdown/editor/plugins/spoiler-plugin/spoiler-plugin';
import {
    getBlockType,
    setBlockType,
} from '@/components/markdown/editor/transforms';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
    useOpenState,
} from '@/components/ui/dropdown-menu';
import { PopoverPortal } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectProps,
    SelectTrigger,
} from '@/components/ui/select';

import { ToolbarButton } from './toolbar';

const turnIntoItems = [
    {
        icon: <PilcrowIcon className="size-4" />,
        keywords: ['paragraph'],
        label: 'Текст',
        value: ParagraphPlugin.key,
    },

    {
        icon: <QuoteIcon className="size-4" />,
        keywords: ['citation', 'blockquote', '>'],
        label: 'Цитата',
        value: BlockquotePlugin.key,
    },

    {
        icon: <EyeOff className="size-4" />,
        keywords: ['spoiler'],
        label: 'Спойлер',
        value: SpoilerPlugin.key,
    },
];

export function TurnIntoDropdownMenu(props: SelectProps) {
    const editor = useEditorRef();
    const openState = useOpenState();

    const value = useSelectionFragmentProp({
        defaultValue: ParagraphPlugin.key,
        getProp: (node) => getBlockType(node as any),
    });
    const selectedItem = React.useMemo(
        () =>
            turnIntoItems.find(
                (item) => item.value === (value ?? ParagraphPlugin.key),
            ) ?? turnIntoItems[0],
        [value],
    );

    return (
        <Select
            {...openState}
            {...props}
            value={value ? [value] : []}
            onValueChange={(type) => {
                setBlockType(editor, type[0]);
                focusEditor(editor);
            }}
        >
            <SelectTrigger asChild>
                <ToolbarButton
                    pressed={openState.open}
                    tooltip="Перетворити на"
                    isDropdown
                >
                    {selectedItem.label}
                </ToolbarButton>
            </SelectTrigger>
            <PopoverPortal>
                <SelectContent>
                    <SelectList>
                        <SelectGroup>
                            {turnIntoItems.map(
                                ({ icon, label, value: itemValue }) => (
                                    <SelectItem
                                        key={itemValue}
                                        value={itemValue}
                                    >
                                        <div className="flex items-center gap-2">
                                            {icon}
                                            <span>{label}</span>
                                        </div>
                                    </SelectItem>
                                ),
                            )}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </PopoverPortal>
        </Select>
    );

    return (
        <DropdownMenu modal={false} {...openState} {...props}>
            <DropdownMenuTrigger asChild></DropdownMenuTrigger>

            <DropdownMenuContent
                className="ignore-click-outside/toolbar min-w-0"
                align="start"
            >
                <DropdownMenuRadioGroup
                    value={value}
                    onValueChange={(type) => {
                        setBlockType(editor, type);
                        focusEditor(editor);
                    }}
                >
                    {turnIntoItems.map(({ icon, label, value: itemValue }) => (
                        <DropdownMenuRadioItem
                            key={itemValue}
                            className="min-w-[180px]"
                            value={itemValue}
                        >
                            {icon}
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
