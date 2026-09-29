import type { HistoryTypeEnum, ReadStatusEnum } from '@hikka/api';

import { READ_STATUS } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import {
    CHAPTER_FORMS,
    TIMES_FORMS,
    VOLUME_FORMS,
} from '@/utils/i18n/word-forms';

import { convertScore, convertStatus } from './convert-shared';

// Local narrowing for the loose `HistoryResponse.data` (`{ [key]: unknown }`)
// in @hikka/api. Field shapes match the API history payloads.
type HistoryReadData = {
    after: {
        score: number | null;
        status: ReadStatusEnum | null;
        chapters: number | null;
        volumes: number | null;
        rereads: number | null;
    };
    before: {
        score: number | null;
        status: ReadStatusEnum | null;
        chapters: number | null;
        volumes: number | null;
        rereads: number | null;
    };
    new_read: boolean;
};

export const convertChapters = (
    before: number | null,
    after: number | null,
) => {
    if (before === null && after !== null) {
        return `Прочитано **${after}** ${getDeclensionWord(after, CHAPTER_FORMS)}`;
    }

    if (before !== null && after !== null) {
        if (before === after) {
            return `Прочитано **${after}** ${getDeclensionWord(after, CHAPTER_FORMS)}`;
        } else if (after === 0) {
            return null;
        } else if (after - before === 1 || before === 0 || before > after) {
            return `Прочитано **${after}** ${CHAPTER_FORMS[0]}`;
        } else {
            return `Прочитано з **${before + 1}** по **${after}** ${CHAPTER_FORMS[0]}`;
        }
    }
};

export const convertVolumes = (before: number | null, after: number | null) => {
    if (before === null && after !== null) {
        return `Прочитано **${after}** ${getDeclensionWord(after, VOLUME_FORMS)}`;
    }

    if (before !== null && after !== null) {
        if (before === after) {
            return `Прочитано **${after}** ${getDeclensionWord(after, VOLUME_FORMS)}`;
        } else if (after === 0) {
            return null;
        } else if (after - before === 1 || before === 0 || before > after) {
            return `Прочитано **${after}** ${VOLUME_FORMS[0]}`;
        } else {
            return `Прочитано з **${before + 1}** по **${after}** ${VOLUME_FORMS[0]}`;
        }
    }
};

export const convertRereads = (
    _before: number | null,
    after: number | null,
) => {
    if (after !== null) {
        return `Повторно прочитано **${after}** ${getDeclensionWord(after, TIMES_FORMS)}`;
    }
};

export const convertDeleteRead = () => {
    return 'Видалено зі списку';
};

export const createReadEvents = (
    history_type: HistoryTypeEnum,
    data?: HistoryReadData,
) => {
    const events = [];

    if (
        history_type === 'read_manga_delete' ||
        history_type === 'read_novel_delete'
    ) {
        events.push(convertDeleteRead());
    }

    if (data?.before?.status || data?.after?.status) {
        events.push(
            convertStatus(data.before.status, data.after.status, READ_STATUS),
        );
    }

    if (data?.before?.chapters || data?.after?.chapters) {
        events.push(convertChapters(data.before.chapters, data.after.chapters));
    }

    if (data?.before?.volumes || data?.after?.volumes) {
        events.push(convertVolumes(data.before.volumes, data.after.volumes));
    }

    if (data?.before?.score || data?.after?.score) {
        events.push(convertScore(data.before.score, data.after.score));
    }

    if (data?.before?.rereads || data?.after?.rereads) {
        events.push(convertRereads(data.before.rereads, data.after.rereads));
    }

    return events.filter((event) => event !== null);
};
