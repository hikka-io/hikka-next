export const convertAnime = <TData extends API.AnimeInfo | API.Anime>({
    titleLanguage,
    anime,
}: {
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
    anime: TData;
}): TData => {
    return {
        ...anime,
        title:
            anime[titleLanguage] ||
            anime.title_ua ||
            anime.title_en ||
            anime.title_ja,
    };
};

export const convertAnimeList = <TData extends API.AnimeInfo | API.Anime>({
    anime,
    titleLanguage,
}: {
    anime: TData[];
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
}): TData[] => {
    return anime.map((anime) => convertAnime({ titleLanguage, anime }));
};
