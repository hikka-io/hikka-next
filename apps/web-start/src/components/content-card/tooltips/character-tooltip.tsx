'use client';

import { useCharacterAnime, useCharacterBySlug } from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import MDViewer from '../../markdown/viewer/MD-viewer';
import ContentCard from '../content-card';
import HoverCardWrapper from './hover-card-wrapper';
import { CharacterTooltipSkeleton } from './tooltip-skeleton';

interface TooltipDataProps {
    slug: string;
}

interface Props extends PropsWithChildren {
    slug?: string;
}

const TooltipData: FC<TooltipDataProps> = ({ slug }) => {
    const { data } = useCharacterBySlug({ slug });
    const { list } = useCharacterAnime({ slug });

    const characterAnime = list?.sort(
        (a, b) => b.anime.score - a.anime.score,
    )[0];

    if (!data) {
        return <CharacterTooltipSkeleton />;
    }

    return (
        <div className="flex w-96 gap-4 text-left">
            <ContentCard
                className="w-20"
                image={data.image}
                containerRatio={0.7}
                href={'/characters/' + data.slug}
            />
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="line-clamp-2 text-sm leading-tight font-bold">
                        {data.name_ua || data.name_en || data.name_ja}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <MDViewer className="text-muted-foreground text-sm break-normal whitespace-normal md:line-clamp-3">
                            {data.description_ua}
                        </MDViewer>
                    </div>
                </div>
            </div>
            {characterAnime && (
                <div className="flex flex-col gap-2">
                    <ContentCard
                        className="w-10"
                        containerClassName="rounded-(--base-radius)"
                        image={characterAnime.anime.image}
                        containerRatio={0.7}
                        href={'/anime/' + characterAnime.anime.slug}
                    />
                </div>
            )}
        </div>
    );
};

const CharacterTooltip: FC<Props> = ({ slug, children }) => {
    if (!slug) {
        return null;
    }

    return (
        <HoverCardWrapper size="auto" content={<TooltipData slug={slug} />}>
            {children}
        </HoverCardWrapper>
    );
};

export default memo(CharacterTooltip);
