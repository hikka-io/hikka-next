import { useQuery } from '@tanstack/react-query';

import { type GenreResponse, genresOptions } from '@hikka/api';

function genreName(genre: GenreResponse) {
    return genre.name_ua || genre.name_en || genre.slug;
}

export function useGenres(enabled = true) {
    return useQuery({
        ...genresOptions(),
        enabled,
        staleTime: Number.POSITIVE_INFINITY,
        select: (data) => ({
            list: data.list,
            names: Object.fromEntries(
                data.list.map((genre) => [genre.slug, genreName(genre)]),
            ) as Record<string, string>,
        }),
    });
}
