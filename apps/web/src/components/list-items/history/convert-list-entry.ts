import {
    type ReadStatusEnum as ReadStatus,
    ReadStatusEnum,
    type WatchStatusEnum as WatchStatus,
    WatchStatusEnum,
} from '@hikka/api';

import { getDeclensionWord, type WordForms } from '@/utils/i18n/declension';
import {
    CHAPTER_FORMS,
    EPISODE_FORMS,
    TIMES_FORMS,
    VOLUME_FORMS,
} from '@/utils/i18n/word-forms';
import { LIST_STATUS } from '@/utils/labels/enum-labels';

import { fact, into, joinFacts, outOf, status, value } from './fact-builder';
import { formatHistoryDate } from './history-dates';
import type { HistoryFact, HistoryIcon, HistoryMedium } from './types';

type Unit = 'episodes' | 'chapters' | 'volumes';

type ListEntryState = Partial<
    Record<
        Unit | 'score' | 'rewatches' | 'rereads' | 'start_date' | 'end_date',
        number | null
    > & { status: WatchStatus | ReadStatus | null }
>;

export type ListEntryData = {
    before?: ListEntryState | null;
    after?: ListEntryState | null;
    new_watch?: boolean;
    new_read?: boolean;
};

export type ListEntryTotals = Partial<Record<Unit, number | null>>;

type Step = { fact: HistoryFact; icon: HistoryIcon };

const UNITS: Record<Unit, { forms: WordForms; genitive: string }> = {
    episodes: { forms: EPISODE_FORMS, genitive: 'епізоду' },
    chapters: { forms: CHAPTER_FORMS, genitive: 'розділу' },
    volumes: { forms: VOLUME_FORMS, genitive: 'тому' },
};

const MEDIUMS = {
    watch: {
        verb: 'переглянуто',
        units: ['episodes'],
        repeats: 'rewatches',
        completed: WatchStatusEnum.COMPLETED,
    },
    read: {
        verb: 'прочитано',
        units: ['chapters', 'volumes'],
        repeats: 'rereads',
        completed: ReadStatusEnum.COMPLETED,
    },
} as const satisfies Record<
    HistoryMedium,
    {
        verb: string;
        units: Unit[];
        repeats: 'rewatches' | 'rereads';
        completed: string;
    }
>;

const DATES = [
    { key: 'start_date', set: 'почато', removed: 'дату початку прибрано' },
    { key: 'end_date', set: 'закінчено', removed: 'дату закінчення прибрано' },
] as const;

const statusLabel = (medium: HistoryMedium, entryStatus: string) =>
    (LIST_STATUS[medium] as Record<string, { title_ua: string }>)[entryStatus]
        ?.title_ua ?? entryStatus;

function describeStatus(
    medium: HistoryMedium,
    before: ListEntryState,
    after: ListEntryState,
    isNew: boolean,
): Step | null {
    if (!after.status || after.status === before.status) return null;

    const icon: HistoryIcon = { kind: 'status', status: after.status };
    const next = statusLabel(medium, after.status);

    if (isNew || !before.status) {
        return { fact: fact`додано ${into(next)} ${status(next)}`, icon };
    }

    const previous = statusLabel(medium, before.status);

    return {
        fact: fact`перенесено ${outOf(previous)} ${previous} ${into(next)} ${status(next)}`,
        icon,
    };
}

function describeProgress(
    unit: Unit,
    before: number,
    after: number,
    total: number | null,
    {
        verb,
        isNew,
        completed,
    }: { verb: string; isNew: boolean; completed: boolean },
): Step | null {
    if (after === before || after === 0) return null;

    const { forms, genitive } = UNITS[unit];
    const progress: HistoryIcon = { kind: 'progress' };
    const word = getDeclensionWord(after, forms);
    const ofTotal = total ? ` із ${total}` : '';

    if (after < before) {
        return {
            fact: fact`прогрес повернуто з ${value(before)} до ${value(after)} ${genitive}`,
            icon: { kind: 'rollback' },
        };
    }

    if (completed && after === total) {
        if (total === 1) return null;
        return { fact: fact`усі ${value(after)} ${word}`, icon: progress };
    }

    if (isNew) {
        return {
            fact: fact`${value(after)} ${word}${ofTotal}`,
            icon: progress,
        };
    }

    if (after === before + 1) {
        return {
            fact: fact`${verb} ${forms[0]} ${value(after)}${ofTotal}`,
            icon: progress,
        };
    }

    return {
        fact: fact`${verb} ${forms[1]} ${value(`${before + 1}–${after}`)}${ofTotal}`,
        icon: progress,
    };
}

function describeScore(before: number, after: number, isNew: boolean) {
    const icon: HistoryIcon = { kind: 'score' };

    if (after === before || (isNew && !after)) return null;
    if (!before) return { fact: fact`оцінка ${value(after)}`, icon };
    if (!after) return { fact: fact`оцінку ${value(before)} прибрано`, icon };

    return {
        fact: fact`оцінку змінено з ${value(before)} на ${value(after)}`,
        icon,
    };
}

function describeRepeats(
    medium: HistoryMedium,
    before: number,
    after: number,
): Step | null {
    if (after <= before) return null;

    const icon: HistoryIcon = { kind: 'progress' };
    const times = getDeclensionWord(after, TIMES_FORMS);

    if (medium === 'read') {
        return { fact: fact`перечитано ${value(after)} ${times}`, icon };
    }

    if (after === 1) return { fact: fact`повторний перегляд`, icon };

    return { fact: fact`переглянуто повторно ${value(after)} ${times}`, icon };
}

function describeDates(
    before: ListEntryState,
    after: ListEntryState,
    timeZone?: string,
): Step[] {
    return DATES.flatMap(({ key, set, removed }) => {
        const previous = before[key] ?? null;
        const next = after[key] ?? null;

        if (previous === next) return [];

        return {
            fact: next
                ? fact`${set} ${formatHistoryDate(next, timeZone)}`
                : fact`${removed}`,
            icon: { kind: 'date' } as const,
        };
    });
}

const mergeSteps = (steps: Step[]): Step[] =>
    steps.length > 1
        ? [
              {
                  fact: joinFacts(
                      steps.map((step) => step.fact),
                      ', ',
                  ),
                  icon: steps[0].icon,
              },
          ]
        : steps;

export function convertListEntry(
    medium: HistoryMedium,
    data: ListEntryData,
    totals: ListEntryTotals,
    timeZone?: string,
): { icon: HistoryIcon; facts: HistoryFact[] } {
    const before = data.before ?? {};
    const after = data.after ?? {};
    const config = MEDIUMS[medium];

    if (before.status && !after.status) {
        return { icon: { kind: 'delete' }, facts: [fact`видалено зі списку`] };
    }

    const isNew =
        Boolean(data.new_watch || data.new_read) ||
        (!before.status && Boolean(after.status));
    const completed = after.status === config.completed;

    const progress = config.units.flatMap(
        (unit) =>
            describeProgress(
                unit,
                before[unit] ?? 0,
                after[unit] ?? 0,
                totals[unit] || null,
                { verb: config.verb, isNew, completed },
            ) ?? [],
    );

    const steps = [
        describeStatus(medium, before, after, isNew),
        ...(isNew ? mergeSteps(progress) : progress),
        describeScore(before.score ?? 0, after.score ?? 0, isNew),
        describeRepeats(
            medium,
            before[config.repeats] ?? 0,
            after[config.repeats] ?? 0,
        ),
        ...(isNew ? [] : describeDates(before, after, timeZone)),
    ].filter((step): step is Step => step !== null);

    if (steps.length === 0) {
        return { icon: { kind: 'updated' }, facts: [fact`запис оновлено`] };
    }

    return { icon: steps[0].icon, facts: steps.map((step) => step.fact) };
}
