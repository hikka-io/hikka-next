'use client';

import { cn } from '@udecode/cn';
import type { PlateContentProps } from '@udecode/plate/react';
import {
    PlateContent,
    useEditorContainerRef,
    useEditorRef,
} from '@udecode/plate/react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import React from 'react';

const editorContainerVariants = cva(
    'relative w-full cursor-text caret-primary selection:bg-brand/25 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15',
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            variant: {
                default: '',
            },
        },
    },
);

export const EditorContainer = ({
    className,
    variant,
    ...props
}: React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof editorContainerVariants>) => {
    const editor = useEditorRef();
    const containerRef = useEditorContainerRef();

    return (
        <div
            id={editor.uid}
            ref={containerRef}
            className={cn(
                'ignore-click-outside/toolbar isolate',
                editorContainerVariants({ variant }),
                className,
            )}
            role="button"
            {...props}
        />
    );
};

EditorContainer.displayName = 'EditorContainer';

const editorVariants = cva(
    cn(
        'group/editor',
        'relative w-full overflow-x-hidden whitespace-pre-wrap break-words',
        'rounded-md ring-offset-background placeholder:text-muted-foreground/80 focus-visible:outline-none',
        '[&_[data-slate-placeholder]]:text-muted-foreground/80 [&_[data-slate-placeholder]]:!opacity-100',
        '[&_[data-slate-placeholder]]:top-[auto_!important]',
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
                default: 'w-full text-[0.9375rem] p-2',
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
