import type {
    ReadResponseBase,
    UserResponseWithRead,
    UserResponseWithWatch,
    WatchResponseBase,
} from '@hikka/api';

import { LIST_STATUS } from './labels';

export type FollowingUser = UserResponseWithWatch | UserResponseWithRead;

export type FollowingSummary = {
    status: string;
    /** "12 еп." / "40 розд.", left out for completed and planned entries. */
    progress: string | null;
    score: number;
};

const HIDDEN_PROGRESS_STATUSES: readonly string[] = ['completed', 'planned'];

/** The list entry of a followed user who tracks the title, as the content page's "Відстежується" row shows it. */
export function followingSummary(user: FollowingUser): FollowingSummary | null {
    const watch = 'watch' in user;
    const entry: WatchResponseBase | ReadResponseBase | undefined = watch
        ? user.watch[0]
        : user.read[0];

    if (!entry) return null;

    const labels = (watch ? LIST_STATUS.watch : LIST_STATUS.read) as Record<
        string,
        { title_ua: string } | undefined
    >;
    const count = watch
        ? (entry as WatchResponseBase).episodes
        : (entry as ReadResponseBase).chapters;

    return {
        status: labels[entry.status]?.title_ua ?? entry.status,
        progress:
            count > 0 && !HIDDEN_PROGRESS_STATUSES.includes(entry.status)
                ? `${count} ${watch ? 'еп.' : 'розд.'}`
                : null,
        score: entry.score,
    };
}
