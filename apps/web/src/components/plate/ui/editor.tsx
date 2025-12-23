'use client';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { PlateContentProps } from 'platejs/react';
import { PlateContainer, PlateContent } from 'platejs/react';
import * as React from 'react';

import { cn } from '@/utils/cn';

const editorContainerVariants = cva(
    'relative isolate z-[1] w-full cursor-text caret-primary-foreground select-text selection:bg-primary-foreground/25 focus-visible:outline-none [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-primary-foreground/25 [&_.slate-selection-area]:bg-primary-foreground/15',
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            variant: {
                default: cn(
                    'flex flex-col justify-between gap-1 text-sm',
                    'rounded-lg border border-border bg-secondary/20',
                    'has-[[data-slate-editor]:focus]:border-primary-foreground/50 has-[[data-slate-editor]:focus]:ring-2 has-[[data-slate-editor]:focus]:ring-primary-foreground/30',
                    'has-aria-disabled:border-border has-aria-disabled:bg-muted',
                ),
                drawer: cn(
                    'grid flex-1 grid-rows-[auto_1fr_auto] overflow-hidden',
                ),
            },
        },
    },
);

export function EditorContainer({
    className,
    variant,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof editorContainerVariants>) {
    return (
        <PlateContainer
            className={cn(
                'ignore-click-outside/toolbar',
                editorContainerVariants({ variant }),
                className,
            )}
            {...props}
        />
    );
}

const editorVariants = cva(
    cn(
        'group/editor',
        'relative w-full cursor-text select-text overflow-x-hidden whitespace-pre-wrap break-words',
        'rounded-md ring-offset-background focus-visible:outline-none',
        '**:data-slate-placeholder:top-[auto_!important] **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100! placeholder:text-muted-foreground/80',
        '[&_strong]:font-bold',
    ),
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            disabled: {
                true: 'cursor-not-allowed opacity-50',
            },
            focused: {
                true: 'ring-2 ring-ring ring-offset-2',
            },
            variant: {
                default: 'flex-1 p-2 px-3 text-[0.9375rem]',
                comment: 'p-2 px-3 text-[0.9375rem] pb-14',
                drawer: 'p-2 px-3 text-[0.9375rem]',
            },
        },
    },
);

export type EditorProps = PlateContentProps &
    VariantProps<typeof editorVariants>;

export const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
    ({ className, disabled, focused, variant, ...props }, ref) => {
        return (
            <PlateContent
                ref={ref}
                className={cn(
                    editorVariants({
                        disabled,
                        focused,
                        variant,
                    }),
                    className,
                )}
                disabled={disabled}
                disableDefaultStyles
                {...props}
            />
        );
    },
);

Editor.displayName = 'Editor';
