// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. The watch/read and vote writers are shared with the web through @hikka/core.
export {
    applyReadDeletion,
    applyReadMutation,
    applyVoteMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateReadState,
    invalidateWatchState,
    writeReadToCaches,
    writeWatchToCaches,
} from '@hikka/core';
