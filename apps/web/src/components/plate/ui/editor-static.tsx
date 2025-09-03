import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { PlateStatic, type PlateStaticProps } from 'platejs';

import { cn } from '@/utils/utils';

export const editorVariants = cva(
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
                default: 'text-[0.9375rem]',
            },
        },
    },
);

export function EditorStatic({
    className,
    variant,
    ...props
}: PlateStaticProps & VariantProps<typeof editorVariants>) {
    return (
        <PlateStatic
            className={cn(editorVariants({ variant }), className)}
            {...props}
        />
    );
}
