import { describe, expect, it } from 'vitest';

import { ContentTypeEnum, ReadStatusEnum, WatchStatusEnum } from '@hikka/api';

import { catalogHideListedKey, catalogHideListedStatuses } from './ui-prefs';

describe('catalogHideListedStatuses', () => {
    it('defaults to every list status', () => {
        expect(catalogHideListedStatuses({}, ContentTypeEnum.ANIME)).toEqual(
            Object.values(WatchStatusEnum),
        );
        expect(catalogHideListedStatuses({}, ContentTypeEnum.NOVEL)).toEqual(
            Object.values(ReadStatusEnum),
        );
    });

    it('keeps an emptied selection', () => {
        const filters = {
            [catalogHideListedKey(ContentTypeEnum.MANGA)]: [],
        };

        expect(
            catalogHideListedStatuses(filters, ContentTypeEnum.MANGA),
        ).toEqual([]);
    });

    it('keeps anime and read selections apart', () => {
        const filters = {
            [catalogHideListedKey(ContentTypeEnum.ANIME)]: ['planned'],
        };

        expect(
            catalogHideListedStatuses(filters, ContentTypeEnum.ANIME),
        ).toEqual(['planned']);
        expect(
            catalogHideListedStatuses(filters, ContentTypeEnum.MANGA),
        ).toEqual(Object.values(ReadStatusEnum));
        expect(catalogHideListedKey(ContentTypeEnum.MANGA)).toBe(
            catalogHideListedKey(ContentTypeEnum.NOVEL),
        );
    });

    it('drops stored values that are not list statuses', () => {
        const filters = {
            [catalogHideListedKey(ContentTypeEnum.ANIME)]: [
                'reading',
                'dropped',
            ],
        };

        expect(
            catalogHideListedStatuses(filters, ContentTypeEnum.ANIME),
        ).toEqual(['dropped']);
    });
});
