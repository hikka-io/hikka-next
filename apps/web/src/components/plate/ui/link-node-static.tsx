import { getLinkAttributes } from '@platejs/link';
import type { SlateElementProps, TLinkElement } from 'platejs';
import { SlateElement } from 'platejs';

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
