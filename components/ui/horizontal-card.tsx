import { formatDistance } from 'date-fns';
import Link from 'next/link';
import React, { ComponentProps, FC, ReactNode } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';

import parseTextFromMarkDown from '@/utils/parseTextFromMarkDown';
import { cn } from '@/utils/utils';

interface Props extends ComponentProps<'div'> {
    title: string;
    titleMeta?: ReactNode;
    titleClassName?: string;
    href: string;
    description?: string | ReactNode;
    descriptionClassName?: string;
    descriptionHref?: string;
    createdAt?: number;
    meta?: ReactNode;
    image?: string | ReactNode;
    imageClassName?: string;
    imageRatio?: number;
}

const HorizontalCard: FC<Props> = ({
    title,
    titleMeta,
    titleClassName,
    href,
    description,
    descriptionHref,
    descriptionClassName,
    createdAt,
    meta,
    image,
    imageClassName,
    imageRatio,
    className,
    children,
    ...props
}) => {
    return (
        <div className={cn('flex items-center gap-4', className)} {...props}>
            <div className="w-12">
                <ContentCard
                    containerClassName={cn(imageClassName)}
                    containerRatio={imageRatio}
                    href={href}
                    poster={image}
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label
                        asChild
                        className={cn('line-clamp-1', titleClassName)}
                    >
                        <Link title={title} href={href}>
                            {title}
                        </Link>
                    </Label>
                    {titleMeta}
                </div>
                {description && (
                    <Small
                        className={cn(
                            'line-clamp-1 text-muted-foreground',
                            descriptionClassName,
                        )}
                    >
                        <Link
                            href={descriptionHref || '#'}
                            className={cn(
                                'cursor-pointer hover:underline transition-all',
                                !descriptionHref && 'pointer-events-none',
                            )}
                        >
                            {typeof description === 'string'
                                ? parseTextFromMarkDown(description)
                                : description}
                        </Link>
                    </Small>
                )}
                {meta && (
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        {meta}
                    </div>
                )}
                {createdAt && createdAt > 0 && (
                    <Small className="text-muted-foreground opacity-60">
                        {formatDistance(createdAt * 1000, Date.now(), {
                            addSuffix: true,
                        })}
                    </Small>
                )}
            </div>
            {children}
        </div>
    );
};

export default HorizontalCard;
