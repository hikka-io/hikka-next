'use client';

import Modal from '@/app/_components/Modal';
import {Dispatch, ReactNode, SetStateAction, useState} from 'react';
import clsx from 'clsx';
import GeneralForm from './settings/GeneralForm';
import useIsMobile from '@/utils/hooks/useIsMobile';
import EmailForm from "./settings/EmailForm";
import UsernameForm from "@/app/u/[username]/_layout/settings/UsernameForm";
import PasswordForm from "@/app/u/[username]/_layout/settings/PasswordForm";

type Tab = 'general' | 'password' | 'username' | 'email';

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
];

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const Component = ({ open, setOpen }: Props) => {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<Tab | undefined>(
        isMobile ? undefined : 'general',
    );
    // className="md:py-4 md:px-8 flex flex-col gap-6"

    const Tabs = () => {
        return (
            <div className="w-full h-full py-8 flex flex-col gap-4 md:border-r border-r-secondary/60">
                <div className="h-12 flex items-center">
                    <h3 className="px-8">Налаштування</h3>
                </div>
                <ul className="menu p-0 [&_li>*]:rounded-none w-full">
                    {DATA.map((tab) => (
                        <li key={tab.slug}>
                            <a
                                onClick={() => setActiveTab(tab.slug)}
                                className={clsx(
                                    'flex flex-col items-start justify-center gap-0 py-4 px-8',
                                    activeTab === tab.slug && 'active',
                                )}
                            >
                                <p>{tab.title}</p>
                                <p className="text-neutral text-xs">
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
        <Modal
            open={open}
            onDismiss={() => setOpen(false)}
            id="settingsModal"
            boxClassName="p-0"
        >
            <div className="grid md:grid-cols-[40%_1fr] grid-cols-1">
                {isMobile && !activeTab && <Tabs />}
                {!isMobile && <Tabs />}
                {activeForm?.form}
            </div>
        </Modal>
    );
};

export default Component;
