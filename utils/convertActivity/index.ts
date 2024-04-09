import { createFavoriteEvents } from '@/utils/convertActivity/convertFavoriteActivity';
import { createImportEvents } from '@/utils/convertActivity/convertImportActivity';
import { createWatchEvents } from '@/utils/convertActivity/convertWatchActivity';

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
        case 'watch_import':
            return createImportEvents(history.data as API.HistoryImportData);
        case 'favourite_anime_add':
        case 'favourite_anime_remove':
            return createFavoriteEvents(history.history_type);
    }
};
