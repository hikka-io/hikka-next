// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read lists and writers are shared with the web through @hikka/core.
// The session writers (profile, UI customization, ignored notifications) are shared with the web too.
export {
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
