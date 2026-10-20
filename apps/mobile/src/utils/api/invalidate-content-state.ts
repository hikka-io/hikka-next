// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read and comment writers are shared with the web through @hikka/core.
export {
    applyCommentVote,
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateComments,
    invalidateReadState,
    invalidateWatchState,
    writeReadToCaches,
    writeWatchToCaches,
} from '@hikka/core';
