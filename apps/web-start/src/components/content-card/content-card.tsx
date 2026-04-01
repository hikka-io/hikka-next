import {
    ContentTypeEnum,
    ReadResponseBase,
    ReadStatusEnum,
    WatchResponseBase,
} from '@hikka/client';
import { type VariantProps, cva } from 'class-variance-authority';
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
import {
    IMAGE_PRESETS,
    type ImagePreset,
} from '@/utils/constants/image-presets';
import { Link } from '@/utils/navigation';

import MaterialSymbolsImageNotSupportedOutlineRounded from '../icons/material-symbols/MaterialSymbolsImageNotSupportedOutlineRounded';
import ContentStatus from './content-status';
import ContextMenuOverlay from './context-menu-overlay';
import { useImagePreset } from './image-preset-context';
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
    width?: number;
    height?: number;
    sizes?: string;
}

const contentCardVariants = cva('group relative flex w-full flex-col gap-2', {
    variants: {
        interactive: {
            true: 'cursor-pointer',
            false: '',
        },
    },
    defaultVariants: {
        interactive: false,
    },
});

export interface ContentCardProps
    extends VariantProps<typeof contentCardVariants> {
    target?: string;
    title?: string | null;
    description?: string | null;
    leftSubtitle?: string | null;
    rightSubtitle?: string | null;
    image?: string | ReactNode;
    href?: string;
    to?: string;
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
    imagePreset?: ImagePreset;
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
export const DEFAULT_CONTAINER_RATIO = 0.7;
const DEFAULT_PRESET = IMAGE_PRESETS.card;

// Tooltip map
const TOOLTIP_MAP: Record<
    string,
    ComponentType<{
        slug?: string;
        children: ReactNode;
        watch?: WatchResponseBase;
        read?: ReadResponseBase;
    }>
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
    to?: string;
    target?: string;
    linkProps?: Record<string, any>;
    className?: string;
    children: ReactNode;
}> = ({ to, target, linkProps, className, children }) => {
    if (!to) return <div className={className}>{children}</div>;
    return (
        <Link to={to} target={target} className={className} {...linkProps}>
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
                to,
                disableChildrenLink,
                onClick,
                watch,
                read,
                slug,
                content_type,
                withContextMenu,
                imageProps,
                imagePreset,
                linkProps,
                target,
                ...props
            },
            ref,
        ) => {
            const contextPreset = useImagePreset();
            const effectivePreset = imagePreset ?? contextPreset;
            const resolvedHref = to ?? href;
            const hasSubtitles = Boolean(leftSubtitle || rightSubtitle);
            const hasTitleOrDescription = Boolean(title || description);
            const resolvedImageProps = effectivePreset
                ? { ...IMAGE_PRESETS[effectivePreset], ...imageProps }
                : imageProps;

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
                                'bg-muted relative w-full overflow-hidden rounded-md',
                                containerClassName,
                            )}
                        >
                            <CardLink
                                to={resolvedHref}
                                target={target}
                                linkProps={linkProps}
                                className="bg-secondary/20 absolute top-0 left-0 flex size-full items-center justify-center"
                            >
                                {renderImage(
                                    image,
                                    imageClassName,
                                    resolvedImageProps,
                                    containerRatio,
                                )}
                                {!disableChildrenLink && children}
                                {watch && (
                                    <ContentStatus
                                        status={watch.status}
                                        icon={WATCH_STATUS[watch.status].icon!}
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
                                to={resolvedHref}
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
    containerRatio?: number,
) => {
    if (!image) {
        return (
            <MaterialSymbolsImageNotSupportedOutlineRounded className="text-muted-foreground text-4xl" />
        );
    }

    if (typeof image === 'string') {
        const { width, height, sizes, ...restImageProps } = imageProps || {};
        const resolvedWidth = width ?? DEFAULT_PRESET.width;
        const resolvedHeight =
            height ??
            (containerRatio
                ? Math.round(resolvedWidth / containerRatio)
                : DEFAULT_PRESET.height);
        return (
            <Image
                width={resolvedWidth}
                height={resolvedHeight}
                sizes={sizes ?? DEFAULT_PRESET.sizes}
                src={image}
                className={cn('max-h-full! max-w-full! ', imageClassName)}
                alt="Poster"
                {...(Object.keys(restImageProps).length > 0
                    ? restImageProps
                    : { loading: 'lazy' })}
            />
        );
    }

    return image;
};

const renderDescription = (description?: string | null) => {
    if (!description) return null;
    return (
        <p className="text-muted-foreground mb-1 truncate text-xs">
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
                'text-sm leading-5 font-medium',
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
                <span className="text-muted-foreground text-xs leading-tight font-medium">
                    {leftSubtitle}
                </span>
            )}
            {leftSubtitle && rightSubtitle && (
                <div className="bg-muted-foreground size-1 rounded-full" />
            )}
            {rightSubtitle && (
                <span className="text-muted-foreground text-xs leading-tight font-medium">
                    {rightSubtitle}
                </span>
            )}
        </div>
    );
};

// Main Component
const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
    (props, ref) => {
        const { withContextMenu, slug, content_type, href, to, image } = props;
        const resolvedHref = to ?? href;

        if (withContextMenu && slug && content_type) {
            return (
                <ContextMenuOverlay
                    href={resolvedHref}
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
