type TitleData = {
    title?: string;
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

// Title fields in order of fallback priority
const TITLE_PRIORITY_ORDER: TitleLanguage[] = [
    'title',
    // titleLanguage is inserted here dynamically
    'title_ua',
    'title_ja',
    'title_original',
    'title_en',
    'name_ua',
    'name_en',
    'name_ja',
    'name_native',
];

// Title-related keys for property detection
const TITLE_KEYS = [
    'title',
    'title_en',
    'title_ua',
    'title_ja',
    'title_original',
    'name_ua',
    'name_en',
    'name_ja',
    'name_native',
] as const;

/**
 * Finds the best available title based on priority and language preference
 */
const findBestTitle = <T extends Partial<TitleData>>(
    data: T,
    titleLanguage: TitleLanguage,
): string => {
    // Create a custom priority list with the preferred language prioritized
    const priorityWithLanguage = [
        ...TITLE_PRIORITY_ORDER.slice(0, 1),
        titleLanguage,
        ...TITLE_PRIORITY_ORDER.slice(1),
    ];

    // Alternative field if titleLanguage is 'title_ja'
    const alternateField: TitleLanguage =
        titleLanguage === 'title_ja' ? 'title_original' : 'title_ja';

    // Find the first available title in priority order
    for (const key of priorityWithLanguage) {
        if (key === titleLanguage && data[alternateField]) {
            return data[alternateField] as string;
        }

        if (data[key]) {
            return data[key] as string;
        }
    }

    return '';
};

/**
 * Converts a single object's title based on language preference
 */
export const convertTitle = <TData>({
    data,
    titleLanguage,
}: {
    data: TData & Partial<TitleData>;
    titleLanguage: TitleLanguage;
}): TData & { title: string } => {
    return {
        ...data,
        title: findBestTitle(data, titleLanguage),
    };
};

/**
 * Converts titles for an array of objects
 */
export const convertTitleList = <TData>({
    data,
    titleLanguage,
}: {
    data: (TData & Partial<TitleData>)[];
    titleLanguage: TitleLanguage;
}): (TData & { title: string })[] => {
    return data.map((entry) => convertTitle({ data: entry, titleLanguage }));
};

/**
 * Extracts just the title from an object after conversion
 */
export const getTitle = <TData>({
    data,
    titleLanguage,
}: {
    data: TData & Partial<TitleData>;
    titleLanguage: TitleLanguage;
}): string => {
    return findBestTitle(data, titleLanguage);
};

/**
 * Checks if an object has any title-related properties
 */
const hasTitleProperties = (obj: Record<string, any>): boolean => {
    return TITLE_KEYS.some((key) => key in obj);
};

/**
 * Recursively converts titles in deeply nested objects
 */
export const convertTitleDeep = <TData>({
    data,
    titleLanguage,
}: {
    data: TData;
    titleLanguage: TitleLanguage;
}): TData => {
    // Handle primitive values and null/undefined
    if (!data || typeof data !== 'object') {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map((item) =>
            convertTitleDeep({
                data: item,
                titleLanguage,
            }),
        ) as unknown as TData;
    }

    // Create a copy of the object
    const result = { ...data };

    // Apply title conversion if needed
    if (hasTitleProperties(data as Record<string, any>)) {
        Object.assign(
            result,
            convertTitle({
                data: data as any,
                titleLanguage,
            }),
        );
    }

    // Recursively process all object properties
    for (const key in result) {
        if (result[key] && typeof result[key] === 'object') {
            result[key] = convertTitleDeep({
                data: result[key],
                titleLanguage,
            });
        }
    }

    return result as TData;
};
