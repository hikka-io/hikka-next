// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read and follow writers are shared with the web through @hikka/core.
export {
    applyFollowChange,
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateReadState,
    invalidateWatchState,
    writeReadToCaches,
    writeWatchToCaches,
} from '@hikka/core';
