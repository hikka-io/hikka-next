type TitleData = {
    title_en?: string;
    title_ua?: string;
    title_ja?: string;
    title_original?: string;
};

export const convertTitle = <TData>({
    data,
    titleLanguage,
}: {
    data: TData & TitleData;
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
}) => {
    return {
        ...data,
        title:
            data[titleLanguage] ||
            data[
                titleLanguage === 'title_ja' ? 'title_original' : 'title_ja'
            ] ||
            data.title_ua ||
            data.title_en ||
            data.title_ja ||
            data.title_original,
    };
};

export const convertTitleList = <TData>({
    data,
    titleLanguage,
}: {
    data: (TData & TitleData)[];
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
}) => {
    return data.map((entry) => convertTitle({ titleLanguage, data: entry }));
};
