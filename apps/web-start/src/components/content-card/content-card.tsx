import {
    ContentTypeEnum,
    ReadResponseBase,
    ReadStatusEnum,
    WatchResponseBase,
} from '@hikka/client';
import { type VariantProps, cva } from 'class-variance-authority';
import { Link } from '@tanstack/react-router';
import {
    ComponentType,
    FC,
    Fragment,
    MouseEventHandler,
    ReactNode,
    forwardRef,
    memo,
} from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from '@/components/ui/image';

import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/constants/common';

import MaterialSymbolsImageNotSupportedOutlineRounded from '../icons/material-symbols/MaterialSymbolsImageNotSupportedOutlineRounded';
import ContentStatus from './content-status';
import ContextMenuOverlay from './context-menu-overlay';
import {
    AnimeTooltip,
    CharacterTooltip,
    MangaTooltip,
    NovelTooltip,
    PersonTooltip,
} from './tooltips';

// Types
interface ImageProps {
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    alt?: string;
}

const contentCardVariants = cva(
    'group relative flex w-full flex-col gap-2',
    {
        variants: {
            interactive: {
                true: 'cursor-pointer',
                false: '',
            },
        },
        defaultVariants: {
            interactive: false,
        },
    },
);

export interface ContentCardProps
    extends VariantProps<typeof contentCardVariants> {
    target?: string;
    title?: string | null;
    description?: string | null;
    leftSubtitle?: string | null;
    rightSubtitle?: string | null;
    image?: string | ReactNode;
    href?: string;
    containerRatio?: number;
    imageClassName?: string;
    containerClassName?: string;
    titleClassName?: string;
    className?: string;
    disableChildrenLink?: boolean;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
    watch?: WatchResponseBase;
    read?: ReadResponseBase;
    slug?: string;
    content_type?: ContentTypeEnum;
    withContextMenu?: boolean;
    imageProps?: ImageProps;
    linkProps?: Record<string, any>;
}

export interface TooltipProps {
    children: ReactNode;
    content_type?: ContentTypeEnum;
    slug?: string;
    watch?: WatchResponseBase;
    read?: ReadResponseBase;
}

// Constants
const DEFAULT_CONTAINER_RATIO = 0.7;
const DEFAULT_IMAGE_DIMENSIONS = {
    width: 150,
    height: 225,
};

// Tooltip map
const TOOLTIP_MAP: Record<
    string,
    ComponentType<{ slug?: string; children: ReactNode; watch?: WatchResponseBase; read?: ReadResponseBase }>
> = {
    anime: AnimeTooltip,
    manga: MangaTooltip,
    novel: NovelTooltip,
    character: CharacterTooltip,
    person: PersonTooltip,
};

// Tooltip Component
const Tooltip: FC<TooltipProps> = memo(
    ({ children, content_type, slug, watch, read }) => {
        const TooltipComponent = content_type
            ? TOOLTIP_MAP[content_type]
            : undefined;

        if (!TooltipComponent) {
            return <Fragment>{children}</Fragment>;
        }

        return (
            <TooltipComponent slug={slug} watch={watch} read={read}>
                {children}
            </TooltipComponent>
        );
    },
);

Tooltip.displayName = 'Tooltip';

// CardLink — eliminates duplicated Link/div render paths
const CardLink: FC<{
    href?: string;
    target?: string;
    linkProps?: Record<string, any>;
    className?: string;
    children: ReactNode;
}> = ({ href, target, linkProps, className, children }) => {
    if (!href) return <div className={className}>{children}</div>;
    return (
        <Link to={href as any} target={target} className={className} {...linkProps}>
            {children}
        </Link>
    );
};

// Content Component
const Content = memo(
    forwardRef<HTMLDivElement, ContentCardProps>(
        (
            {
                image,
                title,
                description,
                leftSubtitle,
                rightSubtitle,
                imageClassName,
                containerClassName,
                containerRatio = DEFAULT_CONTAINER_RATIO,
                titleClassName,
                className,
                children,
                href,
                disableChildrenLink,
                onClick,
                watch,
                read,
                slug,
                content_type,
                withContextMenu,
                imageProps,
                linkProps,
                target,
                ...props
            },
            ref,
        ) => {
            const hasSubtitles = Boolean(leftSubtitle || rightSubtitle);
            const hasTitleOrDescription = Boolean(title || description);

            return (
                <Tooltip
                    slug={slug}
                    content_type={content_type}
                    watch={watch}
                    read={read}
                >
                    <div
                        ref={ref}
                        className={cn(
                            contentCardVariants({
                                interactive: !!onClick,
                            }),
                            className,
                        )}
                        onClick={onClick}
                        {...props}
                    >
                        <AspectRatio
                            ratio={containerRatio}
                            className={cn(
                                'relative w-full overflow-hidden rounded-md bg-muted',
                                containerClassName,
                            )}
                        >
                            <CardLink
                                href={href}
                                target={target}
                                linkProps={linkProps}
                                className="absolute left-0 top-0 flex size-full items-center justify-center bg-secondary/20"
                            >
                                {renderImage(image, imageClassName, imageProps)}
                                {!disableChildrenLink && children}
                                {watch && (
                                    <ContentStatus
                                        status={watch.status}
                                        icon={
                                            WATCH_STATUS[watch.status].icon!
                                        }
                                    />
                                )}
                                {read && (
                                    <ContentStatus
                                        status={read.status}
                                        icon={
                                            READ_STATUS[
                                                read.status as ReadStatusEnum
                                            ].icon!
                                        }
                                    />
                                )}
                            </CardLink>
                            {disableChildrenLink && children}
                        </AspectRatio>
                        {hasTitleOrDescription && (
                            <CardLink
                                href={href}
                                target={target}
                                linkProps={linkProps}
                                className={cn(
                                    'mt-1',
                                    hasSubtitles && 'truncate',
                                )}
                            >
                                {renderDescription(description)}
                                {renderTitle(
                                    title,
                                    hasSubtitles,
                                    titleClassName,
                                )}
                                {renderSubtitles(leftSubtitle, rightSubtitle)}
                            </CardLink>
                        )}
                    </div>
                </Tooltip>
            );
        },
    ),
);

Content.displayName = 'Content';

// Helper functions
const renderImage = (
    image: string | ReactNode | undefined,
    imageClassName?: string,
    imageProps?: ImageProps,
) => {
    if (!image) {
        return (
            <MaterialSymbolsImageNotSupportedOutlineRounded className="text-4xl text-muted-foreground" />
        );
    }

    if (typeof image === 'string') {
        return (
            <Image
                src={image}
                width={DEFAULT_IMAGE_DIMENSIONS.width}
                height={DEFAULT_IMAGE_DIMENSIONS.height}
                className={cn('size-full object-cover', imageClassName)}
                alt="Poster"
                {...(imageProps || { loading: 'lazy' })}
            />
        );
    }

    return image;
};

const renderDescription = (description?: string | null) => {
    if (!description) return null;
    return (
        <p className="mb-1 truncate text-xs text-muted-foreground">
            {description}
        </p>
    );
};

const renderTitle = (
    title?: string | null,
    hasSubtitles?: boolean,
    titleClassName?: string,
) => {
    if (!title) return null;
    return (
        <span
            className={cn(
                'text-sm font-medium leading-5',
                !hasSubtitles && 'line-clamp-2',
                titleClassName,
            )}
        >
            {title}
        </span>
    );
};

const renderSubtitles = (
    leftSubtitle?: string | null,
    rightSubtitle?: string | null,
) => {
    if (!leftSubtitle && !rightSubtitle) return null;
    return (
        <div className="mt-1 flex items-center gap-2">
            {leftSubtitle && (
                <span className="text-xs font-medium leading-tight text-muted-foreground">
                    {leftSubtitle}
                </span>
            )}
            {leftSubtitle && rightSubtitle && (
                <div className="size-1 rounded-full bg-muted-foreground" />
            )}
            {rightSubtitle && (
                <span className="text-xs font-medium leading-tight text-muted-foreground">
                    {rightSubtitle}
                </span>
            )}
        </div>
    );
};

// Main Component
const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
    (props, ref) => {
        const { withContextMenu, slug, content_type, href, image } = props;

        if (withContextMenu && slug && content_type) {
            return (
                <ContextMenuOverlay
                    href={href}
                    slug={slug}
                    content_type={content_type}
                    image={image}
                >
                    <Content {...props} ref={ref} />
                </ContextMenuOverlay>
            );
        }

        return <Content {...props} ref={ref} />;
    },
);

ContentCard.displayName = 'ContentCard';

export default memo(ContentCard);
