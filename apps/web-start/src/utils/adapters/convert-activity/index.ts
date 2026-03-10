import {
    HistoryFavouriteData,
    HistoryReadData,
    HistoryReadImportData,
    HistoryResponse,
    HistoryTypeEnum,
    HistoryWatchData,
    HistoryWatchImportData,
} from '@hikka/client';

import { createFavoriteEvents } from './convert-favorite-activity';
import { createImportEvents } from './convert-import-activity';
import { createReadEvents } from './convert-read-activity';
import { createWatchEvents } from './convert-watch-activity';

export const convertActivity = (
    history: HistoryResponse<
        | HistoryReadData
        | HistoryWatchData
        | HistoryWatchImportData
        | HistoryReadImportData
        | HistoryFavouriteData
    >,
) => {
    switch (history.history_type) {
        case HistoryTypeEnum.WATCH:
        case HistoryTypeEnum.WATCH_DELETE:
            return createWatchEvents(
                history.history_type,
                history.data as HistoryWatchData,
            );
        case HistoryTypeEnum.READ_NOVEL:
        case HistoryTypeEnum.READ_NOVEL_DELETE:
        case HistoryTypeEnum.READ_MANGA:
        case HistoryTypeEnum.READ_MANGA_DELETE:
            return createReadEvents(
                history.history_type,
                history.data as HistoryReadData,
            );
        case HistoryTypeEnum.WATCH_IMPORT:
        case HistoryTypeEnum.READ_IMPORT:
            return createImportEvents(
                history.history_type,
                history.data as HistoryWatchImportData | HistoryReadImportData,
            );
        case HistoryTypeEnum.FAVOURITE_ANIME_ADD:
        case HistoryTypeEnum.FAVOURITE_ANIME_REMOVE:
        case HistoryTypeEnum.FAVOURITE_MANGA_ADD:
        case HistoryTypeEnum.FAVOURITE_MANGA_REMOVE:
        case HistoryTypeEnum.FAVOURITE_NOVEL_ADD:
        case HistoryTypeEnum.FAVOURITE_NOVEL_REMOVE:
            return createFavoriteEvents(history.history_type);
        default:
            return [];
    }
};
