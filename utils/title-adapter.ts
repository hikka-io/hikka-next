type TitleData = {
    title_en?: string;
    title_ua?: string;
    title_ja?: string;
    title_original?: string;
    name_ua?: string;
    name_en?: string;
    name_ja?: string;
    name_native?: string;
};

type TitleLanguage = keyof TitleData;

export const convertTitle = <TData>({
    data,
    titleLanguage,
}: {
    data: TData & TitleData;
    titleLanguage: TitleLanguage;
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
            data.title_original ||
            data.name_ua ||
            data.name_en ||
            data.name_ja ||
            data.name_native ||
            '',
    };
};

export const convertTitleList = <TData>({
    data,
    titleLanguage,
}: {
    data: (TData & TitleData)[];
    titleLanguage: TitleLanguage;
}) => {
    return data.map((entry) => convertTitle({ titleLanguage, data: entry }));
};

export const getTitle = <TData>({
    data,
    titleLanguage,
}: {
    data: TData & TitleData;
    titleLanguage: TitleLanguage;
}) => {
    return convertTitle({ data, titleLanguage }).title;
};
