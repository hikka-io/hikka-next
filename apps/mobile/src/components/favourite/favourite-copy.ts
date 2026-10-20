import type { FavouriteState } from './use-favourite';

type Copy = Pick<FavouriteState, 'status' | 'isFavourite'>;

export const favouriteLabel = ({ isFavourite }: Copy) =>
    isFavourite ? 'Прибрати з улюбленого' : 'В улюблене';

export const favouriteHint = ({ status }: Copy) =>
    status === 'signed-out'
        ? 'Увійдіть, щоб додати в улюблене'
        : status === 'error'
          ? 'Не вдалося завантажити. Торкніться, щоб повторити'
          : undefined;
