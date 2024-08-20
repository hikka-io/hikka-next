export const convertDeleteFavorite = () => {
    return 'Видалено з улюблених';
};

export const convertAddFavorite = () => {
    return 'Додано до улюблених';
};

export const createFavoriteEvents = (history_type: API.HistoryType) => {
    const events = [];

    if (history_type.includes('_remove')) {
        events.push(convertDeleteFavorite());
    }

    if (history_type.includes('_add')) {
        events.push(convertAddFavorite());
    }

    return events;
};
