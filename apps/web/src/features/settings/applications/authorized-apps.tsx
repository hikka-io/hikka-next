import { thirdPartyAuthTokensInfiniteOptions } from '@hikka/api';

import MaterialSymbolsAppsRounded from '@/components/icons/material-symbols/MaterialSymbolsAppsRounded';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import AuthorizedAppItem from './components/authorized-app-item';

const AuthorizedAppsSettings = () => {
    const { list } = useInfiniteList(thirdPartyAuthTokensInfiniteOptions());

    return (
        <div className="flex w-full flex-col gap-4">
            {list && list.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {list.map((item) => (
                        <AuthorizedAppItem key={item.reference} token={item} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    bordered
                    icon={<MaterialSymbolsAppsRounded />}
                    title="Немає авторизованих застосунків"
                    description="Тут з’являться застосунки, яким ви надали доступ до свого акаунту"
                />
            )}
        </div>
    );
};

export default AuthorizedAppsSettings;