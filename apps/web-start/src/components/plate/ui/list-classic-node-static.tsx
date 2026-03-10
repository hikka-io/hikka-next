import { type VariantProps, cva } from 'class-variance-authority';
import { SlateElement, SlateElementProps } from 'platejs/static';

const listVariants = cva('mb-4', {
    variants: {
        variant: {
            ul: 'ml-6 list-disc [&>li]:mt-2',
            ol: 'ml-6 list-decimal [&>li]:mt-2',
        },
    },
});

export function ListElementStatic({
    variant,
    ...props
}: SlateElementProps & VariantProps<typeof listVariants>) {
    return (
        <SlateElement
            as={variant!}
            className={listVariants({ variant })}
            {...props}
        >
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
        <SlateElement as="li" {...props} className="ps-2">
            {props.children}
        </SlateElement>
    );
}
