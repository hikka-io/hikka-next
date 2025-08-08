import { SEASON } from './constants/common';

export default function getCurrentSeason() {
    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate() - 7);
    const currentMonth = adjustedDate.getMonth() + 1;
    return (Object.keys(SEASON) as Array<keyof typeof SEASON>).find((s) =>
        SEASON[s].params!.months.includes(currentMonth),
    );
}
