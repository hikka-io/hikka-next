import { type FC, memo, type PropsWithChildren } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type ContentTypeEnum,
    type PersonAnimeResponse,
    type PersonCharactersResponse,
    personAnimeOptions,
    personInfoOptions,
    personVoicesOptions,
} from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';

import MaterialSymbolsMoreHoriz from '../../icons/material-symbols/MaterialSymbolsMoreHoriz';
import MDViewer from '../../markdown/viewer/md-viewer';
import ContentCard from '../content-card';
import HoverCardWrapper from './hover-card-wrapper';
import { PersonTooltipSkeleton } from './tooltip-skeleton';

type TooltipDataProps = {
    slug: string;
};

type Props = PropsWithChildren & {
    slug?: string;
};

const PersonAnimeList: FC<{ list?: PersonAnimeResponse[]; slug: string }> = ({
    list,
    slug,
}) => {
    if (!list || list.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <span className="font-medium text-muted-foreground text-sm leading-tight">
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
                        content_type={anime.data_type as ContentTypeEnum}
                        containerRatio={0.7}
                    />
                ))}
                {list.length > 5 && (
                    <ContentCard
                        containerClassName="rounded-(--base-radius)"
                        className="w-10"
                        href={`/people/${slug}`}
                        image={
                            <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
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
            <span className="font-medium text-muted-foreground text-sm leading-tight">
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
                        content_type={character.data_type as ContentTypeEnum}
                        containerRatio={0.7}
                    />
                ))}
                {list.length > 5 && (
                    <ContentCard
                        className="w-10"
                        href={`/people/${slug}`}
                        image={
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
    const { data } = useQuery(personInfoOptions({ path: { slug } }));
    const { data: animeData } = useQuery({
        ...personAnimeOptions({ path: { slug } }),
        enabled: Boolean(
            data && data.characters_count === 0 && data.anime_count > 0,
        ),
    });
    const { data: charactersData } = useQuery({
        ...personVoicesOptions({ path: { slug } }),
        enabled: Boolean(data && data.characters_count > 0),
    });

    const anime = animeData?.list;
    const characters = charactersData?.list;

    const name = useTitle(data);

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
                    <span className="line-clamp-2 font-bold text-sm leading-tight">
                        {name}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <MDViewer className="whitespace-normal break-normal text-muted-foreground text-sm md:line-clamp-3">
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
