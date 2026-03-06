import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';

export function ParagraphElementStatic(props: SlateElementProps) {
    return (
        <SlateElement as="p" {...props} className="mb-4">
            {props.children}
        </SlateElement>
    );
}
