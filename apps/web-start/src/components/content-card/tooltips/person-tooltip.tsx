'use client';

import { PersonAnimeResponse, PersonCharactersResponse } from '@hikka/client';
import {
    usePersonAnime,
    usePersonBySlug,
    usePersonCharacters,
} from '@hikka/react';
import { FC, PropsWithChildren, memo } from 'react';

import MaterialSymbolsMoreHoriz from '../../icons/material-symbols/MaterialSymbolsMoreHoriz';
import MDViewer from '../../markdown/viewer/MD-viewer';
import ContentCard from '../content-card';
import HoverCardWrapper from './hover-card-wrapper';
import { PersonTooltipSkeleton } from './tooltip-skeleton';

interface TooltipDataProps {
    slug: string;
}

interface Props extends PropsWithChildren {
    slug?: string;
}

const PersonAnimeList: FC<{ list?: PersonAnimeResponse[]; slug: string }> = ({
    list,
    slug,
}) => {
    if (!list || list.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm leading-tight font-medium">
                Роботи
            </span>
            <div className="flex gap-2">
                {list.slice(0, 5).map(({ anime }) => (
                    <ContentCard
                        containerClassName="rounded-(--base-radius)"
                        className="w-10"
                        href={`/anime/${anime.slug}`}
                        key={anime.slug}
                        image={anime.image}
                        slug={anime.slug}
                        content_type={anime.data_type}
                        containerRatio={0.7}
                    />
                ))}
                {list.length > 5 && (
                    <ContentCard
                        containerClassName="rounded-(--base-radius)"
                        className="w-10"
                        href={`/people/${slug}`}
                        image={
                            <MaterialSymbolsMoreHoriz className="text-muted-foreground text-4xl" />
                        }
                        containerRatio={0.7}
                    />
                )}
            </div>
        </div>
    );
};

const PersonCharactersList: FC<{
    list?: PersonCharactersResponse[];
    slug: string;
}> = ({ list, slug }) => {
    if (!list || list.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm leading-tight font-medium">
                Ролі
            </span>
            <div className="flex gap-2">
                {list.slice(0, 5).map(({ character }) => (
                    <ContentCard
                        className="w-10"
                        href={`/characters/${character.slug}`}
                        key={character.slug}
                        image={character.image}
                        slug={character.slug}
                        content_type={character.data_type}
                        containerRatio={0.7}
                    />
                ))}
                {list.length > 5 && (
                    <ContentCard
                        className="w-10"
                        href={`/people/${slug}`}
                        image={
                            <MaterialSymbolsMoreHoriz className="text-muted-foreground text-4xl" />
                        }
                        containerRatio={0.7}
                    />
                )}
            </div>
        </div>
    );
};

const TooltipData: FC<TooltipDataProps> = ({ slug }) => {
    const { data } = usePersonBySlug({ slug });
    const { list: anime } = usePersonAnime({
        slug,
        options: {
            enabled:
                data && data.characters_count === 0 && data.anime_count > 0,
        },
    });
    const { list: characters } = usePersonCharacters({
        slug,
        options: {
            enabled: data && data.characters_count > 0,
        },
    });

    if (!data || (!anime && !characters)) {
        return <PersonTooltipSkeleton />;
    }

    return (
        <div className="flex w-96 gap-4 text-left">
            <ContentCard
                className="w-20"
                image={data.image}
                containerRatio={0.7}
                href={`/people/${data.slug}`}
            />
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="line-clamp-2 text-sm leading-tight font-bold">
                        {data.name_ua || data.name_en || data.name_native}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <MDViewer className="text-muted-foreground text-sm break-normal whitespace-normal md:line-clamp-3">
                        {data.description_ua}
                    </MDViewer>
                    {data.characters_count === 0 && (
                        <PersonAnimeList list={anime} slug={data.slug} />
                    )}
                    <PersonCharactersList list={characters} slug={data.slug} />
                </div>
            </div>
        </div>
    );
};

const PersonTooltip: FC<Props> = ({ slug, children }) => {
    if (!slug) return null;

    return (
        <HoverCardWrapper size="auto" content={<TooltipData slug={slug} />}>
            {children}
        </HoverCardWrapper>
    );
};

export default memo(PersonTooltip);
