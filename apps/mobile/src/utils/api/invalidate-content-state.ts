// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read, follow and notification writers are shared with the web through @hikka/core.
export {
    applyFollowChange,
    applyNotificationsSeen,
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateReadState,
    invalidateWatchState,
    writeReadToCaches,
    writeWatchToCaches,
} from '@hikka/core';
