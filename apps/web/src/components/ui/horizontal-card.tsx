import React, {
    ComponentProps,
    ComponentPropsWithoutRef,
    FC,
    PropsWithChildren,
    ReactNode,
} from 'react';

import { cn } from '../../utils/utils';
import ContentCard from '../content-card/content-card';
import MDViewer from '../markdown/viewer/MD-viewer';
import { Label } from './label';
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

interface HorizontalCardTitleProps extends ComponentPropsWithoutRef<'div'> {
    className?: string;
    titleMeta?: ReactNode;
}

const HorizontalCardTitle: FC<HorizontalCardTitleProps> = ({
    children,
    className,
    titleMeta,
}) => {
    const { href } = useHorizontalCard();

    return (
        <div className="flex min-w-0 items-center gap-2">
            <Label
                asChild
                className={cn('line-clamp-1 inline-block truncate', className)}
            >
                <Link title={children as string} href={href}>
                    {children}
                </Link>
            </Label>
            {titleMeta}
        </div>
    );
};

interface HorizontalCardDescriptionProps extends ComponentPropsWithoutRef<'a'> {
    className?: string;
    href?: string;
}

const HorizontalCardDescription: FC<HorizontalCardDescriptionProps> = ({
    children,
    className,
    href,
    ...props
}) => {
    if (typeof children === 'string') {
        return (
            <Link href={href} {...props}>
                <MDViewer
                    className={cn(
                        'line-clamp-1 !text-xs text-muted-foreground',
                        className,
                    )}
                    preview
                >
                    {children}
                </MDViewer>
            </Link>
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
    const { href: parentHref } = useHorizontalCard();

    return (
        <ContentCard
            className={cn('w-12', className)}
            containerClassName={cn(imageClassName)}
            containerRatio={imageRatio}
            href={href || parentHref}
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
