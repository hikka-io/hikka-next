import { act, type ReactNode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import { MDViewer } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import RulesAlert from './rules-alert';

vi.mock('@/services/hooks/use-back-close', () => ({
    useBackClose: () => {},
}));

const withClient = (node: ReactNode) => (
    <QueryClientProvider client={new QueryClient()}>{node}</QueryClientProvider>
);

const ALERT_BOX_CLASS =
    'flex items-center gap-4 rounded-md border border-border surface p-4';

const LegacyEditRulesAlert = () => {
    const [rules] = useState('');
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className={ALERT_BOX_CLASS}>
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="flex-1 text-sm">
                    Перш ніж почати редагування контенту, рекомендуємо
                    ознайомитись з{' '}
                    <Button
                        onClick={() => setOpen(true)}
                        variant="link"
                        className="h-auto p-0 text-primary-foreground hover:underline"
                    >
                        нашими правилами
                    </Button>{' '}
                    редагування контенту.
                </span>
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalContent
                    className="md:max-w-xl"
                    title="Правила редагування"
                >
                    <MDViewer className="-m-4 overflow-scroll p-4">
                        {rules}
                    </MDViewer>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </div>
    );
};

const LegacyCollectionRulesAlert = () => {
    const [rules] = useState('');
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className={ALERT_BOX_CLASS}>
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="flex-1 text-sm">
                    Перш ніж створювати колекції, рекомендуємо ознайомитись з{' '}
                    <Button
                        onClick={() => setOpen(true)}
                        variant="link"
                        className="h-auto p-0 text-primary-foreground hover:underline"
                    >
                        нашими правилами
                    </Button>{' '}
                    створення колекцій.
                </span>
            </div>

            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalContent
                    title="Правила колекцій"
                    className="md:max-w-xl"
                >
                    <MDViewer className="-m-4 overflow-scroll p-4">
                        {rules}
                    </MDViewer>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

const EditRulesAlert = () => (
    <div>
        <RulesAlert
            rulesFile="RULES.md"
            before="Перш ніж почати редагування контенту, рекомендуємо ознайомитись з"
            after="редагування контенту."
            modalTitle="Правила редагування"
        />
    </div>
);

const CollectionRulesAlert = () => (
    <RulesAlert
        rulesFile="COLLECTION_RULES.md"
        before="Перш ніж створювати колекції, рекомендуємо ознайомитись з"
        after="створення колекцій."
        modalTitle="Правила колекцій"
    />
);

describe('RulesAlert markup', () => {
    it('matches the former edit alert', () => {
        const html = renderToString(withClient(<EditRulesAlert />));

        expect(html).toBe(renderToString(<LegacyEditRulesAlert />));
        expect(html).toContain('нашими правилами');
    });

    it('matches the former collection alert', () => {
        const html = renderToString(withClient(<CollectionRulesAlert />));

        expect(html).toBe(renderToString(<LegacyCollectionRulesAlert />));
        expect(html).toContain('нашими правилами');
    });
});

describe('RulesAlert fetch', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        document.body.innerHTML = '';
    });

    const mount = async (
        rulesFile: string,
        fetchMock: ReturnType<typeof vi.fn>,
    ) => {
        vi.stubGlobal('fetch', fetchMock);
        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        vi.stubGlobal('matchMedia', () => ({
            matches: false,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));

        const container = document.createElement('div');
        document.body.append(container);
        const root = createRoot(container);

        await act(async () => {
            root.render(
                withClient(
                    <RulesAlert
                        rulesFile={rulesFile}
                        before="before"
                        after="after"
                        modalTitle="title"
                    />,
                ),
            );
        });

        return { container, root };
    };

    const okResponse = (body: string) =>
        Promise.resolve({ ok: true, text: () => Promise.resolve(body) });

    it.each([
        [
            'RULES.md',
            'https://raw.githubusercontent.com/hikka-io/rules/main/RULES.md',
        ],
        [
            'COLLECTION_RULES.md',
            'https://raw.githubusercontent.com/hikka-io/rules/main/COLLECTION_RULES.md',
        ],
    ])(
        'requests %s from the rules repository only once the modal opens',
        async (rulesFile, url) => {
            const fetchMock = vi.fn((_url: string) => okResponse('rules body'));
            const { container, root } = await mount(rulesFile, fetchMock);

            expect(fetchMock).not.toHaveBeenCalled();

            await act(async () => {
                container.querySelector('button')?.click();
            });

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock.mock.calls[0]?.[0]).toBe(url);

            await act(async () => {
                root.unmount();
            });
        },
    );

    it('warms the rules on hover without opening the modal', async () => {
        const fetchMock = vi.fn(() => okResponse('rules body'));
        const { container, root } = await mount('RULES.md', fetchMock);

        await act(async () => {
            container
                .querySelector('button')
                ?.dispatchEvent(
                    new PointerEvent('pointerover', { bubbles: true }),
                );
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);

        await act(async () => {
            root.unmount();
        });
    });

    it('opens quietly when the rules request fails', async () => {
        const fetchMock = vi.fn(() => Promise.reject(new Error('offline')));
        const { container, root } = await mount('RULES.md', fetchMock);

        await act(async () => {
            container.querySelector('button')?.click();
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);

        await act(async () => {
            root.unmount();
        });
    });

    it('does not cache an HTTP error page as the rules text', async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({ ok: false, text: () => Promise.resolve('404') }),
        );
        const { container, root } = await mount('RULES.md', fetchMock);

        await act(async () => {
            container.querySelector('button')?.click();
        });

        expect(document.body.textContent).not.toContain('404');

        await act(async () => {
            root.unmount();
        });
    });
});
