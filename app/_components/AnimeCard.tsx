'use client';
import { createElement, ReactNode, useEffect, useRef, useState } from 'react';
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

const Component = ({
    poster,
    title,
    desc,
    posterClassName,
    containerClassName,
    children,
    slug,
    href,
    watch,
}: Props) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const [anchor, setAnchor] = useState<null | HTMLAnchorElement>(null);
    const [onTooltip, setOnTooltip] = useState<boolean>(false);
    const [onCard, setOnCard] = useState<boolean>(false);

    useEffect(() => {
        if (onTooltip) {
            setAnchor(ref.current);
        } else {
            if (!onCard) {
                setAnchor(null);
            }
        }
    }, [onTooltip]);

    useEffect(() => {
        if (onCard) {
            setAnchor(ref.current);
        } else {
            if (!onTooltip) {
                setAnchor(null);
            }
        }
    }, [onCard]);

    return (
        <>
            <BaseCard
                ref={ref}
                title={title}
                href={href}
                desc={desc}
                posterClassName={posterClassName}
                containerClassName={containerClassName}
                poster={poster}
                onMouseOver={() => slug && onCard && setOnCard(true)}
                onMouseOut={() => slug && onCard && setOnCard(false)}
            >
                {watch && (
                    <div className="absolute top-0 left-0 w-full">
                        <div className="absolute right-2 top-2 border-white w-fit rounded-md p-1 z-[1] bg-secondary text-white" style={{
                            backgroundColor: WATCH_STATUS[watch.status as Hikka.WatchStatus].color
                        }}>
                            {createElement(
                                WATCH_STATUS[watch.status as Hikka.WatchStatus]
                                    .icon,
                            )}
                        </div>
                        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-0" />
                    </div>
                )}

                {slug && (
                    <button
                        onMouseOver={() => slug && setOnCard(true)}
                        onMouseOut={() => slug && setOnCard(false)}
                        className="btn btn-square btn-secondary absolute bottom-2 right-2 btn-badge group-hover:opacity-100 opacity-0 hidden lg:flex"
                    >
                        <MaterialSymbolsArticle />
                    </button>
                )}
                {children}
            </BaseCard>
            {slug && (onCard || onTooltip) && (
                <AnimeTooltip
                    setOnTooltip={setOnTooltip}
                    slug={slug}
                    anchor={anchor}
                />
            )}
        </>
    );
};

export default Component;
