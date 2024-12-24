import React, { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/utils';

import MDViewer from '../markdown/viewer/MD-viewer';
import Link from './link';

interface HorizontalCardContextProps {
    href: string;
}

const HorizontalCardContext = React.createContext<
    HorizontalCardContextProps | undefined
>(undefined);

const useHorizontalCard = () => {
    const context = React.useContext(HorizontalCardContext);

    if (!context) {
        throw new Error(
            'useHorizontalCard must be used within HorizontalCardContext',
        );
    }

    return context;
};

interface HorizontalCardTitleProps {
    className?: string;
    titleMeta?: ReactNode;
}

const HorizontalCardTitle: FC<PropsWithChildren<HorizontalCardTitleProps>> = ({
    children,
    className,
    titleMeta,
}) => {
    const { href } = useHorizontalCard();

    return (
        <div className="flex items-center gap-2">
            <Label asChild className={cn('line-clamp-1', className)}>
                <Link title={children as string} href={href}>
                    {children}
                </Link>
            </Label>
            {titleMeta}
        </div>
    );
};

interface HorizontalCardDescriptionProps {
    className?: string;
    href?: string;
}

const HorizontalCardDescription: FC<
    PropsWithChildren<HorizontalCardDescriptionProps>
> = ({ children, className, href }) => {
    if (typeof children === 'string') {
        return (
            <Small
                className={cn('line-clamp-1 text-muted-foreground', className)}
            >
                <Link href={href}>
                    <MDViewer preview>{children}</MDViewer>
                </Link>
            </Small>
        );
    }

    return (
        <div className={cn('inline-flex items-center gap-2', className)}>
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
}

const HorizontalCardImage: FC<PropsWithChildren<HorizontalCardImageProps>> = ({
    children,
    imageRatio,
    image,
    className,
    imageClassName,
}) => {
    const { href } = useHorizontalCard();

    return (
        <ContentCard
            className={cn('w-12', className)}
            containerClassName={cn(imageClassName)}
            containerRatio={imageRatio}
            href={href}
            image={image}
        >
            {children}
        </ContentCard>
    );
};

interface Props extends ComponentProps<'div'> {
    href: string;
}

const HorizontalCard: FC<Props> = ({ href, className, children, ...props }) => {
    return (
        <HorizontalCardContext.Provider value={{ href }}>
            <div
                className={cn('flex items-center gap-4', className)}
                {...props}
            >
                {children}
            </div>
        </HorizontalCardContext.Provider>
    );
};

export {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
};
