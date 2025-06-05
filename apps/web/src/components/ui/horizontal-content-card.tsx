import Link from 'next/link';
import { ComponentPropsWithoutRef, forwardRef, memo } from 'react';

import { cn } from '@/utils/utils';
import ContentCard from '../content-card/content-card';
import MDViewer from '../markdown/viewer/MD-viewer';
import H5 from '../typography/h5';
import { Label } from './label';

export interface Props extends ComponentPropsWithoutRef<'div'> {
    title: string;
    href: string;
    image?: string;
    description?: string;
    size?: 'sm' | 'md';
}

const HorizontalContentCard = forwardRef<HTMLDivElement, Props>(
    (
        {
            title,
            image,
            href,
            description,
            children,
            className,
            size = 'md',
            ...props
        },
        ref,
    ) => {
        const Title = size === 'md' ? H5 : Label;

        return (
            <div
                ref={ref}
                className={cn(
                    'flex rounded-md border border-border bg-secondary/20',
                    className,
                )}
                {...props}
            >
                <ContentCard
                    className={cn(
                        size === 'md' && 'max-w-36',
                        size === 'sm' && 'max-w-16',
                    )}
                    containerClassName="rounded-r-none"
                    image={image}
                    href={href}
                />
                <div className="flex w-full flex-col justify-between gap-2 p-4">
                    <div className="flex flex-1 flex-col gap-2">
                        <Title
                            className={cn(
                                'line-clamp-1 w-fit cursor-pointer',
                                size === 'md' && 'sm:line-clamp-2',
                            )}
                        >
                            <Link href={href}>{title}</Link>
                        </Title>
                        {description && (
                            <MDViewer className="line-clamp-2 text-xs text-muted-foreground lg:line-clamp-3">
                                {description}
                            </MDViewer>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        );
    },
);

export default memo(HorizontalContentCard);
