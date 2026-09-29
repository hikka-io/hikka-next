import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

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
                            <HeaderContainer>
                                <HeaderTitle>Профіль</HeaderTitle>
                            </HeaderContainer>
                        </Header>
                        <p className="text-muted-foreground text-sm">Опис</p>
                    </div>
                    <i>body</i>
                </div>,
            ),
        );
    });

    it('renders the action inside the header container', () => {
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
                            <HeaderContainer>
                                <HeaderTitle>Мої застосунки</HeaderTitle>
                                <b>add</b>
                            </HeaderContainer>
                        </Header>
                        <p className="text-muted-foreground text-sm">Опис</p>
                    </div>
                    <i>body</i>
                </div>,
            ),
        );
    });

    it('renders the trailing action beside the header container', () => {
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
                            <HeaderContainer>
                                <HeaderTitle>Вигляд</HeaderTitle>
                            </HeaderContainer>
                            <b>reset</b>
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
    it('renders an h4 header above the content', () => {
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
                        <HeaderContainer>
                            <HeaderTitle variant="h4">Пароль</HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <i>content</i>
                </div>,
            ),
        );
    });
});
