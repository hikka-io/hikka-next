import { listUserClientsInfiniteOptions } from '@hikka/api';

import MaterialSymbolsAppsRounded from '@/components/icons/material-symbols/MaterialSymbolsAppsRounded';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import AuthorizedAppsSettings from './authorized-apps';
import ApplicationItem from './components/application-item';
import ClientCreateButton from '../client-create-button';

const ApplicationsSettings = () => {
    const { list } = useInfiniteList(listUserClientsInfiniteOptions());

    return (
        <div className="flex w-full flex-col gap-8">
            <div className="flex w-full flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">
                            Авторизовані застосунки
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>
                <AuthorizedAppsSettings />
            </div>

            <div className="flex w-full flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Мої застосунки</HeaderTitle>
                        <ClientCreateButton />
                    </HeaderContainer>
                </Header>
                {list && list.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {list?.map((item) => (
                            <ApplicationItem
                                key={item.reference}
                                client={item}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        bordered
                        icon={<MaterialSymbolsAppsRounded />}
                        title="Не знайдено застосунків"
                        description="Створіть свій перший застосунок для сторонньої авторизації"
                    />
                )}
            </div>
        </div>
    );
};

export default ApplicationsSettings;