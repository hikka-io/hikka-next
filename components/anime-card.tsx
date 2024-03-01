'use client';

import * as React from 'react';
import {
    ForwardedRef,
    MouseEventHandler,
    ReactNode,
    createElement,
    forwardRef,
    useState,
} from 'react';
import { UrlObject } from 'url';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import Link from 'next/link';

import BaseCard from '@/components/ui/base-card';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useAuthContext } from '@/services/providers/auth-provider';
import { WATCH_STATUS } from '@/utils/constants';

import AnimeTooltip from './anime-tooltip';

interface Props {
    target?: string;
    title?: string;
    description?: string;
    leftSubtitle?: string;
    rightSubtitle?: string;
    poster?: string;
    posterClassName?: string;
    containerClassName?: string;
    className?: string;
    children?: ReactNode;
    slug?: string;
    href?: string | UrlObject;
    watch?: API.Watch;
}

const Watch = ({ watch }: { watch: API.Watch }) => (
    <div className="absolute left-0 top-0 w-full">
        <div
            className="absolute right-2 top-2 z-[1] w-fit rounded-md border-white p-1 text-white"
            style={{
                backgroundColor:
                    WATCH_STATUS[watch.status as API.WatchStatus].color,
            }}
        >
            {createElement(WATCH_STATUS[watch.status as API.WatchStatus].icon!)}
        </div>
        <div className="absolute left-0 top-0 z-0 h-16 w-full bg-gradient-to-b from-black to-transparent" />
    </div>
);

const Card = forwardRef(
    (
        {
            slug,
            watch,
            onMouseOver,
            onMouseOut,
            ...props
        }: Props & {
            onMouseOver?: MouseEventHandler<HTMLElement>;
            onMouseOut?: MouseEventHandler<HTMLElement>;
        },
        ref: ForwardedRef<HTMLAnchorElement>,
    ) => {
        const [onCard, setOnCard] = useState<boolean>(false);

        return (
            <BaseCard
                onMouseOver={(e) => {
                    onCard && onMouseOver && onMouseOver(e);
                }}
                onMouseOut={(e) => {
                    onMouseOut && onMouseOut(e);
                    setOnCard(false);
                }}
                ref={ref}
                {...props}
            >
                {watch && <Watch watch={watch} />}
            </BaseCard>
        );
    },
);

const Component = ({ watch, slug, ...props }: Props) => {
    if (slug) {
        return (
            <AnimeTooltip slug={slug}>
                <Card {...props} slug={slug} watch={watch} />
            </AnimeTooltip>
        );
    }

    return <BaseCard {...props}>{watch && <Watch watch={watch} />}</BaseCard>;
};

const ContextMenuOverlay = (props: Props) => {
    const { secret } = useAuthContext();

    if (!secret) {
        return <Component {...props} />;
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Component {...props} />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem asChild>
                    <Link
                        href={`/edit/new?content_type=anime&slug=${props.slug}`}
                    >
                        <MaterialSymbolsEditRounded className="mr-2" />
                        Створити правку
                    </Link>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default ContextMenuOverlay;
