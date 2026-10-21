import {
    type ReadStatusEnum as ReadStatus,
    ReadStatusEnum,
    type WatchStatusEnum as WatchStatus,
    WatchStatusEnum,
} from '@hikka/api';

import {
    CHAPTER_FORMS,
    EPISODE_FORMS,
    getDeclensionWord,
    TIMES_FORMS,
    VOLUME_FORMS,
    type WordForms,
} from '../i18n';
import { LIST_STATUS } from '../labels';
import { fact, into, joinFacts, status, value } from './fact-builder';
import type { HistoryFact, HistoryIcon, HistoryMedium } from './types';

type Unit = 'episodes' | 'chapters' | 'volumes';

type ListEntryState = Partial<
    Record<Unit | 'score' | 'rewatches' | 'rereads', number | null> & {
        status: WatchStatus | ReadStatus | null;
    }
>;

export type ListEntryData = {
    before?: ListEntryState | null;
    after?: ListEntryState | null;
    new_watch?: boolean;
    new_read?: boolean;
};

type ListEntryTotals = Partial<Record<Unit, number | null>>;

export type ListEntryContext = {
    totals: ListEntryTotals;
};

type Step = { fact: HistoryFact; icon: HistoryIcon };

const UNITS: Record<Unit, { forms: WordForms; genitive: WordForms }> = {
    episodes: {
        forms: EPISODE_FORMS,
        genitive: ['епізоду', 'епізодів', 'епізодів'],
    },
    chapters: {
        forms: CHAPTER_FORMS,
        genitive: ['розділу', 'розділів', 'розділів'],
    },
    volumes: { forms: VOLUME_FORMS, genitive: ['тому', 'томів', 'томів'] },
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

const statusLabel = (medium: HistoryMedium, entryStatus: string) =>
    (LIST_STATUS[medium] as Record<string, { title_ua: string }>)[entryStatus]
        ?.title_ua ?? entryStatus;

function describeStatus(
    medium: HistoryMedium,
    before: ListEntryState,
    after: ListEntryState,
    { isNew, withProgress }: { isNew: boolean; withProgress: boolean },
): Step | null {
    if (!after.status || after.status === before.status) return null;

    const icon: HistoryIcon = { kind: 'status', status: after.status };
    const next = statusLabel(medium, after.status);

    if (isNew && !withProgress) {
        return { fact: fact`додано ${into(next)} ${status(next)}`, icon };
    }

    return { fact: fact`${status(next)}`, icon };
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
    const ofTotal = total ? ` з ${total}` : '';

    if (after < before) {
        return {
            fact: fact`прогрес повернуто з ${value(before)} до ${value(after)} ${getDeclensionWord(after, genitive)}`,
            icon: { kind: 'rollback' },
        };
    }

    if (completed && after === total) {
        if (total === 1) return null;
        return {
            fact: isNew
                ? fact`всі ${value(after)} ${word}`
                : fact`${verb} всі ${value(after)} ${word}`,
            icon: progress,
        };
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

const joinNewProgress = (steps: Step[], verb: string): Step[] =>
    steps.length > 0
        ? [
              {
                  fact: fact`${verb} ${joinFacts(
                      steps.map((step) => step.fact),
                      ', ',
                  )}`,
                  icon: steps[0].icon,
              },
          ]
        : steps;

export function convertListEntry(
    medium: HistoryMedium,
    data: ListEntryData,
    context: ListEntryContext,
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
                context.totals[unit] || null,
                { verb: config.verb, isNew, completed },
            ) ?? [],
    );

    const steps = [
        describeStatus(medium, before, after, {
            isNew,
            withProgress: progress.length > 0,
        }),
        ...(isNew ? joinNewProgress(progress, config.verb) : progress),
        describeScore(before.score ?? 0, after.score ?? 0, isNew),
        describeRepeats(
            medium,
            before[config.repeats] ?? 0,
            after[config.repeats] ?? 0,
        ),
    ].filter((step): step is Step => step !== null);

    if (steps.length === 0) {
        return { icon: { kind: 'updated' }, facts: [fact`запис оновлено`] };
    }

    return { icon: steps[0].icon, facts: steps.map((step) => step.fact) };
}
