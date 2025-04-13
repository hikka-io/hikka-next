import { SEASON } from './constants/common';

export default function getCurrentSeason() {
    const currentMonth = new Date().getMonth() + 1;
    return (Object.keys(SEASON) as Array<keyof typeof SEASON>).find((s) =>
        SEASON[s].params!.months.includes(currentMonth),
    );
}
