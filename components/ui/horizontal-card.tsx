import { formatDistance } from 'date-fns';
import { ComponentProps, FC, ReactNode } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/utils';

import MDViewer from '../markdown/viewer/MD-viewer';
import Link from './link';

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
    imageContainerClassName?: string;
    imageRatio?: number;
    imageChildren?: ReactNode;
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
    imageContainerClassName,
    imageRatio,
    imageChildren,
    className,
    children,
    ...props
}) => {
    return (
        <div className={cn('flex items-center gap-4', className)} {...props}>
            <ContentCard
                className={cn('w-12', imageContainerClassName)}
                containerClassName={cn(imageClassName)}
                containerRatio={imageRatio}
                href={href}
                image={image}
            >
                {imageChildren}
            </ContentCard>

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
                        <Link href={descriptionHref}>
                            {typeof description === 'string' ? (
                                <MDViewer disableSpoiler>
                                    {description}
                                </MDViewer>
                            ) : (
                                description
                            )}
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
