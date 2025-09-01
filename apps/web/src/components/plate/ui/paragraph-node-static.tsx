import type { SlateElementProps } from 'platejs';
import { SlateElement } from 'platejs';

import { cn } from '@/utils/utils';

export function ParagraphElementStatic(props: SlateElementProps) {
    return (
        <SlateElement as="p" {...props} className={cn('mb-4')}>
            {props.children}
        </SlateElement>
    );
}
