import {
    ImportReadListArgs,
    ImportWatchListArgs,
    ReadDeleteContenType,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for importing watch list
 */
export const useImportWatchList = createMutation({
    mutationFn: (client, args: ImportWatchListArgs) =>
        client.settings.importWatchList(args),
    invalidateQueries: () => [queryKeys.watch.all],
});

/**
 * Hook for importing read list
 */
export const useImportReadList = createMutation({
    mutationFn: (client, args: ImportReadListArgs) =>
        client.settings.importReadList(args),
    invalidateQueries: () => [queryKeys.read.all],
});

/**
 * Hook for exporting user lists
 */
export const useExportLists = createMutation({
    mutationFn: (client) => client.settings.export(),
    invalidateQueries: () => [],
});

/**
 * Hook for deleting watch list
 */
export const useDeleteWatchList = createMutation({
    mutationFn: (client) => client.settings.deleteWatchList(),
    invalidateQueries: () => [queryKeys.watch.all],
});

/**
 * Hook for deleting read list
 */
export const useDeleteReadList = createMutation({
    mutationFn: (client, contentType: ReadDeleteContenType) =>
        client.settings.deleteReadList(contentType),
    invalidateQueries: (contentType) => [
        ...(contentType === 'manga' ? [queryKeys.read.all] : []),
        ...(contentType === 'novel' ? [queryKeys.read.all] : []),
    ],
});
