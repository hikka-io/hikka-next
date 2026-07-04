import { SeasonEnum } from '@hikka/api';

import { SEASON } from './constants/common';

export function getCurrentSeason() {
    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    const currentMonth = adjustedDate.getMonth() + 1;
    return (Object.keys(SEASON) as Array<keyof typeof SEASON>).find((s) =>
        SEASON[s].params!.months.includes(currentMonth),
    );
}

/**
 * Get season and year by offset from current season
 * @param offset - Number from -4 to 4, where 0 is current season
 * @returns [season, year] tuple
 */
export function getSeasonByOffset(offset: number): [SeasonEnum, number] {
    offset = Math.max(-4, Math.min(4, offset));

    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate() - 7);
    const currentMonth = adjustedDate.getMonth() + 1;
    const currentYear = adjustedDate.getFullYear();

    const currentSeason = (
        Object.keys(SEASON) as Array<keyof typeof SEASON>
    ).find((s) => SEASON[s].params!.months.includes(currentMonth));

    if (!currentSeason) {
        throw new Error('Could not determine current season');
    }

    const seasonOrder: SeasonEnum[] = [
        SeasonEnum.WINTER,
        SeasonEnum.SPRING,
        SeasonEnum.SUMMER,
        SeasonEnum.FALL,
    ];

    const currentSeasonIndex = seasonOrder.indexOf(currentSeason as SeasonEnum);

    const targetSeasonIndex = currentSeasonIndex + offset;
    const yearAdjustment = Math.floor(targetSeasonIndex / 4);
    const normalizedSeasonIndex = ((targetSeasonIndex % 4) + 4) % 4;

    const targetSeason = seasonOrder[normalizedSeasonIndex];
    const targetYear = currentYear + yearAdjustment;

    return [targetSeason, targetYear];
}
