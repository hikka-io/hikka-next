import type * as React from 'react';
import { act, createElement, type FC, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    type ReadContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/api';

import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import MaterialSymbolsArrowDropDownRounded from '@/components/icons/material-symbols/MaterialSymbolsArrowDropDownRounded';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import NewStatusTrigger from './new-status-trigger';
import {
    READ_STATUS_OPTIONS,
    type StatusOption,
    WATCH_STATUS_OPTIONS,
} from './status-options';
import { useAddRead, useAddWatch } from './use-tracking-mutations';

const { mutations } = vi.hoisted(() => ({ mutations: [] as string[] }));

vi.mock('./use-tracking-mutations', () => ({
    useAddWatch: vi.fn(() => ({
        mutate: (variables: unknown) =>
            mutations.push(`watch ${JSON.stringify(variables)}`),
    })),
    useAddRead: vi.fn(() => ({
        mutate: (variables: unknown) =>
            mutations.push(`read ${JSON.stringify(variables)}`),
    })),
}));

type LegacyProps = {
    disabled?: boolean;
    slug: string;
    size?: 'sm' | 'md';
    isLoading?: boolean;
};

const LegacyNewWatchStatusTrigger: FC<LegacyProps> = ({
    disabled,
    slug,
    size,
    isLoading,
}) => {
    const { mutate: createWatch } = useAddWatch();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createWatch({
            path: { slug },
            body: {
                status: WatchStatusEnum.PLANNED,
            },
        });
    };

    return (
        <SelectTrigger
            asChild
            className="gap-0 border-none p-0"
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="flex w-full">
                <Button
                    variant="secondary"
                    size={size}
                    disabled={disabled}
                    onClick={handleAddToPlanned}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border border-secondary-foreground/20 p-1',
                            )}
                        >
                            {createElement(WATCH_STATUS_ICONS.planned, {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        Додати у список
                    </span>
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    disabled={disabled}
                    className={cn('rounded-l-none text-xl')}
                >
                    <MaterialSymbolsArrowDropDownRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

const LegacyNewReadStatusTrigger: FC<
    LegacyProps & { content_type: ReadContentTypeEnum }
> = ({ disabled, slug, content_type, size, isLoading }) => {
    const { mutate: createRead } = useAddRead();

    const handleAddToPlanned = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createRead({
            path: { content_type, slug },
            body: {
                status: ReadStatusEnum.PLANNED,
            },
        });
    };

    return (
        <SelectTrigger
            asChild
            className="gap-0 border-none p-0"
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="flex w-full">
                <Button
                    size={size}
                    variant="secondary"
                    disabled={disabled}
                    onClick={handleAddToPlanned}
                    className={cn(
                        'flex-1 flex-nowrap overflow-hidden rounded-r-none',
                    )}
                >
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={cn(
                                'rounded-sm border border-secondary-foreground/20 p-1',
                            )}
                        >
                            {createElement(READ_STATUS_ICONS.planned, {
                                className: 'size-3!',
                            })}
                        </div>
                    )}
                    <span className="truncate rounded-none">
                        Додати у список
                    </span>
                </Button>
                <Button
                    variant="secondary"
                    size={size ? `icon-${size}` : 'icon'}
                    type="button"
                    disabled={disabled}
                    className={cn('rounded-l-none text-xl')}
                >
                    <MaterialSymbolsArrowDropDownRounded />
                </Button>
            </div>
        </SelectTrigger>
    );
};

type Variant = Omit<LegacyProps, 'slug'>;

type Pair = (variant: Variant) => {
    legacy: ReactElement;
    next: ReactElement;
};

const KINDS: {
    kind: string;
    options: StatusOption[];
    mutation: string;
    pair: Pair;
}[] = [
    {
        kind: 'anime',
        options: WATCH_STATUS_OPTIONS,
        mutation:
            'watch {"path":{"slug":"some-slug"},"body":{"status":"planned"}}',
        pair: (variant) => ({
            legacy: (
                <LegacyNewWatchStatusTrigger {...variant} slug="some-slug" />
            ),
            next: (
                <NewStatusTrigger
                    {...variant}
                    slug="some-slug"
                    contentType={ContentTypeEnum.ANIME}
                />
            ),
        }),
    },
    ...[ContentTypeEnum.MANGA, ContentTypeEnum.NOVEL].map((contentType) => ({
        kind: contentType,
        options: READ_STATUS_OPTIONS,
        mutation: `read {"path":{"content_type":"${contentType}","slug":"some-slug"},"body":{"status":"planned"}}`,
        pair: ((variant) => ({
            legacy: (
                <LegacyNewReadStatusTrigger
                    {...variant}
                    slug="some-slug"
                    content_type={contentType}
                />
            ),
            next: (
                <NewStatusTrigger
                    {...variant}
                    slug="some-slug"
                    contentType={contentType}
                />
            ),
        })) satisfies Pair,
    })),
];

const VARIANTS: Variant[] = [
    {},
    { size: 'sm' },
    { size: 'md', disabled: true },
    { isLoading: true },
];

const Harness = ({
    options,
    trigger,
    onValueChange,
}: {
    options: StatusOption[];
    trigger: ReactElement;
    onValueChange?: (value: string[]) => void;
}) => (
    <Select value={[]} onValueChange={onValueChange}>
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

const interact = async (options: StatusOption[], trigger: ReactElement) => {
    const onValueChange = vi.fn();
    const container = document.body.appendChild(document.createElement('div'));
    const root = createRoot(container);
    const button = (index: number) =>
        container.querySelectorAll<HTMLElement>('button')[index];

    mutations.length = 0;
    vi.mocked(useAddWatch).mockClear();
    vi.mocked(useAddRead).mockClear();

    await act(async () =>
        root.render(
            <Harness
                options={options}
                trigger={trigger}
                onValueChange={onValueChange}
            />,
        ),
    );
    const closed = markup();

    await act(async () => button(0).click());
    const added = markup();

    await act(async () => button(1).click());
    const open = markup();

    await act(async () =>
        document
            .querySelector<HTMLElement>(
                `[cmdk-item][data-value="${options[1].value}"]`,
            )
            ?.click(),
    );

    const result = {
        closed,
        added,
        open,
        mutations: [...mutations],
        selected: onValueChange.mock.calls.map(([value]) => value),
        hooks: {
            watch: [...vi.mocked(useAddWatch).mock.calls],
            read: [...vi.mocked(useAddRead).mock.calls],
        },
    };

    await act(async () => root.unmount());
    document.body.innerHTML = '';

    return result;
};

describe.each(KINDS)('NewStatusTrigger for $kind', ({
    kind,
    options,
    mutation,
    pair,
}) => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the legacy markup for every prop variant', () => {
        const render = (side: 'legacy' | 'next') =>
            VARIANTS.map((variant) =>
                renderToStaticMarkup(
                    <Harness options={options} trigger={pair(variant)[side]} />,
                ),
            );

        const next = render('next');

        expect(next.every((html) => html.includes('Додати у список'))).toBe(
            true,
        );
        expect(next).toEqual(render('legacy'));
    });

    it('adds to planned, opens and selects like the legacy trigger', async () => {
        stubDom();
        const { legacy, next } = pair({});

        const result = await interact(options, next);

        expect(result.mutations).toEqual([mutation]);
        expect(result.added).toBe(result.closed);
        expect(result.open).toContain('cmdk-item');
        expect(result.selected).toEqual([[options[1].value]]);
        expect(result.hooks[kind === 'anime' ? 'read' : 'watch']).toEqual([]);
        expect(
            result.hooks[kind === 'anime' ? 'watch' : 'read'].length,
        ).toBeGreaterThan(0);
        expect(result).toEqual(await interact(options, legacy));
    });
});
