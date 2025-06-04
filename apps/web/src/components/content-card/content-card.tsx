import {
    ContentTypeEnum,
    ReadResponseBase,
    WatchResponseBase,
} from '@hikka/client';
import Link, { LinkProps } from 'next/link';
import {
    FC,
    Fragment,
    MouseEventHandler,
    ReactNode,
    forwardRef,
    memo,
} from 'react';
import { UrlObject } from 'url';

import { cn } from '@/utils/utils';

import MaterialSymbolsImageNotSupportedOutlineRounded from '../icons/material-symbols/MaterialSymbolsImageNotSupportedOutlineRounded';
import P from '../typography/p';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from '../ui/image';
import { Label } from '../ui/label';
import AnimeTooltip from './anime-tooltip';
import CharacterTooltip from './character-tooltip';
import ContextMenuOverlay from './context-menu-overlay';
import MangaTooltip from './manga-tooltip';
import NovelTooltip from './novel-tooltip';
import PersonTooltip from './person-tooltip';
import ReadStatus from './read-status';
import WatchStatus from './watch-status';

// Types
interface ImageProps {
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    alt?: string;
}

export interface ContentCardProps {
    target?: string;
    title?: string | null;
    description?: string | null;
    leftSubtitle?: string | null;
    rightSubtitle?: string | null;
    image?: string | ReactNode;
    href?: string | UrlObject;
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
    linkProps?: LinkProps;
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

// Tooltip Component
const Tooltip: FC<TooltipProps> = memo(
    ({ children, content_type, slug, watch, read }) => {
        switch (content_type) {
            case 'anime':
                return (
                    <AnimeTooltip slug={slug} watch={watch}>
                        {children}
                    </AnimeTooltip>
                );
            case 'manga':
                return (
                    <MangaTooltip slug={slug} read={read}>
                        {children}
                    </MangaTooltip>
                );
            case 'novel':
                return (
                    <NovelTooltip slug={slug} read={read}>
                        {children}
                    </NovelTooltip>
                );
            case 'character':
                return (
                    <CharacterTooltip slug={slug}>{children}</CharacterTooltip>
                );
            case 'person':
                return <PersonTooltip slug={slug}>{children}</PersonTooltip>;
            default:
                return <Fragment>{children}</Fragment>;
        }
    },
);

Tooltip.displayName = 'Tooltip';

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
                ...props
            },
            ref,
        ) => {
            const Comp = href ? Link : 'div';
            const hasSubtitles = Boolean(leftSubtitle || rightSubtitle);
            const hasTitleOrDescription = Boolean(title || description);

            const commonProps = {
                className: cn(
                    'group relative flex w-full flex-col gap-2',
                    onClick && 'cursor-pointer',
                    className,
                ),
                onClick,
                ...props,
            };

            return (
                <Tooltip
                    slug={slug}
                    content_type={content_type}
                    watch={watch}
                    read={read}
                >
                    <div ref={ref} {...commonProps}>
                        <AspectRatio
                            ratio={containerRatio}
                            className={cn(
                                'relative w-full overflow-hidden rounded-md bg-muted',
                                containerClassName,
                            )}
                        >
                            {href ? (
                                <Link
                                    href={href}
                                    className="absolute left-0 top-0 flex size-full items-center justify-center rounded-md bg-secondary/20"
                                    {...linkProps}
                                >
                                    {renderImage(
                                        image,
                                        imageClassName,
                                        imageProps,
                                    )}
                                    {!disableChildrenLink && children}
                                    {watch && <WatchStatus watch={watch} />}
                                    {read && <ReadStatus read={read} />}
                                </Link>
                            ) : (
                                <div className="absolute left-0 top-0 flex size-full items-center justify-center rounded-md bg-secondary/20">
                                    {renderImage(
                                        image,
                                        imageClassName,
                                        imageProps,
                                    )}
                                    {!disableChildrenLink && children}
                                    {watch && <WatchStatus watch={watch} />}
                                    {read && <ReadStatus read={read} />}
                                </div>
                            )}
                            {disableChildrenLink && children}
                        </AspectRatio>
                        {hasTitleOrDescription &&
                            (href ? (
                                <Link
                                    href={href}
                                    className={cn(
                                        'mt-1',
                                        hasSubtitles && 'truncate',
                                    )}
                                    {...linkProps}
                                >
                                    {renderDescription(description)}
                                    {renderTitle(
                                        title,
                                        hasSubtitles,
                                        titleClassName,
                                    )}
                                    {renderSubtitles(
                                        leftSubtitle,
                                        rightSubtitle,
                                    )}
                                </Link>
                            ) : (
                                <div
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
                                    {renderSubtitles(
                                        leftSubtitle,
                                        rightSubtitle,
                                    )}
                                </div>
                            ))}
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
        <P className="mb-1 truncate text-xs text-muted-foreground">
            {description}
        </P>
    );
};

const renderTitle = (
    title?: string | null,
    hasSubtitles?: boolean,
    titleClassName?: string,
) => {
    if (!title) return null;
    return (
        <Label
            className={cn(
                'cursor-pointer leading-5',
                !hasSubtitles && 'line-clamp-2',
                titleClassName,
            )}
        >
            {title}
        </Label>
    );
};

const renderSubtitles = (
    leftSubtitle?: string | null,
    rightSubtitle?: string | null,
) => {
    if (!leftSubtitle && !rightSubtitle) return null;
    return (
        <div className="mt-1 flex cursor-pointer items-center gap-2">
            {leftSubtitle && (
                <Label className="cursor-pointer text-xs text-muted-foreground">
                    {leftSubtitle}
                </Label>
            )}
            {leftSubtitle && rightSubtitle && (
                <div className="size-1 rounded-full bg-muted-foreground" />
            )}
            {rightSubtitle && (
                <Label className="cursor-pointer text-xs text-muted-foreground">
                    {rightSubtitle}
                </Label>
            )}
        </div>
    );
};

// Main Component
const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
    (props, ref) => {
        const { withContextMenu, slug, content_type } = props;

        if (withContextMenu && slug && content_type) {
            return (
                <ContextMenuOverlay slug={slug} content_type={content_type}>
                    <Content {...props} ref={ref} key={`${props.title}`} />
                </ContextMenuOverlay>
            );
        }

        return <Content {...props} ref={ref} key={`${props.title}`} />;
    },
);

ContentCard.displayName = 'ContentCard';

export default memo(ContentCard);
