import { type ComponentProps, type FC, memo } from 'react';

import PosterCard from '@/components/content-card/poster-card';
import { MDViewer } from '@/components/markdown';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

export type ScheduleCardProps = ComponentProps<'div'> & {
    title: string;
    href: string;
    image?: string;
    description?: string;
    size?: 'sm' | 'md';
};

const ScheduleCard: FC<ScheduleCardProps> = ({
    title,
    image,
    href,
    description,
    children,
    className,
    size = 'md',
    ref,
    ...props
}) => {
    const Title = size === 'md' ? 'h5' : Label;

    return (
        <div
            ref={ref}
            className={cn(
                'flex rounded-md border border-border surface',
                className,
            )}
            {...props}
        >
            <PosterCard
                className={cn(
                    size === 'md' && 'max-w-36',
                    size === 'sm' && 'max-w-16',
                )}
                containerClassName="rounded-r-none"
                image={image}
                to={href}
            />
            <div className="flex w-full flex-col justify-between gap-2 p-4">
                <div className="flex flex-1 flex-col gap-2">
                    <Title
                        className={cn(
                            'line-clamp-1 w-fit cursor-pointer',
                            size === 'md' && 'sm:line-clamp-2',
                        )}
                    >
                        <Link to={href}>{title}</Link>
                    </Title>
                    {description && (
                        <MDViewer className="prose-inline line-clamp-2 text-muted-foreground text-xs lg:line-clamp-3">
                            {description}
                        </MDViewer>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};

export default memo(ScheduleCard);
