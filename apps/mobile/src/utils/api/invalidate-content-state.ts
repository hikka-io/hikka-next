// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read, follow, notification, session, comment, vote and favourite writers are shared with the web through @hikka/core.
export {
    applyCommentVote,
    applyFavouriteDeletion,
    applyFavouriteMutation,
    applyFollowChange,
    applyNotificationsSeen,
    applyReadDeletion,
    applyReadMutation,
    applyVoteMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateComments,
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
