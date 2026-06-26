import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';

import { createFavoriteEvents } from './convert-favorite-activity';
import { createImportEvents } from './convert-import-activity';
import { createReadEvents } from './convert-read-activity';
import { createWatchEvents } from './convert-watch-activity';

// @hikka/api types `HistoryResponse.data` as a loose `{ [key]: unknown }`, so
// narrow it per `history_type` to the shape each sibling handler expects
// (those shapes are local to the handler files; mirror @hikka/client history data).
export const convertActivity = (history: HistoryResponse) => {
    switch (history.history_type) {
        case HistoryTypeEnum.WATCH:
        case HistoryTypeEnum.WATCH_DELETE:
            return createWatchEvents(
                history.history_type,
                history.data as unknown as Parameters<
                    typeof createWatchEvents
                >[1],
            );
        case HistoryTypeEnum.READ_NOVEL:
        case HistoryTypeEnum.READ_NOVEL_DELETE:
        case HistoryTypeEnum.READ_MANGA:
        case HistoryTypeEnum.READ_MANGA_DELETE:
            return createReadEvents(
                history.history_type,
                history.data as unknown as Parameters<
                    typeof createReadEvents
                >[1],
            );
        case HistoryTypeEnum.WATCH_IMPORT:
        case HistoryTypeEnum.READ_IMPORT:
            return createImportEvents(
                history.history_type,
                history.data as unknown as Parameters<
                    typeof createImportEvents
                >[1],
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
