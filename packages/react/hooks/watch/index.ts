export {
    prefetchSearchUserWatches as prefetchWatchList,
    useSearchUserWatches as useWatchList,
} from './useSearchUserWatches';
export {
    prefetchUserWatchStats as prefetchWatchStats,
    useUserWatchStats as useWatchStats,
} from './useUserWatchStats';
export {
    prefetchWatchBySlug as prefetchWatchEntry,
    useWatchBySlug as useWatchEntry,
} from './useWatchBySlug';
export {
    prefetchWatchingUsers as prefetchFollowingWatchers,
    useWatchingUsers as useFollowingWatchers,
} from './useWatchingUsers';
export {
    useCreateWatch as useAddOrUpdateWatch,
    useDeleteWatch,
    useRandomWatchByStatus as useRandomAnime,
} from './useWatchMutations';
