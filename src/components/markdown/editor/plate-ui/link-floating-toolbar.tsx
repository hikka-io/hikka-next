'use client';

import { cn } from '@udecode/cn';
import { useFormInputProps } from '@udecode/plate-common/react';
import {
    type UseVirtualFloatingOptions,
    flip,
    offset,
} from '@udecode/plate-floating';
import {
    FloatingLinkUrlInput,
    type LinkFloatingToolbarState,
    LinkOpenButton,
    useFloatingLinkEdit,
    useFloatingLinkEditState,
    useFloatingLinkInsert,
    useFloatingLinkInsertState,
} from '@udecode/plate-link/react';
import MaterialSymbolsLinkOffRounded from '~icons/material-symbols/link-off-rounded';
import MaterialSymbolsLinkRounded from '~icons/material-symbols/link-rounded';
import MaterialSymbolsOpenInNewRounded from '~icons/material-symbols/open-in-new-rounded';
import MaterialSymbolsShortTextRounded from '~icons/material-symbols/short-text-rounded';

import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const floatingOptions: UseVirtualFloatingOptions = {
    middleware: [
        offset(12),
        flip({
            fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
            padding: 12,
        }),
    ],
    placement: 'bottom-start',
};

export interface LinkFloatingToolbarProps {
    state?: LinkFloatingToolbarState;
}

export function LinkFloatingToolbar({ state }: LinkFloatingToolbarProps) {
    const insertState = useFloatingLinkInsertState({
        ...state,
        floatingOptions: {
            ...floatingOptions,
            ...state?.floatingOptions,
        },
    });
    const {
        hidden,
        props: insertProps,
        ref: insertRef,
        textInputProps,
    } = useFloatingLinkInsert(insertState);

    const editState = useFloatingLinkEditState({
        ...state,
        floatingOptions: {
            ...floatingOptions,
            ...state?.floatingOptions,
        },
    });
    const {
        editButtonProps,
        props: editProps,
        ref: editRef,
        unlinkButtonProps,
    } = useFloatingLinkEdit(editState);
    const inputProps = useFormInputProps({
        preventDefaultOnEnterKeydown: true,
    });

    if (hidden) return null;

    const input = (
        <div className="flex w-auto flex-col sm:w-[330px]">
            <div className="flex items-center gap-2 px-2">
                <div className="flex items-center text-muted-foreground">
                    <MaterialSymbolsLinkRounded />
                </div>

                <FloatingLinkUrlInput
                    asChild
                    className="h-9 flex-1 rounded-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Посилання"
                >
                    <Input />
                </FloatingLinkUrlInput>
            </div>

            <Separator />

            <div className="flex items-center gap-2 px-2">
                <div className="flex items-center text-muted-foreground">
                    <MaterialSymbolsShortTextRounded />
                </div>
                <Input
                    className="h-9 flex-1 rounded-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Текст відображення"
                    {...textInputProps}
                />
            </div>
        </div>
    );

    const editContent = editState.isEditing ? (
        input
    ) : (
        <div className="box-content flex items-center">
            <button
                className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                type="button"
                {...editButtonProps}
            >
                Редагувати
            </button>

            <Separator orientation="vertical" />

            <LinkOpenButton
                className={buttonVariants({
                    size: 'icon-sm',
                    variant: 'ghost',
                })}
            >
                <MaterialSymbolsOpenInNewRounded />
            </LinkOpenButton>

            <Separator orientation="vertical" />

            <button
                className={buttonVariants({
                    size: 'icon-sm',
                    variant: 'ghost',
                })}
                type="button"
                {...unlinkButtonProps}
            >
                <MaterialSymbolsLinkOffRounded />
            </button>
        </div>
    );

    return (
        <>
            <div
                ref={insertRef}
                className={cn(
                    'w-auto rounded-md border border-secondary/60 bg-secondary/30 p-1 backdrop-blur',
                )}
                {...insertProps}
            >
                {input}
            </div>

            <div
                ref={editRef}
                className={cn(
                    'w-auto rounded-md border border-secondary/60 bg-secondary/30 p-1 backdrop-blur',
                )}
                {...editProps}
            >
                {editContent}
            </div>
        </>
    );
}
