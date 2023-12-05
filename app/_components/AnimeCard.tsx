'use client';
import {
    createElement,
    ForwardedRef,
    forwardRef,
    MouseEventHandler,
    ReactNode,
    useState,
} from 'react';
import AnimeTooltip from './AnimeTooltip';
import MaterialSymbolsArticle from '~icons/material-symbols/article';
import BaseCard from '@/app/_components/BaseCard';
import { UrlObject } from 'url';
import { WATCH_STATUS } from '@/utils/constants';

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
    <div className="absolute top-0 left-0 w-full">
        <div
            className="absolute right-2 top-2 border-white w-fit rounded-md p-1 z-[1] bg-secondary text-white"
            style={{
                backgroundColor:
                    WATCH_STATUS[watch.status as Hikka.WatchStatus].color,
            }}
        >
            {createElement(
                WATCH_STATUS[watch.status as Hikka.WatchStatus].icon,
            )}
        </div>
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-0" />
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
                    <button
                        onMouseOver={(e) => {
                            onMouseOver && onMouseOver(e);
                            setOnCard(true);
                        }}
                        className="btn btn-square btn-secondary absolute bottom-2 right-2 btn-badge group-hover:opacity-100 opacity-0 hidden lg:flex"
                    >
                        <MaterialSymbolsArticle />
                    </button>
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
