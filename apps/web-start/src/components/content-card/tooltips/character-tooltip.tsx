import { type FC, memo, type PropsWithChildren } from 'react';

import { useQuery } from '@tanstack/react-query';

import { characterAnimeOptions, characterInfoOptions } from '@hikka/api';

import { useTitle } from '@/utils/title/use-title';

import MDViewer from '../../markdown/viewer/md-viewer';
import ContentCard from '../content-card';
import HoverCardWrapper from './hover-card-wrapper';
import { CharacterTooltipSkeleton } from './tooltip-skeleton';

type TooltipDataProps = {
    slug: string;
};

type Props = PropsWithChildren & {
    slug?: string;
};

const TooltipData: FC<TooltipDataProps> = ({ slug }) => {
    const { data } = useQuery(characterInfoOptions({ path: { slug } }));
    const { data: characterAnimeData } = useQuery(
        characterAnimeOptions({ path: { slug } }),
    );

    const characterAnime = characterAnimeData?.list
        ?.slice()
        .sort((a, b) => b.anime.score - a.anime.score)[0];

    const name = useTitle(data);

    if (!data) {
        return <CharacterTooltipSkeleton />;
    }

    return (
        <div className="flex w-96 gap-4 text-left">
            <ContentCard
                className="w-20"
                image={data.image}
                containerRatio={0.7}
                href={`/characters/${data.slug}`}
            />
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="line-clamp-2 font-bold text-sm leading-tight">
                        {name}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <MDViewer className="whitespace-normal break-normal text-muted-foreground text-sm md:line-clamp-3">
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
                        href={`/anime/${characterAnime.anime.slug}`}
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
