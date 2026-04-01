import { SlateElement, type SlateElementProps } from 'platejs/static';

export function BlockquoteElementStatic(props: SlateElementProps) {
    return <SlateElement as="blockquote" {...props} />;
}
