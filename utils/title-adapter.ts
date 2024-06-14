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

export const convertManga = <TData extends API.MangaInfo | API.Manga>({
    titleLanguage,
    manga,
}: {
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
    manga: TData;
}): TData => {
    return {
        ...manga,
        title:
            manga[
                titleLanguage === 'title_ja' ? 'title_original' : titleLanguage
            ] ||
            manga.title_ua ||
            manga.title_en ||
            manga.title_original,
    };
};

export const convertMangaList = <TData extends API.MangaInfo | API.Manga>({
    manga,
    titleLanguage,
}: {
    manga: TData[];
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
}): TData[] => {
    return manga.map((manga) => convertManga({ titleLanguage, manga }));
};
