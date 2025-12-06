import { getLinkAttributes } from '@platejs/link';
import type { TLinkElement } from 'platejs';
import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';

import Link from '@/components/typography/link';

export function LinkElementStatic(props: SlateElementProps<TLinkElement>) {
    return (
        <SlateElement
            {...props}
            as={Link as any}
            attributes={{
                ...props.attributes,
                ...getLinkAttributes(props.editor, props.element),
            }}
        >
            {props.children}
        </SlateElement>
    );
}
