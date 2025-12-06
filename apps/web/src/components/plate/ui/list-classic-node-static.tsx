import { type VariantProps, cva } from 'class-variance-authority';
import { SlateElement, SlateElementProps } from 'platejs/static';

import { OL_CLASSNAME } from '@/components/typography/ol';
import { UL_CLASSNAME } from '@/components/typography/ul';

import { cn } from '@/utils/utils';

const listVariants = cva('mb-4', {
    variants: {
        variant: {
            ol: OL_CLASSNAME,
            ul: UL_CLASSNAME,
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
        <SlateElement as="li" {...props} className={cn('ps-2')}>
            {props.children}
        </SlateElement>
    );
}
