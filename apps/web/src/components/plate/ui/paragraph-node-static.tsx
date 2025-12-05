import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';

import { P_CLASSNAME } from '@/components/typography/p';

import { cn } from '@/utils/utils';

export function ParagraphElementStatic(props: SlateElementProps) {
    return (
        <SlateElement as="p" {...props} className={cn('mb-4', P_CLASSNAME)}>
            {props.children}
        </SlateElement>
    );
}
