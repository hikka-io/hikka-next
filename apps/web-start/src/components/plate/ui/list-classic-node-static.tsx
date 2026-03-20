import { SlateElement, SlateElementProps } from 'platejs/static';

export function ListElementStatic({
    variant,
    ...props
}: SlateElementProps & { variant?: 'ul' | 'ol' }) {
    return (
        <SlateElement as={variant!} {...props}>
            {props.children}
        </SlateElement>
    );
}

export function BulletedListElementStatic(props: SlateElementProps) {
    return <ListElementStatic variant="ul" {...props} />;
}

export function NumberedListElementStatic(props: SlateElementProps) {
    return <ListElementStatic variant="ol" {...props} />;
}

export function ListItemElementStatic(props: SlateElementProps) {
    return <BaseListItemElementStatic {...props} />;
}

export function BaseListItemElementStatic(props: SlateElementProps) {
    return (
        <SlateElement as="li" {...props}>
            {props.children}
        </SlateElement>
    );
}
