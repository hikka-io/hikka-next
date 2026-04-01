import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { PlateStatic, type PlateStaticProps } from 'platejs/static';

import { cn } from '@/utils/cn';

export const editorVariants = cva(
    cn(
        'group/editor prose',
        'relative w-full cursor-text overflow-x-hidden wrap-break-word whitespace-pre-wrap select-text',
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
