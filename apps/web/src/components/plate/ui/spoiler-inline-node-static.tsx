import { SlateElement, type SlateElementProps } from 'platejs/static';

import SpoilerInline from '@/components/markdown/spoiler-inline';

export function SpoilerInlineElementStatic(props: SlateElementProps) {
    return (
        <SlateElement {...props} as="span" className="spoiler-inline">
            <SpoilerInline>{props.children}</SpoilerInline>
        </SlateElement>
    );
}
