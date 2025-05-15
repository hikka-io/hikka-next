/**
 * Title language options
 */
export type TitleLanguage =
    | 'title_en'
    | 'title_ja'
    | 'title_ua'
    | 'title_original';

/**
 * Adds a 'title' property to an object based on the preferred language
 * with fallback to the first available title based on priority
 */
export function addTitleProperty<T extends Record<string, any>>(
    obj: T,
    defaultTitle: TitleLanguage = 'title_en',
): T & { title: string } {
    // Priority order for fallback
    const titlePriority: TitleLanguage[] = [
        defaultTitle,
        'title_en',
        'title_original',
        'title_ja',
        'title_ua',
    ].filter(
        (title, index, self) => self.indexOf(title) === index,
    ) as TitleLanguage[]; // Remove duplicates

    // Find the first available title based on priority
    let titleValue: string | undefined;

    for (const titleKey of titlePriority) {
        if (obj[titleKey] && typeof obj[titleKey] === 'string') {
            titleValue = obj[titleKey];
            break;
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
 * Recursively adds 'title' properties to all nested objects that have any title language fields
 */
export function addDeepTitleProperties<T>(
    obj: T,
    defaultTitle: TitleLanguage = 'title_en',
): T {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            addDeepTitleProperties(item, defaultTitle),
        ) as unknown as T;
    }

    const result: Record<string, any> = {};

    // Process each property
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
        if (value && typeof value === 'object') {
            // Recursively process nested objects and arrays
            result[key] = addDeepTitleProperties(value, defaultTitle);
        } else {
            result[key] = value;
        }
    }

    // Add title property if the object has any title language fields
    if (hasTitleProperties(result)) {
        // Use the existing function to add the title property
        return addTitleProperty(result, defaultTitle) as unknown as T;
    }

    return result as unknown as T;
}
