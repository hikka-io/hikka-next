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

export interface Props {
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
    onClick?: MouseEventHandler<HTMLAnchorElement> &
        MouseEventHandler<HTMLDivElement>;
    watch?: WatchResponseBase;
    read?: ReadResponseBase;
    slug?: string;
    content_type?: ContentTypeEnum;
    withContextMenu?: boolean;
    imageProps?: {
        priority?: boolean;
    };
    linkProps?: LinkProps;
}

interface TooltipProps {
    children: ReactNode;
    content_type?: ContentTypeEnum;
    slug?: string;
    watch?: WatchResponseBase;
    read?: ReadResponseBase;
}

const Tooltip: FC<TooltipProps> = ({
    children,
    content_type,
    slug,
    watch,
    read,
}) => {
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
            return <CharacterTooltip slug={slug}>{children}</CharacterTooltip>;
        case 'person':
            return <PersonTooltip slug={slug}>{children}</PersonTooltip>;
        default:
            return <Fragment>{children}</Fragment>;
    }
};

const Content = memo(
    forwardRef<HTMLDivElement, Props>(
        (
            {
                image,
                title,
                description,
                leftSubtitle,
                rightSubtitle,
                imageClassName,
                containerClassName,
                containerRatio,
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
                            'group relative flex w-full flex-col gap-2',
                            onClick && 'cursor-pointer',
                            className,
                        )}
                        onClick={onClick}
                        {...props}
                    >
                        <AspectRatio
                            ratio={containerRatio || 0.7}
                            className={cn(
                                'bg-muted relative w-full overflow-hidden rounded-md',
                                containerClassName,
                            )}
                        >
                            <Comp
                                href={href || '#'}
                                className="bg-secondary/20 absolute left-0 top-0 flex size-full items-center justify-center rounded-md"
                            >
                                {image ? (
                                    typeof image === 'string' ? (
                                        <Image
                                            src={image}
                                            width={150}
                                            height={225}
                                            className={cn(
                                                'size-full object-cover',
                                                imageClassName,
                                            )}
                                            alt="Poster"
                                            {...(imageProps
                                                ? imageProps
                                                : { loading: 'lazy' })}
                                        />
                                    ) : (
                                        image
                                    )
                                ) : (
                                    <MaterialSymbolsImageNotSupportedOutlineRounded className="text-muted-foreground text-4xl" />
                                )}

                                {!disableChildrenLink && children}
                                {watch && <WatchStatus watch={watch} />}
                                {read && <ReadStatus read={read} />}
                            </Comp>
                            {disableChildrenLink && children}
                        </AspectRatio>
                        {(title || description) && (
                            <Comp
                                href={href || '#'}
                                className={cn(
                                    'mt-1',
                                    (leftSubtitle || rightSubtitle) &&
                                        'truncate',
                                )}
                            >
                                {description && (
                                    <P className="text-muted-foreground mb-1 truncate text-xs">
                                        {description}
                                    </P>
                                )}
                                {title && (
                                    <Label
                                        className={cn(
                                            'cursor-pointer leading-5',
                                            !leftSubtitle &&
                                                !rightSubtitle &&
                                                'line-clamp-2',
                                            titleClassName,
                                        )}
                                    >
                                        {title}
                                    </Label>
                                )}
                                {(leftSubtitle || rightSubtitle) && (
                                    <div className="mt-1 flex cursor-pointer items-center gap-2">
                                        {leftSubtitle && (
                                            <Label className="text-muted-foreground cursor-pointer text-xs">
                                                {leftSubtitle}
                                            </Label>
                                        )}
                                        {leftSubtitle && rightSubtitle && (
                                            <div className="bg-muted-foreground size-1 rounded-full" />
                                        )}
                                        {rightSubtitle && (
                                            <Label className="text-muted-foreground cursor-pointer text-xs">
                                                {rightSubtitle}
                                            </Label>
                                        )}
                                    </div>
                                )}
                            </Comp>
                        )}
                    </div>
                </Tooltip>
            );
        },
    ),
);

const ContentCard = forwardRef<HTMLDivElement, Props>((props, ref) => {
    if (props.withContextMenu && props.slug && props.content_type) {
        return (
            <ContextMenuOverlay
                slug={props.slug}
                content_type={props.content_type}
            >
                <Content {...props} ref={ref} key={`${props.title}`} />
            </ContextMenuOverlay>
        );
    }

    return <Content {...props} ref={ref} key={`${props.title}`} />;
});

export default memo(ContentCard);
