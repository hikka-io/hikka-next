import type { FC, ReactElement } from 'react';

import type {
    CharacterAnimeResponse,
    CharacterMangaResponse,
    CharacterNovelResponse,
    CharacterVoiceResponse,
    PersonAnimeResponse,
    PersonCharactersResponse,
    PersonMangaResponse,
    PersonNovelResponse,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { EntityPoster, MediaPoster } from './appearance-cards';
import AppearanceSection from './appearance-section';
import {
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from './queries';

type SectionConfig<T> = {
    list: EntityAppearanceList;
    title: string;
    skeletonDescription?: boolean;
    keyOf: (item: T) => string;
    render: (item: T) => ReactElement;
};

// The configs below are typed per item; the section only handles the erased shape.
const section = <T,>(config: SectionConfig<T>) =>
    config as unknown as SectionConfig<unknown>;

const ENTITY_SECTIONS: Record<EntityType, SectionConfig<unknown>[]> = {
    character: [
        section<CharacterAnimeResponse>({
            list: 'anime',
            title: 'Аніме',
            keyOf: (item) => item.anime.slug,
            render: (item) => <MediaPoster kind="anime" item={item.anime} />,
        }),
        section<CharacterMangaResponse>({
            list: 'manga',
            title: 'Манґа',
            keyOf: (item) => item.manga.slug,
            render: (item) => <MediaPoster kind="manga" item={item.manga} />,
        }),
        section<CharacterNovelResponse>({
            list: 'novel',
            title: 'Ранобе',
            keyOf: (item) => item.novel.slug,
            render: (item) => <MediaPoster kind="novel" item={item.novel} />,
        }),
        section<CharacterVoiceResponse>({
            list: 'voices',
            title: 'Сейю',
            skeletonDescription: true,
            keyOf: (item) => item.person.slug + item.anime.slug,
            render: (item) => (
                <EntityPoster
                    href="/people"
                    entity={item.person}
                    anime={item.anime}
                    leftSubtitle={item.language.toUpperCase()}
                />
            ),
        }),
    ],
    person: [
        section<PersonCharactersResponse>({
            list: 'voices',
            title: 'Персонажі',
            skeletonDescription: true,
            keyOf: (item) => item.character.slug + item.anime.slug,
            render: (item) => (
                <EntityPoster
                    href="/characters"
                    entity={item.character}
                    anime={item.anime}
                />
            ),
        }),
        section<PersonAnimeResponse>({
            list: 'anime',
            title: 'Аніме',
            skeletonDescription: true,
            keyOf: (item) => item.anime.slug,
            render: (item) => (
                <MediaPoster
                    kind="anime"
                    item={item.anime}
                    role={item.roles[0]}
                />
            ),
        }),
        section<PersonMangaResponse>({
            list: 'manga',
            title: 'Манґа',
            skeletonDescription: true,
            keyOf: (item) => item.manga.slug,
            render: (item) => (
                <MediaPoster
                    kind="manga"
                    item={item.manga}
                    role={item.roles[0]}
                />
            ),
        }),
        section<PersonNovelResponse>({
            list: 'novel',
            title: 'Ранобе',
            skeletonDescription: true,
            keyOf: (item) => item.novel.slug,
            render: (item) => (
                <MediaPoster
                    kind="novel"
                    item={item.novel}
                    role={item.roles[0]}
                />
            ),
        }),
    ],
};

type Props = {
    type: EntityType;
    config: SectionConfig<unknown>;
    slug: string;
};

const EntitySection: FC<Props> = ({ type, config, slug }) => {
    const query = useInfiniteList<unknown>(
        entityAppearanceOptions(type, config.list, slug),
    );

    return (
        <AppearanceSection
            title={config.title}
            {...query}
            skeletonDescription={config.skeletonDescription}
            keyExtractor={config.keyOf}
            renderItem={config.render}
        />
    );
};

export const entitySections = (type: EntityType, slug: string) =>
    ENTITY_SECTIONS[type].map((config) => (
        <EntitySection
            key={config.list}
            type={type}
            config={config}
            slug={slug}
        />
    ));
