export const isValidTitleLength = (
    title: string | null | undefined,
    { min, max }: { min: number; max: number },
) => !!title && title.trim().length >= min && title.length <= max;
