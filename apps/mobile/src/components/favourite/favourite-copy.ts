import type { FavouriteState } from './use-favourite';

export const FAVOURITE_LABEL = 'В улюблене';

export const favouriteHint = ({
    status,
    isFavourite,
}: Pick<FavouriteState, 'status' | 'isFavourite'>) =>
    status === 'signed-out'
        ? 'Увійдіть, щоб додати в улюблене'
        : status === 'error'
          ? 'Не вдалося завантажити. Торкніться, щоб повторити'
          : isFavourite
            ? 'Прибрати з улюбленого'
            : 'Додати в улюблене';
