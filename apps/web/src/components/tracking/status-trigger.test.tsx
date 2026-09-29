import { act, createElement, type FC, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    type ReadResponseBase,
    type ReadStatusEnum,
    type WatchResponse,
    type WatchResponseBase,
    type WatchStatusEnum,
} from '@hikka/api';

import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
    SelectTrigger,
} from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { READ_STATUS, WATCH_STATUS } from '@/utils/labels/enum-labels';

import {
    READ_STATUS_OPTIONS,
    type StatusOption,
    WATCH_STATUS_OPTIONS,
} from './status-options';
import StatusTrigger from './status-trigger';

type LegacyProps = {
    disabled?: boolean;
    size?: 'sm' | 'md';
    isLoading?: boolean;
    onOpenModal?: () => void;
};

const LegacyWatchStatusTrigger: FC<
    LegacyProps & { watch: WatchResponse | WatchResponseBase }
> = ({ watch, disabled, size, isLoading, onOpenModal }) => {
    const watchStatus = WATCH_STATUS[watch.status as WatchStatusEnum];

    return (
        <SelectTrigger asChild>
            <div className={cn('flex w-full')}>
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none border border-r-0',
                        `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border p-1',
                                `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
                            )}
                        >
                            {createElement(
                                WATCH_STATUS_ICONS[
                                    watch.status as WatchStatusEnum
                                ],
                                {
                                    className: 'size-3!',
                                },
                            )}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        {watchStatus.title_ua || watchStatus.title_en}
                    </span>
                    {watch.score > 0 && (
                        <>
                            <span className="opacity-60">-</span>
                            <span className="opacity-60">{watch.score}</span>
                        </>
                    )}
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    onClick={onOpenModal}
                    disabled={disabled}
                    className={cn(
                        'rounded-l-none border border-l-0',
                        `bg-${watch.status} text-${watch.status}-foreground border-${watch.status}-border`,
                    )}
                >
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

const LegacyReadStatusTrigger: FC<LegacyProps & { read: ReadResponseBase }> = ({
    read,
    disabled,
    size,
    isLoading,
    onOpenModal,
}) => {
    const readStatus = READ_STATUS[read.status as ReadStatusEnum];

    return (
        <SelectTrigger asChild className="gap-0 border-none p-0">
            <div className="flex w-full">
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none border border-r-0',
                        `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border p-1',
                                `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                            )}
                        >
                            {createElement(
                                READ_STATUS_ICONS[
                                    read.status as ReadStatusEnum
                                ],
                                {
                                    className: 'size-3!',
                                },
                            )}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        {readStatus.title_ua || readStatus.title_en}
                    </span>
                    {read.score > 0 && (
                        <>
                            <span className="opacity-60">-</span>
                            <span className="opacity-60">{read.score}</span>
                        </>
                    )}
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    onClick={onOpenModal}
                    disabled={disabled}
                    className={cn(
                        'rounded-l-none border border-l-0',
                        `bg-${read.status} text-${read.status}-foreground border-${read.status}-border`,
                    )}
                >
                    <MaterialSymbolsSettingsOutlineRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

type Pair = (
    entry: { status: string; score: number },
    props: LegacyProps,
) => {
    legacy: ReactElement;
    next: ReactElement;
};

const KINDS: {
    kind: string;
    options: StatusOption[];
    pair: Pair;
}[] = [
    {
        kind: 'anime',
        options: WATCH_STATUS_OPTIONS,
        pair: (entry, props) => ({
            legacy: (
                <LegacyWatchStatusTrigger
                    {...props}
                    watch={entry as WatchResponseBase}
                />
            ),
            next: (
                <StatusTrigger
                    {...props}
                    contentType={ContentTypeEnum.ANIME}
                    entry={entry as WatchResponseBase}
                />
            ),
        }),
    },
    ...[ContentTypeEnum.MANGA, ContentTypeEnum.NOVEL].map((contentType) => ({
        kind: contentType,
        options: READ_STATUS_OPTIONS,
        pair: ((entry, props) => ({
            legacy: (
                <LegacyReadStatusTrigger
                    {...props}
                    read={entry as ReadResponseBase}
                />
            ),
            next: (
                <StatusTrigger
                    {...props}
                    contentType={contentType}
                    entry={entry as ReadResponseBase}
                />
            ),
        })) satisfies Pair,
    })),
];

const VARIANTS: LegacyProps[] = [
    {},
    { size: 'sm' },
    { size: 'md', disabled: true },
    { isLoading: true },
];

const Harness = ({
    options,
    value,
    trigger,
    onValueChange,
}: {
    options: StatusOption[];
    value: string[];
    trigger: ReactElement;
    onValueChange?: (value: string[]) => void;
}) => (
    <Select value={value} onValueChange={onValueChange}>
        {trigger}
        <SelectContent>
            <SelectList>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectItem disableCheckbox value="settings">
                        Налаштування
                    </SelectItem>
                </SelectGroup>
            </SelectList>
        </SelectContent>
    </Select>
);

const stubDom = () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
    Element.prototype.scrollIntoView ??= () => {};
};

const markup = () => document.body.innerHTML.replace(/_r_[0-9a-z]+_/g, 'ID');

type Interaction = {
    closed: string;
    open: string;
    selected: unknown[];
    modalOpens: number;
};

const interact = async (
    options: StatusOption[],
    status: string,
    target: string,
    trigger: (onOpenModal: () => void) => ReactElement,
): Promise<Interaction> => {
    const onValueChange = vi.fn();
    const onOpenModal = vi.fn();
    const container = document.body.appendChild(document.createElement('div'));
    const root = createRoot(container);
    const button = (index: number) =>
        container.querySelectorAll<HTMLElement>('button')[index];

    await act(async () =>
        root.render(
            <Harness
                options={options}
                value={[status]}
                trigger={trigger(onOpenModal)}
                onValueChange={onValueChange}
            />,
        ),
    );
    const closed = markup();

    await act(async () => button(0).click());
    const open = markup();

    await act(async () =>
        document
            .querySelector<HTMLElement>(`[cmdk-item][data-value="${target}"]`)
            ?.click(),
    );
    await act(async () => button(1).click());

    const result = {
        closed,
        open,
        selected: onValueChange.mock.calls.map(([value]) => value),
        modalOpens: onOpenModal.mock.calls.length,
    };

    await act(async () => root.unmount());
    document.body.innerHTML = '';

    return result;
};

describe.each(KINDS)('StatusTrigger for $kind', ({ options, pair }) => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the legacy markup for every status and prop variant', () => {
        const cases = options.flatMap(({ value: status }) =>
            VARIANTS.flatMap((variant) =>
                [0, 8].map((score) => ({
                    status,
                    triggers: pair({ status, score }, variant),
                })),
            ),
        );
        const render = (side: 'legacy' | 'next') =>
            cases.map(({ status, triggers }) =>
                renderToStaticMarkup(
                    <Harness
                        options={options}
                        value={[status]}
                        trigger={triggers[side]}
                    />,
                ),
            );

        const next = render('next');

        expect(next).toHaveLength(options.length * VARIANTS.length * 2);
        expect(next.every((html) => html.includes('<button'))).toBe(true);
        expect(next).toEqual(render('legacy'));
    });

    it('opens, selects and opens the modal like the legacy trigger', async () => {
        stubDom();

        for (const { value: status } of options) {
            const target = options.find((option) => option.value !== status)
                ?.value as string;
            const run = (side: 'legacy' | 'next') =>
                interact(
                    options,
                    status,
                    target,
                    (onOpenModal) =>
                        pair({ status, score: 7 }, { onOpenModal })[side],
                );

            const next = await run('next');

            expect(next.open).not.toBe(next.closed);
            expect(next.open).toContain('cmdk-item');
            expect(next.selected).toEqual([[target]]);
            expect(next.modalOpens).toBe(1);
            expect(next).toEqual(await run('legacy'));
        }
    });
});
