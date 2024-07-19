'use client';

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import MaterialSymbolsKeyboardBackspaceRounded from '~icons/material-symbols/keyboard-backspace-rounded';

import H3 from '@/components/typography/h3';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import CustomizationForm from '@/features/modals/user-settings-modal/customization-form';
import EmailForm from '@/features/modals/user-settings-modal/email-form';
import GeneralForm from '@/features/modals/user-settings-modal/general-form/general-form';
import NotificationsForm from '@/features/modals/user-settings-modal/notifications-form';
import PasswordForm from '@/features/modals/user-settings-modal/password-form';
import ReadListForm from '@/features/modals/user-settings-modal/readlist-form/readlist-form';
import UsernameForm from '@/features/modals/user-settings-modal/username-form';
import WatchListForm from '@/features/modals/user-settings-modal/watchlist-form/watchlist-form';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/utils';

type Tab =
    | 'general'
    | 'password'
    | 'username'
    | 'email'
    | 'notifications'
    | 'watchList'
    | 'readList'
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
        title: 'Імпорт аніме',
        description: 'Імпорт Вашого списку аніме',
        slug: 'watchList',
        form: <WatchListForm />,
    },
    {
        title: 'Імпорт манґи та ранобе',
        description: 'Імпорт Вашого списку манґи та ранобе',
        slug: 'readList',
        form: <ReadListForm />,
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
        <div className="flex items-center justify-center gap-2 border-b px-6 py-4 sm:justify-start">
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
        <div className="flex size-full flex-col border-r-secondary/60 md:border-r">
            <Header title="Налаштування" />
            <ul className="w-full p-0 [&_li>*]:rounded-none">
                {DATA.map((tab) => (
                    <li key={tab.slug}>
                        <a
                            onClick={() => setActiveTab(tab.slug)}
                            className={cn(
                                'flex flex-col items-start justify-center px-6 py-4',
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
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [activeTab, setActiveTab] = useState<Tab | undefined>('general');

    useEffect(() => {
        if (!isDesktop) {
            setActiveTab(undefined);
        } else {
            setActiveTab('general');
        }
    }, [isDesktop]);

    const activeForm = DATA.find((tab) => tab.slug === activeTab);

    return (
        <div className="grid h-full grid-cols-1 md:grid-cols-[40%_1fr]">
            {!isDesktop && !activeTab && <Tabs setActiveTab={setActiveTab} />}
            {isDesktop && (
                <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
            )}
            <div className="flex flex-1 flex-col overflow-hidden">
                {activeForm && (
                    <Header
                        onBack={() => setActiveTab(undefined)}
                        title={activeForm?.title}
                    />
                )}
                {activeForm?.form}
            </div>
        </div>
    );
};

export default Component;
