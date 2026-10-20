import type { FC } from 'react';

import type {
    CharacterAnimeResponse,
    CharacterMangaResponse,
    CharacterNovelResponse,
    CharacterVoiceResponse,
} from '@hikka/api';

import { EntityPoster, MediaPoster } from './appearance-cards';
import AppearanceSection from './appearance-section';
import {
    characterAnimeOptions,
    characterMangaOptions,
    characterNovelOptions,
    characterVoicesOptions,
    useAppearanceList,
} from './queries';

type Props = {
    slug: string;
};

const CharacterAnime: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<CharacterAnimeResponse>(
        characterAnimeOptions(slug),
    );

    return (
        <AppearanceSection
            title="Аніме"
            {...query}
            keyExtractor={(item) => item.anime.slug}
            renderItem={(item) => (
                <MediaPoster kind="anime" item={item.anime} />
            )}
        />
    );
};

const CharacterManga: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<CharacterMangaResponse>(
        characterMangaOptions(slug),
    );

    return (
        <AppearanceSection
            title="Манґа"
            {...query}
            keyExtractor={(item) => item.manga.slug}
            renderItem={(item) => (
                <MediaPoster kind="manga" item={item.manga} />
            )}
        />
    );
};

const CharacterNovel: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<CharacterNovelResponse>(
        characterNovelOptions(slug),
    );

    return (
        <AppearanceSection
            title="Ранобе"
            {...query}
            keyExtractor={(item) => item.novel.slug}
            renderItem={(item) => (
                <MediaPoster kind="novel" item={item.novel} />
            )}
        />
    );
};

const CharacterVoices: FC<Props> = ({ slug }) => {
    const query = useAppearanceList<CharacterVoiceResponse>(
        characterVoicesOptions(slug),
    );

    return (
        <AppearanceSection
            title="Сейю"
            {...query}
            skeletonDescription
            keyExtractor={(item) => item.person.slug + item.anime.slug}
            renderItem={(item) => (
                <EntityPoster
                    href="/people"
                    entity={item.person}
                    anime={item.anime}
                    leftSubtitle={item.language.toUpperCase()}
                />
            )}
        />
    );
};

export { CharacterAnime, CharacterManga, CharacterNovel, CharacterVoices };
