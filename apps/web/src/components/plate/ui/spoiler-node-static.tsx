import { SlateElement, type SlateElementProps } from 'platejs/static';

import SpoilerReveal from '@/components/markdown/spoiler-reveal';

export function SpoilerElementStatic(props: SlateElementProps) {
    return (
        <SlateElement {...props} className="spoiler w-full">
            <SpoilerReveal>{props.children}</SpoilerReveal>
        </SlateElement>
    );
}
