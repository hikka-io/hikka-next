import type { FC } from 'react';

import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { AppPeopleSchemasRoleResponse, PersonResponse } from '@hikka/api';
import {
    DEFAULT_CONTAINER_RATIO,
    getMediaTypeLabel,
    getTitle,
} from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import Image from '@/components/ui/image';
import { presetForWidth, presetImageUrl } from '@/utils/image-presets';

import PersonPlaceholder from './person-placeholder';

type MediaKind = 'anime' | 'manga' | 'novel';

type MediaItem = {
    slug: string;
    image: string | null;
    year: number | null;
    media_type: string | null;
};

type MediaPosterProps = {
    kind: MediaKind;
    item: MediaItem;
    role?: AppPeopleSchemasRoleResponse;
};

const MediaPoster: FC<MediaPosterProps> = ({ kind, item, role }) => (
    <PosterCard
        href={`/${kind}/${item.slug}`}
        title={getTitle(item)}
        image={item.image ?? undefined}
        description={role ? getTitle(role) : undefined}
        leftSubtitle={item.year ? String(item.year) : undefined}
        rightSubtitle={getMediaTypeLabel(item.media_type)}
    />
);

type AnimeOverlayProps = {
    anime: { slug: string; image: string | null };
};

const AnimeOverlay: FC<AnimeOverlayProps> = ({ anime }) => (
    <View pointerEvents="box-none" className="absolute right-1.5 bottom-1.5">
        <Link href={`/anime/${anime.slug}`} asChild>
            <Pressable
                accessibilityRole="link"
                accessibilityLabel={getTitle(anime)}
                style={{ aspectRatio: DEFAULT_CONTAINER_RATIO }}
                className="w-11 overflow-hidden rounded-md border-2 border-background bg-muted active:opacity-70"
            >
                {anime.image && (
                    <Image
                        source={presetImageUrl(anime.image, presetForWidth(44))}
                        contentFit="cover"
                        accessibilityIgnoresInvertColors
                        className="size-full"
                    />
                )}
            </Pressable>
        </Link>
    </View>
);

type PersonFields = Pick<PersonResponse, 'name_native' | 'name_en' | 'name_ua'>;

type EntityItem = {
    slug: string;
    image: string | null;
};

type EntityPosterProps = {
    href: '/characters' | '/people';
    entity: EntityItem & Partial<PersonFields> & Record<string, unknown>;
    anime: AnimeOverlayProps['anime'] & Record<string, unknown>;
    leftSubtitle?: string;
};

const EntityPoster: FC<EntityPosterProps> = ({
    href,
    entity,
    anime,
    leftSubtitle,
}) => (
    <PosterCard
        href={`${href}/${entity.slug}`}
        title={getTitle(entity)}
        description={getTitle(anime)}
        leftSubtitle={leftSubtitle}
        image={
            entity.image ??
            (href === '/people' ? (
                <PersonPlaceholder person={entity} />
            ) : undefined)
        }
        overlay={<AnimeOverlay anime={anime} />}
    />
);

export { EntityPoster, MediaPoster };
