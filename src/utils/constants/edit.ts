export const ANIME_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'title_ua',
            title: 'Українською',
            placeholder: 'Введіть назву українською',
            type: 'input',
        },
        {
            slug: 'title_en',
            title: 'Англійською',
            placeholder: 'Введіть назву англійською',
            type: 'input',
        },
        {
            slug: 'title_ja',
            title: 'Першоджерела',
            placeholder: 'Введіть назву першоджерела',
            type: 'input',
        },
    ],

    synopsis: [
        {
            slug: 'synopsis_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
        {
            slug: 'synopsis_en',
            title: 'Англійською',
            placeholder: 'Введіть опис англійською',
            type: 'markdown',
        },
    ],
    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const ANIME_EDIT_GROUPS: Record<string, string> = {
    title: 'Назва',
    synopsis: 'Опис',
    synonyms: 'Синоніми',
};

export const MANGA_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'title_ua',
            title: 'Українською',
            placeholder: 'Введіть назву українською',
            type: 'input',
        },
        {
            slug: 'title_en',
            title: 'Англійською',
            placeholder: 'Введіть назву англійською',
            type: 'input',
        },
        {
            slug: 'title_original',
            title: 'Першоджерела',
            placeholder: 'Введіть назву першоджерела',
            type: 'input',
        },
    ],

    synopsis: [
        {
            slug: 'synopsis_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
        {
            slug: 'synopsis_en',
            title: 'Англійською',
            placeholder: 'Введіть опис англійською',
            type: 'markdown',
        },
    ],
    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const MANGA_EDIT_GROUPS: Record<string, string> = {
    title: 'Назва',
    synopsis: 'Опис',
    synonyms: 'Синоніми',
};

export const NOVEL_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'title_ua',
            title: 'Українською',
            placeholder: 'Введіть назву українською',
            type: 'input',
        },
        {
            slug: 'title_en',
            title: 'Англійською',
            placeholder: 'Введіть назву англійською',
            type: 'input',
        },
        {
            slug: 'title_original',
            title: 'Першоджерела',
            placeholder: 'Введіть назву першоджерела',
            type: 'input',
        },
    ],

    synopsis: [
        {
            slug: 'synopsis_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
        {
            slug: 'synopsis_en',
            title: 'Англійською',
            placeholder: 'Введіть опис англійською',
            type: 'markdown',
        },
    ],
    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const NOVEL_EDIT_GROUPS: Record<string, string> = {
    title: 'Назва',
    synopsis: 'Опис',
    synonyms: 'Синоніми',
};

export const EDIT_PARAMS: Record<
    | keyof Hikka.AnimeEditParams
    | keyof Hikka.MangaEditParams
    | keyof Hikka.NovelEditParams
    | keyof Hikka.CharacterEditParams
    | keyof Hikka.PersonEditParams,
    string
> = {
    name_ua: 'Імʼя UA',
    name_en: 'Імʼя EN',
    name_ja: 'Імʼя JA',
    description_ua: 'Опис UA',
    synonyms: 'Синоніми',
    title_ua: 'Назва UA',
    title_en: 'Назва EN',
    title_ja: 'Назва JA',
    title_original: 'Назва JA',
    synopsis_ua: 'Опис UA',
    synopsis_en: 'Опис EN',
    name_native: 'Назва першоджерела',
};

export const CHARACTER_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'name_ua',
            title: 'Українською',
            placeholder: 'Введіть імʼя українською',
            type: 'input',
        },
        {
            slug: 'name_en',
            title: 'Англійською',
            placeholder: 'Введіть імʼя англійською',
            type: 'input',
        },
        {
            slug: 'name_ja',
            title: 'Першоджерела',
            placeholder: 'Введіть імʼя першоджерела',
            type: 'input',
        },
    ],

    description: [
        {
            slug: 'description_ua',
            title: 'Українською',
            placeholder: 'Введіть опис українською',
            type: 'markdown',
        },
    ],

    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const CHARACTER_EDIT_GROUPS: Record<string, string> = {
    title: 'Імʼя',
    description: 'Опис',
    synonyms: 'Синоніми',
};

export const PERSON_EDIT_PARAMS: Record<string, Hikka.EditParam[]> = {
    title: [
        {
            slug: 'name_ua',
            title: 'Українською',
            placeholder: 'Введіть імʼя українською',
            type: 'input',
        },
        {
            slug: 'name_en',
            title: 'Англійською',
            placeholder: 'Введіть імʼя англійською',
            type: 'input',
        },
        {
            slug: 'name_native',
            title: 'Рідною',
            placeholder: 'Введіть імʼя першоджерела',
            type: 'input',
        },
    ],

    synonyms: [
        {
            slug: 'synonyms',
            title: 'Синонім',
            placeholder: 'Введіть новий синонім',
            type: 'list',
        },
    ],
};

export const PERSON_EDIT_GROUPS: Record<string, string> = {
    title: 'Імʼя',
    synonyms: 'Синоніми',
};
export const EDIT_STATUS: Hikka.FilterProperty<API.EditStatus> = {
    pending: {
        title_ua: 'На Розгляді',
        title_en: 'Pending',
        color: '#AB872B',
    },
    accepted: {
        title_ua: 'Прийнято',
        title_en: 'Accepted',
        color: '#518146',
    },
    denied: {
        title_ua: 'Відхилено',
        title_en: 'Denied',
        color: '#952828',
    },
    closed: {
        title_ua: 'Закрито',
        title_en: 'Closed',
        color: '#5C5C5C',
    },
};
