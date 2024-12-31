'use client';

import {
    type WithRequiredKey,
    isSelectionExpanded,
} from '@udecode/plate-common';
import {
    useEditorSelector,
    useElement,
    useRemoveNodeButton,
} from '@udecode/plate-common/react';
import {
    FloatingMedia as FloatingMediaPrimitive,
    floatingMediaActions,
    useFloatingMediaSelectors,
} from '@udecode/plate-media/react';
import { Link, Trash2Icon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useReadOnly, useSelected } from 'slate-react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { CaptionButton } from './caption';

export interface MediaPopoverProps {
    children: React.ReactNode;
    plugin: WithRequiredKey;
}

export function MediaPopover({ children, plugin }: MediaPopoverProps) {
    const readOnly = useReadOnly();
    const selected = useSelected();

    const selectionCollapsed = useEditorSelector(
        (editor) => !isSelectionExpanded(editor),
        [],
    );
    const isOpen = !readOnly && selected && selectionCollapsed;
    const isEditing = useFloatingMediaSelectors().isEditing();

    useEffect(() => {
        if (!isOpen && isEditing) {
            floatingMediaActions.isEditing(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const element = useElement();
    const { props: buttonProps } = useRemoveNodeButton({ element });

    if (readOnly) return <>{children}</>;

    return (
        <Popover open={isOpen} modal={false}>
            <PopoverAnchor>{children}</PopoverAnchor>

            <PopoverContent
                className="w-auto p-1"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                {isEditing ? (
                    <div className="flex w-[330px] flex-col">
                        <div className="flex items-center">
                            <div className="flex items-center pl-2 pr-1 text-muted-foreground">
                                <Link className="size-4" />
                            </div>

                            <FloatingMediaPrimitive.UrlInput
                                className={
                                    'h-9 flex-1 rounded-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                }
                                placeholder="Paste the embed link..."
                                options={{ plugin }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="box-content flex items-center">
                        <FloatingMediaPrimitive.EditButton
                            className={buttonVariants({
                                size: 'sm',
                                variant: 'ghost',
                            })}
                        >
                            Edit link
                        </FloatingMediaPrimitive.EditButton>

                        <CaptionButton variant="ghost">Caption</CaptionButton>

                        <Separator
                            orientation="vertical"
                            className="mx-1 h-6"
                        />

                        <Button size="icon" variant="ghost" {...buttonProps}>
                            <Trash2Icon />
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
