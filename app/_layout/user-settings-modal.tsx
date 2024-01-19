'use client';

import clsx from 'clsx';
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useState,
} from 'react';

import Modal from '@/app/_components/modal';
import EmailForm from '@/app/_layout/user-settings/email-form';
import GeneralForm from '@/app/_layout/user-settings/general-form';
import PasswordForm from '@/app/_layout/user-settings/password-form';
import UsernameForm from '@/app/_layout/user-settings/username-form';
import WatchListForm from '@/app/_layout/user-settings/watchlist-form';
import useIsMobile from '@/utils/hooks/useIsMobile';
import { useModalContext } from '@/utils/providers/modal-provider';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/_components/ui/sheet';
import { Button } from '@/app/_components/ui/button';
import Link from 'next/link';
import EditCard from '@/app/_components/edit-card';
import * as React from 'react';
import CustomizationForm from '@/app/_layout/user-settings/customization-form';

type Tab = 'general' | 'password' | 'username' | 'email' | 'watchList' | 'customization';

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
        title: 'Кастомізація',
        description: 'Зміна налаштувань перегляду контенту на сайті',
        slug: 'customization',
        form: <CustomizationForm />,
    },
];

const Component = () => {
    const { userSettings, closeModals, switchModal } = useModalContext();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<Tab | undefined>(
        isMobile ? undefined : 'general',
    );

    useEffect(() => {
        if (!userSettings) {
            setActiveTab(isMobile ? undefined : 'general');
        }
    }, [userSettings]);

    const Tabs = () => {
        return (
            <div className="flex h-full w-full flex-col gap-4 border-r-secondary/60 py-6 lg:border-r">
                <div className="flex items-center">
                    <h3 className="px-6">Налаштування</h3>
                </div>
                <ul className="menu w-full p-0 [&_li>*]:rounded-none">
                    {DATA.map((tab) => (
                        <li key={tab.slug}>
                            <a
                                onClick={() => setActiveTab(tab.slug)}
                                className={clsx(
                                    'flex flex-col items-start justify-center gap-0 px-8 py-4',
                                    activeTab === tab.slug &&
                                        'active !bg-secondary !text-base-content',
                                )}
                            >
                                <p>{tab.title}</p>
                                <p className="label-text-alt text-xs opacity-60">
                                    {tab.description}
                                </p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const activeForm = DATA.find((tab) => tab.slug === activeTab);

    return (
        <Sheet
            open={Boolean(userSettings)}
            onOpenChange={(open) => switchModal("userSettings", open)}
            // className="p-0 max-w-3xl"
        >
            <SheetContent side="left" className="!max-w-3xl flex flex-col gap-0 p-0">
                {Boolean(userSettings) && (
                    <div className="grid grid-cols-1 md:grid-cols-[40%_1fr] h-full">
                        {isMobile && !activeTab && <Tabs />}
                        {!isMobile && <Tabs />}
                        {activeForm?.form}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default Component;
