import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

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
        const html = renderToString(<EditRulesAlert />);

        expect(html).toBe(renderToString(<LegacyEditRulesAlert />));
        expect(html).toContain('нашими правилами');
    });

    it('matches the former collection alert', () => {
        const html = renderToString(<CollectionRulesAlert />);

        expect(html).toBe(renderToString(<LegacyCollectionRulesAlert />));
        expect(html).toContain('нашими правилами');
    });
});

describe('RulesAlert fetch', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it.each([
        [
            'RULES.md',
            'https://raw.githubusercontent.com/hikka-io/rules/main/RULES.md',
        ],
        [
            'COLLECTION_RULES.md',
            'https://raw.githubusercontent.com/hikka-io/rules/main/COLLECTION_RULES.md',
        ],
    ])('requests %s from the rules repository', async (rulesFile, url) => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({ text: () => Promise.resolve('') }),
        );
        vi.stubGlobal('fetch', fetchMock);
        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        vi.stubGlobal('matchMedia', () => ({
            matches: false,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));

        const container = document.createElement('div');
        const root = createRoot(container);

        await act(async () => {
            root.render(
                <RulesAlert
                    rulesFile={rulesFile}
                    before="before"
                    after="after"
                    modalTitle="title"
                />,
            );
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(url);

        await act(async () => {
            root.unmount();
        });
    });
});
