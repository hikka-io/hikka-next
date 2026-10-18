import * as React from 'react';

import type { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { PlusIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    ARTICLE_INSERT_GROUPS,
    useDisabledInsertTypes,
} from './insert-block-items';
import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

export function InsertToolbarButton(props: MenuPrimitive.Root.Props) {
    const editor = useEditorRef();
    const [open, setOpen] = React.useState(false);

    const disabledTypes = useDisabledInsertTypes();

    return (
        <DropdownMenu
            open={open}
            onOpenChange={setOpen}
            modal={false}
            {...props}
        >
            <DropdownMenuTrigger
                render={
                    <ToolbarButton
                        pressed={open}
                        tooltip="Вставити"
                        isDropdown
                    />
                }
            >
                <PlusIcon />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="start">
                {ARTICLE_INSERT_GROUPS.map(({ group, items: nestedItems }) => (
                    <ToolbarMenuGroup key={group} label={group}>
                        {nestedItems.map(({ icon, label, value, onSelect }) => {
                            const disabled = disabledTypes.has(value);

                            return (
                                <DropdownMenuItem
                                    key={value}
                                    disabled={disabled}
                                    onClick={() => {
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
