type MovieBanner = {
    slug: string;
    title: string;
    description: string;
    image?: string;
    duration: [number, number];
};

export const MOVIE_BANNERS: MovieBanner[] = [
    {
        slug: 'chainsaw-man-movie-reze-hen-c4febd',
        title: 'Вже ходили до кінотеатру?',
        description: 'Поділіться своїми враженнями!',
        duration: [1761166800, 1762387200],
    },
];
