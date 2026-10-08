import { act, type ReactElement, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';

import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useTitle } from '@/services/session';
import { getTitle } from '@/utils/title/get-title';

import ListEntryEditDialog from './list-entry-edit-dialog';
import ReadEditForm from './read-edit-form';
import WatchEditForm from './watch-edit-form';

const { PREFERENCES, stubForm } = vi.hoisted(() => ({
    PREFERENCES: {
        title_language: 'title_en',
        name_language: 'name_en',
    } as const,
    stubForm: (form: string) => (props: Record<string, unknown>) => (
        <button
            type="button"
            data-form={form}
            data-props={JSON.stringify(
                Object.entries(props).sort(),
                (_, value) => (typeof value === 'function' ? 'fn' : value),
            )}
            onClick={props.onClose as () => void}
        />
    ),
}));

vi.mock('@/services/hooks/use-back-close', () => ({ useBackClose: () => {} }));
vi.mock('@/services/session/use-session-ui', () => ({
    useSessionUI: () => ({ preferences: PREFERENCES }),
}));
vi.mock('./watch-edit-form', () => ({ default: stubForm('watch') }));
vi.mock('./read-edit-form', () => ({ default: stubForm('read') }));

const anime = { slug: 'anime-slug', title_ua: 'Аніме', title_en: 'Anime' };
const manga = { slug: 'manga-slug', title_ua: 'Манґа', title_en: 'Manga' };
const watch = { status: 'watching', episodes: 3 } as WatchResponseBase;
const read = { status: 'reading', chapters: 5 } as ReadResponseBase;

type ShellProps = { open: boolean; onOpenChange: (open: boolean) => void };

const LegacyWatchListShell = ({
    open,
    onOpenChange,
    content,
}: ShellProps & { content: typeof anime | undefined }) => {
    const title = useTitle(content);

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange} mobile="page">
            <ResponsiveModalContent className="md:max-w-xl" title={title}>
                <WatchEditForm
                    slug="anime-slug"
                    watch={watch}
                    onClose={() => onOpenChange(false)}
                />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

const LegacyReadListShell = ({ open, onOpenChange }: ShellProps) => {
    const title = useTitle(manga);

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange} mobile="page">
            <ResponsiveModalContent className="md:max-w-xl" title={title}>
                <ReadEditForm
                    slug="manga-slug"
                    content_type={ContentTypeEnum.MANGA}
                    read={read}
                    onClose={() => onOpenChange(false)}
                />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

const LegacyHomeTrackerShell = ({ open, onOpenChange }: ShellProps) => (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} mobile="page">
        <ResponsiveModalContent
            className="md:max-w-xl"
            title={getTitle(
                anime,
                PREFERENCES.title_language,
                PREFERENCES.name_language,
            )}
        >
            <WatchEditForm
                watch={watch}
                slug="anime-slug"
                onClose={() => onOpenChange(false)}
            />
        </ResponsiveModalContent>
    </ResponsiveModal>
);

const CASES = [
    {
        name: 'watch list button',
        text: 'Anime',
        dialog: (shell: ShellProps) => (
            <ListEntryEditDialog
                {...shell}
                content={anime}
                slug="anime-slug"
                contentType={ContentTypeEnum.ANIME}
                watch={watch}
            />
        ),
        legacy: (shell: ShellProps) => (
            <LegacyWatchListShell {...shell} content={anime} />
        ),
    },
    {
        name: 'untitled watch list button',
        text: 'data-form="watch"',
        dialog: (shell: ShellProps) => (
            <ListEntryEditDialog
                {...shell}
                content={undefined}
                slug="anime-slug"
                contentType={ContentTypeEnum.ANIME}
                watch={watch}
            />
        ),
        legacy: (shell: ShellProps) => (
            <LegacyWatchListShell {...shell} content={undefined} />
        ),
    },
    {
        name: 'read list button',
        text: 'Manga',
        dialog: (shell: ShellProps) => (
            <ListEntryEditDialog
                {...shell}
                content={manga}
                slug="manga-slug"
                contentType={ContentTypeEnum.MANGA}
                read={read}
            />
        ),
        legacy: (shell: ShellProps) => <LegacyReadListShell {...shell} />,
    },
    {
        name: 'home tracker',
        text: 'Anime',
        dialog: (shell: ShellProps) => (
            <ListEntryEditDialog
                {...shell}
                content={anime}
                slug="anime-slug"
                contentType={ContentTypeEnum.ANIME}
                watch={watch}
            />
        ),
        legacy: (shell: ShellProps) => <LegacyHomeTrackerShell {...shell} />,
    },
];

const mountedMarkup = async (element: ReactElement) => {
    const root = createRoot(
        document.body.appendChild(document.createElement('div')),
    );

    await act(async () => root.render(element));
    const markup = document.body.innerHTML.replace(/_r_[0-9a-z]+_/g, 'ID');
    await act(async () => root.unmount());
    document.body.innerHTML = '';

    return markup;
};

const stubViewport = (desktop: boolean) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('matchMedia', () => ({
        matches: desktop,
        addEventListener: () => {},
        removeEventListener: () => {},
    }));
};

describe('ListEntryEditDialog', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it.each(CASES)(
        'renders the same closed markup as the $name shell',
        ({ dialog, legacy }) => {
            const shell = { open: false, onOpenChange: () => {} };

            expect(renderToStaticMarkup(dialog(shell))).toBe(
                renderToStaticMarkup(legacy(shell)),
            );
        },
    );

    it.each(
        CASES.flatMap((c) => [
            { ...c, surface: 'mobile page sheet', desktop: false },
            { ...c, surface: 'desktop dialog', desktop: true },
        ]),
    )(
        'mounts the same open $surface as the $name shell',
        async ({ dialog, legacy, text, desktop }) => {
            stubViewport(desktop);
            const shell = { open: true, onOpenChange: () => {} };

            const markup = await mountedMarkup(dialog(shell));

            expect(markup).toContain('role="dialog"');
            expect(markup).toContain(text);
            expect(markup).toBe(await mountedMarkup(legacy(shell)));
        },
    );

    it('closes through onOpenChange when the form calls onClose', async () => {
        stubViewport(true);
        const onOpenChange = vi.fn();

        const Harness = () => {
            const [open, setOpen] = useState(true);

            return CASES[2].dialog({
                open,
                onOpenChange: (next) => {
                    onOpenChange(next);
                    setOpen(next);
                },
            });
        };

        const root = createRoot(
            document.body.appendChild(document.createElement('div')),
        );
        await act(async () => root.render(<Harness />));
        await act(async () =>
            document.querySelector<HTMLElement>('[data-form="read"]')?.click(),
        );

        expect(onOpenChange).toHaveBeenCalledWith(false);
        await act(async () => root.unmount());
        document.body.innerHTML = '';
    });
});
