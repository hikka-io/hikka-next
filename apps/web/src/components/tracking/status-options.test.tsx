import { type ComponentType, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import StatusCompleted from '@/components/icons/list-status/StatusCompleted';
import StatusDropped from '@/components/icons/list-status/StatusDropped';
import StatusOnHold from '@/components/icons/list-status/StatusOnHold';
import StatusPlanned from '@/components/icons/list-status/StatusPlanned';
import StatusWatching from '@/components/icons/list-status/StatusWatching';
import MaterialSymbolsBookmarkFlagOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsBookmarkFlagOutlineRounded';
import MaterialSymbolsBookmarkOutline from '@/components/icons/material-symbols/MaterialSymbolsBookmarkOutline';

import {
    READ_STATUS_OPTIONS,
    StatusIconChip,
    WATCH_STATUS_OPTIONS,
} from './status-options';

type Icon = ComponentType<{ className?: string }>;

const chip = (status: string, icon: Icon) =>
    `<div class="w-fit rounded-sm border p-1 bg-${status} text-${status}-foreground border-${status}-border">${renderToStaticMarkup(createElement(icon, { className: 'size-3!' }))}</div>`;

const WATCH: [string, string, Icon][] = [
    ['planned', 'Заплановано', StatusPlanned],
    ['watching', 'Дивлюсь', StatusWatching],
    ['completed', 'Завершено', StatusCompleted],
    ['on_hold', 'Відкладено', StatusOnHold],
    ['dropped', 'Закинуто', StatusDropped],
];

const READ: [string, string, Icon][] = [
    ['planned', 'Заплановано', StatusPlanned],
    ['completed', 'Завершено', StatusCompleted],
    ['on_hold', 'Відкладено', MaterialSymbolsBookmarkFlagOutlineRounded],
    ['dropped', 'Закинуто', StatusDropped],
    ['reading', 'Читаю', MaterialSymbolsBookmarkOutline],
];

describe.each([
    ['watch', WATCH_STATUS_OPTIONS, WATCH],
    ['read', READ_STATUS_OPTIONS, READ],
])('%s status options', (_, options, expected) => {
    it('keep the value, title and order', () => {
        expect(
            options.map((option) => [
                Object.keys(option),
                option.value,
                option.title,
            ]),
        ).toEqual(
            expected.map(([value, title]) => [
                ['value', 'title', 'label'],
                value,
                title,
            ]),
        );
    });

    it('render the status chip before the title', () => {
        expect(
            options.map((option) => renderToStaticMarkup(option.label)),
        ).toEqual(
            expected.map(
                ([value, title, icon]) =>
                    `<div class="flex items-center gap-2">${chip(value, icon)}${title}</div>`,
            ),
        );
    });
});

describe('StatusIconChip', () => {
    it.each([...WATCH, ...READ])('renders the %s chip', (status, _, icon) => {
        expect(
            renderToStaticMarkup(
                <StatusIconChip status={status} icon={icon} />,
            ),
        ).toBe(chip(status, icon));
    });
});
