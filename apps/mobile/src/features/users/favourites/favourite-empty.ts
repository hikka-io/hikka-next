import { ContentTypeEnum, type FavouriteContentTypeEnum } from '@hikka/api';

// The web's favourite section labels: the empty state names the category in two cases.
const LABELS = {
    [ContentTypeEnum.ANIME]: { nominative: 'Аніме', accusative: 'аніме' },
    [ContentTypeEnum.MANGA]: { nominative: 'Манґа', accusative: 'манґу' },
    [ContentTypeEnum.NOVEL]: { nominative: 'Ранобе', accusative: 'ранобе' },
    [ContentTypeEnum.CHARACTER]: {
        nominative: 'Персонажі',
        accusative: 'персонажів',
    },
    [ContentTypeEnum.PERSON]: { nominative: 'Люди', accusative: 'людей' },
    [ContentTypeEnum.COLLECTION]: {
        nominative: 'Колекції',
        accusative: 'колекції',
    },
} as const satisfies Record<
    FavouriteContentTypeEnum,
    { nominative: string; accusative: string }
>;

export const favouriteEmptyCopy = (type: FavouriteContentTypeEnum) => ({
    title: `У списку «${LABELS[type].nominative}» пусто`,
    description: `Цей список оновиться після того, як сюди буде додано ${LABELS[type].accusative}`,
});

/** Media cards show year and type under the title; entity cards show a two-line name. */
export const favouriteHasSubtitles = (type: FavouriteContentTypeEnum) =>
    type !== ContentTypeEnum.CHARACTER && type !== ContentTypeEnum.PERSON;
