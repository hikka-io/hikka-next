/**
 * List entry dates are UTC-midnight unix seconds on the wire and a local calendar day in a
 * date picker, so the day the user picked is the day stored in every timezone.
 */
export const unixToLocalDate = (unix: number): Date => {
    const date = new Date(unix * 1000);
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
    );
};

export const localDateToUnix = (date: Date): number =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000;
