'use client';

import { FC } from 'react';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import useSession from '@/services/hooks/auth/useSession';
import { cn } from '@/utils/utils';

import FollowingHistory from './components/following-history';
import UserHistory from './components/user-history';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
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
            <Header title="Історія">
                <ToggleGroup
                    type="single"
                    value={type}
                    onValueChange={handleChangeType}
                    variant="outline"
                    size="badge"
                >
                    <ToggleGroupItem value="user" aria-label="Власна історія">
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
            </Header>
            {type === 'user' && <UserHistory />}
            {type === 'following' && <FollowingHistory />}
        </Block>
    );
};

export default History;
