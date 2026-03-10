'use client';

import {
    ComponentProps,
    ComponentPropsWithoutRef,
    FC,
    HTMLAttributeAnchorTarget,
    PropsWithChildren,
    ReactNode,
} from 'react';

import { cn } from '@/utils/cn';

import ContentCard from '../content-card/content-card';
import MDViewer from '../markdown/viewer/MD-viewer';
import { Label } from './label';
import Link from './link';

interface HorizontalCardTitleProps extends ComponentPropsWithoutRef<'div'> {
    className?: string;
    href: string;
    target?: HTMLAttributeAnchorTarget;
    titleMeta?: ReactNode;
}

const HorizontalCardTitle: FC<HorizontalCardTitleProps> = ({
    children,
    className,
    href,
    target,
    titleMeta,
}) => {
    return (
        <div className="flex min-w-0 items-center gap-2">
            <Label
                asChild
                className={cn('line-clamp-1 inline-block truncate', className)}
            >
                <Link title={children as string} href={href} target={target}>
                    {children}
                </Link>
            </Label>
            {titleMeta}
        </div>
    );
};

interface HorizontalCardDescriptionProps {
    className?: string;
}

const HorizontalCardDescription: FC<
    PropsWithChildren<HorizontalCardDescriptionProps>
> = ({ children, className }) => {
    if (typeof children === 'string') {
        return (
            <MDViewer
                className={cn(
                    'line-clamp-1 text-xs! text-muted-foreground',
                    className,
                )}
                preview
            >
                {children}
            </MDViewer>
        );
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 text-xs text-muted-foreground',
                className,
            )}
        >
            {children}
        </div>
    );
};

interface HorizontalCardContainerProps {
    className?: string;
}

const HorizontalCardContainer: FC<
    PropsWithChildren<HorizontalCardContainerProps>
> = ({ children, className }) => {
    return (
        <div className={cn('flex min-w-0 flex-1 flex-col gap-2', className)}>
            {children}
        </div>
    );
};

interface HorizontalCardImageProps {
    className?: string;
    imageClassName?: string;
    imageRatio?: number;
    image: string | ReactNode;
    href?: string;
}

const HorizontalCardImage: FC<PropsWithChildren<HorizontalCardImageProps>> = ({
    children,
    href,
    imageRatio,
    image,
    className,
    imageClassName,
}) => {
    return (
        <ContentCard
            className={cn('w-12', className)}
            containerClassName={cn(imageClassName, 'rounded-[var(--base-radius)]')}
            containerRatio={imageRatio}
            href={href}
            image={image}
        >
            {children}
        </ContentCard>
    );
};

interface Props extends ComponentProps<'div'> {}

const HorizontalCard: FC<Props> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn('flex items-center gap-4', className)}
            {...props}
        >
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
