import { SlateElement, type SlateElementProps } from 'platejs/static';

import { BLOCKQUOTE_CLASSNAME } from '@/components/typography/blockquote';

import { cn } from '@/utils/cn';

export function BlockquoteElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            as="blockquote"
            className={cn(BLOCKQUOTE_CLASSNAME, 'mb-4')}
            {...props}
        />
    );
}
