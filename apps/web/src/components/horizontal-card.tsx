import type {
    ComponentProps,
    ComponentPropsWithoutRef,
    FC,
    HTMLAttributeAnchorTarget,
    HTMLAttributeReferrerPolicy,
    PropsWithChildren,
    ReactNode,
} from 'react';

import PosterCard from '@/components/content-card/poster-card';
import { labelVariants } from '@/components/ui/label';
import TextLink from '@/components/ui/text-link';
import { cn } from '@/utils/cn';

type HorizontalCardTitleProps = ComponentPropsWithoutRef<'div'> & {
    className?: string;
    href?: string;
    to?: string;
    target?: HTMLAttributeAnchorTarget;
    referrerPolicy?: HTMLAttributeReferrerPolicy;
    titleMeta?: ReactNode;
};

const HorizontalCardTitle: FC<HorizontalCardTitleProps> = ({
    children,
    className,
    href,
    to,
    target,
    referrerPolicy,
    titleMeta,
}) => {
    return (
        <div className="flex min-w-0 items-center justify-between gap-2">
            <TextLink
                title={children as string}
                href={to ?? href}
                target={target}
                referrerPolicy={referrerPolicy}
                className={cn(
                    labelVariants(),
                    'line-clamp-1 inline-block min-w-0 flex-1 truncate',
                    className,
                )}
            >
                {children}
            </TextLink>
            {titleMeta}
        </div>
    );
};

type HorizontalCardDescriptionProps = {
    className?: string;
};

const HorizontalCardDescription: FC<
    PropsWithChildren<HorizontalCardDescriptionProps>
> = ({ children, className }) => {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 text-muted-foreground text-xs',
                className,
            )}
        >
            {children}
        </div>
    );
};

type HorizontalCardContainerProps = {
    className?: string;
};

const HorizontalCardContainer: FC<
    PropsWithChildren<HorizontalCardContainerProps>
> = ({ children, className }) => {
    return (
        <div className={cn('flex min-w-0 flex-1 flex-col gap-2', className)}>
            {children}
        </div>
    );
};

type HorizontalCardImageProps = {
    className?: string;
    imageClassName?: string;
    imageRatio?: number;
    image: string | ReactNode;
    href?: string;
    to?: string;
    imageBlur?: boolean;
    referrerPolicy?: HTMLAttributeReferrerPolicy;
};

const HorizontalCardImage: FC<PropsWithChildren<HorizontalCardImageProps>> = ({
    children,
    href,
    to,
    imageRatio,
    image,
    className,
    imageClassName,
    imageBlur,
    referrerPolicy,
}) => {
    return (
        <PosterCard
            className={cn('w-12', className)}
            containerClassName={cn(
                imageClassName,
                (!imageRatio || imageRatio !== 1) && 'rounded-(--base-radius)',
            )}
            containerRatio={imageRatio}
            imagePreset="cardXs"
            href={to ?? href}
            image={image}
            imageBlur={imageBlur}
            linkProps={referrerPolicy ? { referrerPolicy } : undefined}
        >
            {children}
        </PosterCard>
    );
};

type Props = ComponentProps<'div'>;

const HorizontalCard: FC<Props> = ({ className, children, ...props }) => {
    return (
        <div className={cn('flex items-center gap-4', className)} {...props}>
            {children}
        </div>
    );
};

export {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
};
