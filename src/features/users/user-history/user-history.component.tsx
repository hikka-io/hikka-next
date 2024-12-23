'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import useSession from '@/services/hooks/auth/use-session';
import { cn } from '@/utils/utils';

import FollowingHistory from './following-history';
import History from './history';

interface Props {
    className?: string;
}

const UserHistory: FC<Props> = ({ className }) => {
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user: loggedUser } = useSession();

    const type = searchParams.get('type') || 'user';

    const handleChangeType = (value: string) => {
        router.replace(`${pathname}?type=${value}`);
    };

    return (
        <Block className={cn(className)}>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Історія</HeaderTitle>
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
