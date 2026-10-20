import type { FC } from 'react';

import type {
    PersonAnimeResponse,
    PersonCharactersResponse,
    PersonMangaResponse,
    PersonNovelResponse,
} from '@hikka/api';

import { EntityPoster, MediaPoster } from './appearance-cards';
import AppearanceSection from './appearance-section';
import {
    personAnimeOptions,
    personMangaOptions,
    personNovelOptions,
    personVoicesOptions,
    useAppearanceList,
} from './queries';

type Props = {
    slug: string;
};

const PersonCharacters: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<PersonCharactersResponse>(
        personVoicesOptions(slug),
    );

    return (
        <AppearanceSection
            title="Персонажі"
            {...query}
            skeletonDescription
            keyExtractor={(item) => item.character.slug + item.anime.slug}
            renderItem={(item) => (
                <EntityPoster
                    href="/characters"
                    entity={item.character}
                    anime={item.anime}
                />
            )}
        />
    );
};

const PersonAnime: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<PersonAnimeResponse>(
        personAnimeOptions(slug),
    );

    return (
        <AppearanceSection
            title="Аніме"
            {...query}
            skeletonDescription
            keyExtractor={(item) => item.anime.slug}
            renderItem={(item) => (
                <MediaPoster
                    kind="anime"
                    item={item.anime}
                    role={item.roles[0]}
                />
            )}
        />
    );
};

const PersonManga: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<PersonMangaResponse>(
        personMangaOptions(slug),
    );

    return (
        <AppearanceSection
            title="Манґа"
            {...query}
            skeletonDescription
            keyExtractor={(item) => item.manga.slug}
            renderItem={(item) => (
                <MediaPoster
                    kind="manga"
                    item={item.manga}
                    role={item.roles[0]}
                />
            )}
        />
    );
};

const PersonNovel: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<PersonNovelResponse>(
        personNovelOptions(slug),
    );

    return (
        <AppearanceSection
            title="Ранобе"
            {...query}
            skeletonDescription
            keyExtractor={(item) => item.novel.slug}
            renderItem={(item) => (
                <MediaPoster
                    kind="novel"
                    item={item.novel}
                    role={item.roles[0]}
                />
            )}
        />
    );
};

export { PersonAnime, PersonCharacters, PersonManga, PersonNovel };
