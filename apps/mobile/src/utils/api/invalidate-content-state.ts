// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read, follow, notification, session and vote writers are shared with the web through @hikka/core.
export {
    applyFollowChange,
    applyNotificationsSeen,
    applyReadDeletion,
    applyReadMutation,
    applyVoteMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateReadState,
    invalidateSession,
    invalidateSessionUI,
    invalidateUserProfile,
    invalidateWatchState,
    writeIgnoredNotifications,
    writeReadToCaches,
    writeSessionUI,
    writeWatchToCaches,
} from '@hikka/core';
