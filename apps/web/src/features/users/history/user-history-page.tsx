import type { FC } from 'react';

import { useRouter } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';
import { useParams, useRouteSearch } from '@/utils/navigation';
import type { HistorySearch } from '@/utils/search-schemas';

import FollowingHistory from './following-history';
import History from './history';

type Props = {
    className?: string;
};

const UserHistoryPage: FC<Props> = ({ className }) => {
    const params = useParams();
    const router = useRouter();
    const { type: searchType } = useRouteSearch<HistorySearch>();
    const { user: loggedUser } = useSession();

    const type = searchType || 'user';

    const handleChangeType = (value: string) => {
        router.navigate({
            to: '.',
            search: { type: value },
            replace: true,
        });
    };

    return (
        <Block className={cn(className)}>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">Історія</HeaderTitle>
                    <Tabs value={type} onValueChange={handleChangeType}>
                        <TabsList size="sm">
                            <TabsTrigger
                                value="user"
                                aria-label="Власна історія"
                            >
                                Власна
                            </TabsTrigger>
                            {params.username === loggedUser?.username && (
                                <TabsTrigger
                                    value="following"
                                    aria-label="Історія відстежуючих"
                                >
                                    Відстежується
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </Tabs>
                </HeaderContainer>
            </Header>
            {type === 'user' && <History />}
            {type === 'following' && <FollowingHistory />}
        </Block>
    );
};

export default UserHistoryPage;
