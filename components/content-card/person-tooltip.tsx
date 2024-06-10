'use client';

import { FC, PropsWithChildren, memo } from 'react';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

import ContentCard from '@/components/content-card/content-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';

import { PersonAnime } from '@/services/api/people/getPersonAnime';
import { PersonCharacter } from '@/services/api/people/getPersonCharacters';
import usePersonAnime from '@/services/hooks/people/use-person-anime';
import usePersonCharacters from '@/services/hooks/people/use-person-characters';
import usePersonInfo from '@/services/hooks/people/use-person-info';

interface TooltipDataProps {
    slug: string;
}

interface Props extends PropsWithChildren {
    slug?: string;
    withTrigger?: boolean;
}

const PersonAnimeList: FC<{ list?: PersonAnime[]; slug: string }> = ({
    list,
    slug,
}) => {
    if (!list || list.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Роботи</Label>

            <div className="flex gap-2">
                {list.slice(0, 5).map(({ anime }) => (
                    <ContentCard
                        className="w-10"
                        href={`/anime/${anime.slug}`}
                        key={anime.slug}
                        poster={anime.poster}
                        slug={anime.slug}
                        content_type={anime.data_type}
                        containerRatio={0.7}
                    />
                ))}
                {list.length > 5 && (
                    <ContentCard
                        className="w-10"
                        href={`/people/${slug}`}
                        poster={
                            <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                        }
                        containerRatio={0.7}
                    />
                )}
            </div>
        </div>
    );
};

const PersonCharactersList: FC<{ list?: PersonCharacter[]; slug: string }> = ({
    list,
    slug,
}) => {
    if (!list || list.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Ролі</Label>

            <div className="flex gap-2">
                {list.slice(0, 5).map(({ character }) => (
                    <ContentCard
                        className="w-10"
                        href={`/characters/${character.slug}`}
                        key={character.slug}
                        poster={character.image}
                        slug={character.slug}
                        content_type={character.data_type}
                        containerRatio={0.7}
                    />
                ))}
                {list.length > 5 && (
                    <ContentCard
                        className="w-10"
                        href={`/people/${slug}`}
                        poster={
                            <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                        }
                        containerRatio={0.7}
                    />
                )}
            </div>
        </div>
    );
};

const TooltipData: FC<TooltipDataProps> = ({ slug }) => {
    const { data } = usePersonInfo({ slug });
    const { list: anime } = usePersonAnime(
        { slug },
        {
            enabled:
                data && data.characters_count === 0 && data.anime_count > 0,
        },
    );
    const { list: characters } = usePersonCharacters(
        { slug },
        {
            enabled: data && data.characters_count > 0,
        },
    );

    if (!data || (!anime && !characters)) {
        return (
            <div className="flex w-96 animate-pulse gap-4 text-left">
                <div className="h-28 w-20 rounded-lg bg-secondary/60" />
                <div className="flex w-full flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full flex-1 flex-col gap-2">
                            <div className="h-5 w-20 rounded-lg bg-secondary/60" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="h-3 w-1/4 rounded-lg bg-secondary/60" />
                    </div>

                    <div className="flex gap-2">
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                        <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-96 gap-4 text-left">
            <ContentCard
                className="w-20"
                poster={data.image}
                containerRatio={0.7}
                href={`/people/${data.slug}`}
            />

            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {data.name_ua || data.name_en || data.name_native}
                    </Label>
                </div>
                <div className="flex flex-col gap-2">
                    <MDViewer className="whitespace-normal break-normal text-sm text-muted-foreground md:line-clamp-3">
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

const PersonTooltip: FC<Props> = ({
    slug,
    children,
    withTrigger,
    ...props
}) => {
    if (!slug) return null;

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden min-w-min flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData slug={slug} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(PersonTooltip);
