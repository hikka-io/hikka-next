import { useMemo } from 'react';

import {
    type AuthTokenInfoResponse,
    thirdPartyAuthTokensInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsAppsRounded from '@/components/icons/material-symbols/MaterialSymbolsAppsRounded';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import AuthorizedAppGroup from './components/authorized-app-group';

type AppGroup = {
    key: string;
    name: string;
    description?: string | null;
    verified?: boolean;
    tokens: AuthTokenInfoResponse[];
};

const AuthorizedAppsSettings = () => {
    const { list } = useInfiniteList(thirdPartyAuthTokensInfiniteOptions());

    const groups = useMemo<AppGroup[]>(() => {
        if (!list) return [];

        const map = new Map<string, AppGroup>();

        for (const token of list) {
            const key =
                token.client?.reference ?? token.client?.name ?? 'unknown';

            const existing = map.get(key);
            if (existing) {
                existing.tokens.push(token);
            } else {
                map.set(key, {
                    key,
                    name: token.client?.name ?? 'Невідомий застосунок',
                    description: token.client?.description,
                    verified: token.client?.verified,
                    tokens: [token],
                });
            }
        }

        // Newest authorization first within each group
        for (const group of map.values()) {
            group.tokens.sort((a, b) => (b.created ?? 0) - (a.created ?? 0));
        }

        return Array.from(map.values());
    }, [list]);

    return (
        <div className="flex w-full flex-col gap-4">
            {groups.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {groups.map((group) => (
                        <AuthorizedAppGroup
                            key={group.key}
                            appName={group.name}
                            appDescription={group.description}
                            verified={group.verified}
                            tokens={group.tokens}
                        />
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
