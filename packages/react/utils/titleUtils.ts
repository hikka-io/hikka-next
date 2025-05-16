/**
 * Title language options
 */
export type TitleLanguage =
    | 'title_en'
    | 'title_ja'
    | 'title_ua'
    | 'title_original';

/**
 * Name language options
 */
export type NameLanguage = 'name_en' | 'name_ja' | 'name_ua' | 'name_native';

/**
 * Default title language
 */
const DEFAULT_TITLE = 'title_ua';

/**
 * Default name language
 */
const DEFAULT_NAME = 'name_ua';

/**
 * Adds a 'title' property to an object based on the preferred language
 * with fallback to the first available title based on priority
 * If no title properties are found, falls back to name properties
 */
export function addTitleProperty<T extends Record<string, any>>(
    obj: T,
    defaultTitle: TitleLanguage = DEFAULT_TITLE,
    defaultName: NameLanguage = DEFAULT_NAME,
): T & { title: string } {
    // Priority order for fallback titles
    const titlePriority: TitleLanguage[] = [
        defaultTitle,
        'title_ua',
        'title_en',
        'title_original',
        'title_ja',
    ].filter(
        (title, index, self) => self.indexOf(title) === index,
    ) as TitleLanguage[]; // Remove duplicates

    // Priority order for fallback names
    const namePriority: NameLanguage[] = [
        defaultName,
        'name_ua',
        'name_en',
        'name_native',
        'name_ja',
    ].filter(
        (name, index, self) => self.indexOf(name) === index,
    ) as NameLanguage[]; // Remove duplicates

    // Find the first available title based on priority
    let titleValue: string | undefined;

    // First try title keys
    for (const titleKey of titlePriority) {
        if (obj[titleKey] && typeof obj[titleKey] === 'string') {
            titleValue = obj[titleKey];
            break;
        }
    }

    // If no title found, try name keys
    if (!titleValue) {
        for (const nameKey of namePriority) {
            if (obj[nameKey] && typeof obj[nameKey] === 'string') {
                titleValue = obj[nameKey];
                break;
            }
        }
    }

    // Return a new object with the title property added
    return {
        ...obj,
        title: titleValue || '',
    };
}

/**
 * Checks if an object has any title properties
 */
function hasTitleProperties(obj: Record<string, any>): boolean {
    return ['title_en', 'title_ja', 'title_ua', 'title_original'].some(
        (titleKey) => typeof obj[titleKey] === 'string',
    );
}

/**
 * Checks if an object has any name properties
 */
function hasNameProperties(obj: Record<string, any>): boolean {
    return ['name_en', 'name_ja', 'name_ua', 'name_native'].some(
        (nameKey) => typeof obj[nameKey] === 'string',
    );
}

/**
 * Checks if an object has any title or name properties
 */
function hasTitleOrNameProperties(obj: Record<string, any>): boolean {
    return hasTitleProperties(obj) || hasNameProperties(obj);
}

/**
 * Recursively adds 'title' properties to all nested objects that have any title or name language fields
 */
export function addDeepTitleProperties<T>(
    obj: T,
    defaultTitle: TitleLanguage = DEFAULT_TITLE,
    defaultName: NameLanguage = DEFAULT_NAME,
): T {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            addDeepTitleProperties(item, defaultTitle, defaultName),
        ) as unknown as T;
    }

    const result: Record<string, any> = {};

    // Process each property
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
        if (value && typeof value === 'object') {
            // Recursively process nested objects and arrays
            result[key] = addDeepTitleProperties(
                value,
                defaultTitle,
                defaultName,
            );
        } else {
            result[key] = value;
        }
    }

    // Add title property if the object has any title or name language fields
    if (hasTitleOrNameProperties(result)) {
        // Use the existing function to add the title property
        return addTitleProperty(
            result,
            defaultTitle,
            defaultName,
        ) as unknown as T;
    }

    return result as unknown as T;
}
