'use client';

import {
    ForwardedRef,
    MouseEventHandler,
    ReactNode,
    createElement,
    forwardRef,
    useState,
} from 'react';
import { UrlObject } from 'url';
import MaterialSymbolsArticle from '~icons/material-symbols/article';

import BaseCard from '@/app/_components/base-card';
import { WATCH_STATUS } from '@/utils/constants';

import AnimeTooltip from './anime-tooltip';
import { Button } from '@/app/_components/ui/button';

interface Props {
    target?: string;
    title?: string;
    desc?: string;
    poster?: string;
    posterClassName?: string;
    containerClassName?: string;
    children?: ReactNode;
    slug?: string;
    href?: string | UrlObject;
    watch?: Hikka.Watch;
}

const Watch = ({ watch }: { watch: Hikka.Watch }) => (
    <div className="absolute left-0 top-0 w-full">
        <div
            className="absolute right-2 top-2 z-[1] w-fit rounded-md border-white p-1 text-white"
            style={{
                backgroundColor:
                WATCH_STATUS[watch.status as Hikka.WatchStatus].color,
            }}
        >
            {createElement(
                WATCH_STATUS[watch.status as Hikka.WatchStatus].icon,
            )}
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

                {slug && (
                    <Button
                        size="icon-sm"
                        variant="secondary"
                        onMouseOver={(e) => {
                            onMouseOver && onMouseOver(e);
                            setOnCard(true);
                        }}
                        className="absolute bottom-2 right-2 hidden opacity-0 group-hover:opacity-100 lg:flex"
                    >
                        <MaterialSymbolsArticle />
                    </Button>
                )}
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

export default Component;