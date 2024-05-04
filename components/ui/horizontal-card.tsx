import { formatDistance } from 'date-fns';
import React, { ComponentProps, FC, ReactNode } from 'react';

import Link from 'next/link';

import EntryCard from '@/components/entry-card/entry-card';
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
    createdAt?: number;
    meta?: ReactNode;
    image?: string;
    imageClassName?: string;
    imageRatio?: number;
}

const HorizontalCard: FC<Props> = ({
    title,
    titleMeta,
    titleClassName,
    href,
    description,
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
                <EntryCard
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
                        <Link href={href}>{title}</Link>
                    </Label>
                    {titleMeta}
                </div>
                {description && (
                    <Small
                        className={cn(
                            'truncate text-muted-foreground',
                            descriptionClassName,
                        )}
                    >
                        {typeof description === 'string'
                            ? parseTextFromMarkDown(description)
                            : description}
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
