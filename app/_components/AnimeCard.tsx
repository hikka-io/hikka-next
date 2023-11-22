'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import AnimeTooltip from './AnimeTooltip';
import MaterialSymbolsArticle from '~icons/material-symbols/article';
import BaseCard from '@/app/_components/BaseCard';
import {UrlObject} from "url";

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
                {slug && (
                    <button
                        onMouseOver={() => slug && setOnCard(true)}
                        onMouseOut={() => slug && setOnCard(false)}
                        className="btn btn-circle btn-secondary absolute bottom-2 right-2 btn-badge group-hover:opacity-100 opacity-0 hidden lg:flex"
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
