// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read, follow, notification and session writers are shared with the web through @hikka/core.
export {
    applyFollowChange,
    applyNotificationsSeen,
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateReadState,
    invalidateSession,
    invalidateUserProfile,
    invalidateWatchState,
    writeIgnoredNotifications,
    writeReadToCaches,
    writeSessionUI,
    writeWatchToCaches,
} from '@hikka/core';
