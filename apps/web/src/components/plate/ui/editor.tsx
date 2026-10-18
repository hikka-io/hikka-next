import * as React from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { PlateContentProps } from 'platejs/react';
import { PlateContainer, PlateContent } from 'platejs/react';

import { cn } from '@/utils/cn';

const editorContainerVariants = cva(
    'relative isolate z-1 w-full caret-primary-foreground select-text selection:bg-primary-foreground/25 focus-visible:outline-hidden [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-primary-foreground/25 [&_.slate-selection-area]:bg-primary-foreground/15',
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            variant: {
                default: cn(
                    'flex flex-col justify-between gap-1 text-sm',
                    'rounded-lg border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30',
                    'has-[[data-slate-editor]:focus-within]:border-ring has-[[data-slate-editor]:focus-within]:ring-[3px] has-[[data-slate-editor]:focus-within]:ring-ring/50',
                    // Scoped to the editor: Base UI marks a disabled toolbar
                    // button with `aria-disabled` rather than `disabled`.
                    'has-[[data-slate-editor][aria-disabled=true]]:opacity-50',
                ),
                drawer: cn('flex flex-1 flex-col overflow-hidden'),
                inline: 'flex flex-col gap-3',
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

const boxedEditor = 'overflow-x-hidden rounded-md ring-offset-background';

const editorVariants = cva(
    cn(
        'group/editor prose',
        'wrap-break-word relative w-full cursor-text select-text whitespace-pre-wrap focus-visible:outline-hidden',
        'placeholder:text-muted-foreground/80 **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!',
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
                default: cn(boxedEditor, 'flex-1 p-4 text-[0.9375rem]'),
                comment: cn(boxedEditor, 'p-4 text-[0.9375rem]'),
                drawer: cn(
                    boxedEditor,
                    'flex-1 overflow-y-auto p-4 text-[0.9375rem]',
                ),
                inline: 'min-h-80 text-[0.9375rem]',
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
