'use client';

import clsx from 'clsx';
import * as React from 'react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

import CustomizationForm from '@/components/modals/user-settings-modal/_components/customization-form';
import EmailForm from '@/components/modals/user-settings-modal/_components/email-form';
import GeneralForm from '@/components/modals/user-settings-modal/_components/general-form';
import PasswordForm from '@/components/modals/user-settings-modal/_components/password-form';
import UsernameForm from '@/components/modals/user-settings-modal/_components/username-form';
import WatchListForm from '@/components/modals/user-settings-modal/_components/watchlist-form';
import useIsMobile from '@/services/hooks/useIsMobile';
import { cn } from '@/utils';

type Tab =
    | 'general'
    | 'password'
    | 'username'
    | 'email'
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
        title: 'Ім\'я користувача',
        description: 'Змінити своє ім\'я',
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

const Tabs = ({ setActiveTab, activeTab }: { activeTab?: Tab, setActiveTab: Dispatch<SetStateAction<Tab | undefined>> }) => {
    return (
        <div className='flex h-full w-full flex-col gap-4 border-r-secondary/60 py-6 lg:border-r'>
            <div className='flex items-center'>
                <h3 className='px-6'>Налаштування</h3>
            </div>
            <ul className='menu w-full p-0 [&_li>*]:rounded-none'>
                {DATA.map((tab) => (
                    <li key={tab.slug}>
                        <a
                            onClick={() => setActiveTab(tab.slug)}
                            className={cn(
                                'flex flex-col items-start justify-center gap-0 px-8 py-4',
                                activeTab === tab.slug ?
                                'active bg-secondary' :
                                'hover:bg-secondary/30',
                                'hover:cursor-pointer',
                            )}
                        >
                            <p>{tab.title}</p>
                            <p className='text-xs text-muted-foreground'>
                                {tab.description}
                            </p>
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
        <div className='grid grid-cols-1 md:grid-cols-[40%_1fr] h-full'>
            {isMobile && !activeTab && <Tabs setActiveTab={setActiveTab} />}
            {!isMobile && <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />}
            {activeForm?.form}
        </div>
    );
};

export default Component;