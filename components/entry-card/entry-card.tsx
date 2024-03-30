import * as React from 'react';
import {
    ForwardedRef,
    Fragment,
    MouseEventHandler,
    ReactNode,
    forwardRef,
    memo,
} from 'react';
import { UrlObject } from 'url';
import MaterialSymbolsImageNotSupportedOutlineRounded from '~icons/material-symbols/image-not-supported-outline-rounded';

import Link from 'next/link';

import AnimeTooltip from '@/components/entry-card/components/anime-tooltip';
import P from '@/components/typography/p';
import Image from '@/components/ui/image';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';

import { AspectRatio } from '../ui/aspect-ratio';
import ContextMenuOverlay from './components/context-menu-overlay';
import WatchStatus from './components/watch-status';

export interface Props {
    target?: string;
    title?: string;
    description?: string;
    leftSubtitle?: string;
    rightSubtitle?: string;
    poster?: string | ReactNode;
    href?: string | UrlObject;
    containerRatio?: number;
    posterClassName?: string;
    containerClassName?: string;
    titleClassName?: string;
    className?: string;
    disableChildrenLink?: boolean;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement> &
        MouseEventHandler<HTMLDivElement>;
    watch?: API.Watch;
    slug?: string;
    content_type?: API.ContentType;
    withContextMenu?: boolean;
}

const Tooltip = ({
    children,
    content_type,
    slug,
}: {
    children: ReactNode;
    content_type?: API.ContentType;
    slug?: string;
}) => {
    switch (content_type) {
        case 'anime':
            return <AnimeTooltip slug={slug}>{children}</AnimeTooltip>;
        default:
            return <Fragment>{children}</Fragment>;
    }
};

const Content = memo(
    forwardRef(
        (
            {
                poster,
                title,
                description,
                leftSubtitle,
                rightSubtitle,
                posterClassName,
                containerClassName,
                containerRatio,
                titleClassName,
                className,
                children,
                href,
                disableChildrenLink,
                onClick,
                watch,
                slug,
                content_type,
                withContextMenu,
                ...props
            }: Props,
            ref: ForwardedRef<HTMLDivElement>,
        ) => {
            const Comp = href ? Link : 'div';

            return (
                <Tooltip slug={slug} content_type={content_type}>
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
                                'relative w-full overflow-hidden rounded-md bg-muted',
                                containerClassName,
                            )}
                        >
                            <Comp
                                href={href || ''}
                                className="absolute left-0 top-0 flex size-full items-center justify-center bg-secondary/60"
                            >
                                {poster ? (
                                    typeof poster === 'string' ? (
                                        <Image
                                            src={poster}
                                            fill
                                            className={cn(
                                                'size-full object-cover',
                                                posterClassName,
                                            )}
                                            alt="Poster"
                                        />
                                    ) : (
                                        poster
                                    )
                                ) : (
                                    <MaterialSymbolsImageNotSupportedOutlineRounded className="text-4xl text-muted-foreground" />
                                )}

                                {!disableChildrenLink && children}
                                {watch && <WatchStatus watch={watch} />}
                            </Comp>
                            {disableChildrenLink && children}
                        </AspectRatio>
                        {(title || description) && (
                            <Comp
                                href={href || ''}
                                className={cn(
                                    'mt-1',
                                    (leftSubtitle || rightSubtitle) &&
                                        'truncate',
                                )}
                            >
                                {description && (
                                    <P className="mb-1 truncate text-xs text-muted-foreground">
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
                                )}
                            </Comp>
                        )}
                    </div>
                </Tooltip>
            );
        },
    ),
);

const Component = forwardRef(
    (props: Props, ref: ForwardedRef<HTMLDivElement>) => {

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
    },
);

export default memo(Component);
