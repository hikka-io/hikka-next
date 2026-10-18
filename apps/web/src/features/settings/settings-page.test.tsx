import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';

import SettingsPage from './settings-page';
import SettingsSection from './settings-section';

const html = (node: ReactNode) => renderToStaticMarkup(node);

describe('SettingsPage', () => {
    it('renders the page header and body', () => {
        expect(
            html(
                <SettingsPage title="Профіль" description="Опис">
                    <i>body</i>
                </SettingsPage>,
            ),
        ).toBe(
            html(
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                        <Header>
                            <HeaderTitle>Профіль</HeaderTitle>
                        </Header>
                        <p className="text-muted-foreground text-sm">Опис</p>
                    </div>
                    <i>body</i>
                </div>,
            ),
        );
    });

    it('renders the action inline after the title', () => {
        expect(
            html(
                <SettingsPage
                    title="Мої застосунки"
                    description="Опис"
                    action={<b>add</b>}
                >
                    <i>body</i>
                </SettingsPage>,
            ),
        ).toBe(
            html(
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                        <Header>
                            <HeaderTitle>Мої застосунки</HeaderTitle>
                            <b>add</b>
                        </Header>
                        <p className="text-muted-foreground text-sm">Опис</p>
                    </div>
                    <i>body</i>
                </div>,
            ),
        );
    });

    it('renders the trailing action in the header actions', () => {
        expect(
            html(
                <SettingsPage
                    title="Вигляд"
                    description="Опис"
                    trailingAction={<b>reset</b>}
                >
                    <i>body</i>
                </SettingsPage>,
            ),
        ).toBe(
            html(
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col">
                        <Header>
                            <HeaderTitle>Вигляд</HeaderTitle>
                            <HeaderActions>
                                <b>reset</b>
                            </HeaderActions>
                        </Header>
                        <p className="text-muted-foreground text-sm">Опис</p>
                    </div>
                    <i>body</i>
                </div>,
            ),
        );
    });
});

describe('SettingsSection', () => {
    it('renders an h3 subsection header above the content', () => {
        expect(
            html(
                <SettingsSection title="Пароль">
                    <i>content</i>
                </SettingsSection>,
            ),
        ).toBe(
            html(
                <div className="flex flex-col gap-4">
                    <Header>
                        <HeaderTitle as="h3" size="subsection">
                            Пароль
                        </HeaderTitle>
                    </Header>
                    <i>content</i>
                </div>,
            ),
        );
    });
});
