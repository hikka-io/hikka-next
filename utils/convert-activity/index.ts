import { createFavoriteEvents } from './convert-favorite-activity';
import { createImportEvents } from './convert-import-activity';
import { createReadEvents } from './convert-read-activity';
import { createWatchEvents } from './convert-watch-activity';

export const convertActivity = (
    history: API.History<
        API.HistoryWatchData | API.HistoryImportData | API.HistoryFavoriteData
    >,
) => {
    switch (history.history_type) {
        case 'watch':
        case 'watch_delete':
            return createWatchEvents(
                history.history_type,
                history.data as API.HistoryWatchData,
            );
        case 'read_novel':
        case 'read_novel_delete':
        case 'read_manga':
        case 'read_manga_delete':
            return createReadEvents(
                history.history_type,
                history.data as API.HistoryReadData,
            );
        case 'watch_import':
            return createImportEvents(history.data as API.HistoryImportData);
        case 'favourite_anime_add':
        case 'favourite_anime_remove':
            return createFavoriteEvents(history.history_type);
        default:
            return [];
    }
};
