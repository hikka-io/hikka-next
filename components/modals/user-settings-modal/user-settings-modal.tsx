'use client';

import * as React from 'react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import MaterialSymbolsKeyboardBackspaceRounded from '~icons/material-symbols/keyboard-backspace-rounded';

import CustomizationForm from '@/components/modals/user-settings-modal/components/customization-form';
import EmailForm from '@/components/modals/user-settings-modal/components/email-form';
import GeneralForm from '@/components/modals/user-settings-modal/components/general-form';
import NotificationsForm from '@/components/modals/user-settings-modal/components/notifications-form';
import PasswordForm from '@/components/modals/user-settings-modal/components/password-form';
import UsernameForm from '@/components/modals/user-settings-modal/components/username-form';
import WatchListForm from '@/components/modals/user-settings-modal/components/watchlist-form';
import H3 from '@/components/typography/h3';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useIsMobile from '@/services/hooks/useIsMobile';
import { cn } from '@/utils/utils';

type Tab =
    | 'general'
    | 'password'
    | 'username'
    | 'email'
    | 'notifications'
    | 'watchList'
    | 'customization';

const DATA: {
    title: string;
    description: string;
    slug: Tab;
    form: ReactNode;
}[] = [
    {
        title: 'Загальне',
        description: 'Змінити загальні дані профілю',
        slug: 'general',
        form: <GeneralForm />,
    },
    {
        title: 'Імпорт',
        description: 'Імпорт Вашого списку аніме',
        slug: 'watchList',
        form: <WatchListForm />,
    },
    {
        title: 'Email',
        description: 'Змінити свій email',
        slug: 'email',
        form: <EmailForm />,
    },
    {
        title: "Ім'я користувача",
        description: "Змінити своє ім'я",
        slug: 'username',
        form: <UsernameForm />,
    },
    {
        title: 'Пароль',
        description: 'Змінити свій пароль',
        slug: 'password',
        form: <PasswordForm />,
    },
    {
        title: 'Сповіщення',
        description: 'Змінити налаштування сповіщень',
        slug: 'notifications',
        form: <NotificationsForm />,
    },
    {
        title: 'Кастомізація',
        description: 'Зміна налаштувань перегляду контенту на сайті',
        slug: 'customization',
        form: <CustomizationForm />,
    },
];

const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => {
    return (
        <div className="flex items-center justify-center gap-2 border-b px-6 pb-4 sm:justify-start">
            {onBack && (
                <Button
                    onClick={onBack}
                    variant="outline"
                    size="icon-xs"
                    className="flex sm:hidden"
                >
                    <MaterialSymbolsKeyboardBackspaceRounded />
                </Button>
            )}
            <H3>{title}</H3>
        </div>
    );
};

const Tabs = ({
    setActiveTab,
    activeTab,
}: {
    activeTab?: Tab;
    setActiveTab: Dispatch<SetStateAction<Tab | undefined>>;
}) => {
    return (
        <div className="flex size-full flex-col border-r-secondary/60 py-6 md:border-r">
            <Header title="Налаштування" />
            <ul className="w-full p-0 [&_li>*]:rounded-none">
                {DATA.map((tab) => (
                    <li key={tab.slug}>
                        <a
                            onClick={() => setActiveTab(tab.slug)}
                            className={cn(
                                'flex flex-col items-start justify-center px-8 py-4',
                                activeTab === tab.slug
                                    ? 'bg-muted'
                                    : 'hover:bg-secondary/30',
                                'hover:cursor-pointer',
                            )}
                        >
                            <Label>{tab.title}</Label>
                            <Small className="text-muted-foreground">
                                {tab.description}
                            </Small>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Component = () => {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<Tab | undefined>(
        isMobile ? undefined : 'general',
    );

    const activeForm = DATA.find((tab) => tab.slug === activeTab);

    return (
        <div className="grid h-full grid-cols-1 md:grid-cols-[40%_1fr]">
            {isMobile && !activeTab && <Tabs setActiveTab={setActiveTab} />}
            {!isMobile && (
                <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
            )}
            <div className="flex max-h-screen flex-col border-r-secondary/60 pt-6 md:border-r">
                {activeForm && (
                    <Header
                        onBack={() => setActiveTab(undefined)}
                        title={activeForm?.title}
                    />
                )}
                <div className="flex-1 overflow-y-scroll">
                    {activeForm?.form}
                </div>
            </div>
        </div>
    );
};

export default Component;
