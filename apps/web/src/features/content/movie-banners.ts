type MovieBanner = {
    slug: string;
    title: string;
    description: string;
    image?: string;
    duration: [number, number];
};

export const MOVIE_BANNERS: MovieBanner[] = [];

export function findMovieBanner(
    slug: string | undefined,
    timestamp: number,
    banners: readonly MovieBanner[] = MOVIE_BANNERS,
): MovieBanner | undefined {
    return banners.find(
        (banner) =>
            banner.slug === slug &&
            banner.duration[0] <= timestamp &&
            banner.duration[1] >= timestamp,
    );
}
