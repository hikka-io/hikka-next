'use client';

import { useSession } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';
import { useParams } from '@/utils/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { cn } from '@/utils/cn';

import FollowingHistory from './components/following-history';
import History from './components/history';

interface Props {
    className?: string;
}

const UserHistory: FC<Props> = ({ className }) => {
    const params = useParams();
    const router = useRouter();
    const { type: searchType } = useFilterSearch<{ type?: string }>();
    const { user: loggedUser } = useSession();

    const type = searchType || 'user';

    const handleChangeType = (value: string) => {
        router.navigate({
            to: '.',
            search: { type: value },
            replace: true,
        } as any);
    };

    return (
        <Block className={cn(className)}>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">Історія</HeaderTitle>
                    <ToggleGroup
                        type="single"
                        value={type}
                        onValueChange={handleChangeType}
                        size="badge"
                    >
                        <ToggleGroupItem
                            value="user"
                            aria-label="Власна історія"
                        >
                            Власна
                        </ToggleGroupItem>
                        {params.username === loggedUser?.username && (
                            <ToggleGroupItem
                                value="following"
                                aria-label="Історія відстежуючих"
                            >
                                Відстежується
                            </ToggleGroupItem>
                        )}
                    </ToggleGroup>
                </HeaderContainer>
            </Header>
            {type === 'user' && <History />}
            {type === 'following' && <FollowingHistory />}
        </Block>
    );
};

export default UserHistory;
