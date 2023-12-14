'use client';

import MaterialSymbolsEventList from '~icons/material-symbols/event-list';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded';
import MaterialSymbolsPerson from '~icons/material-symbols/person';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';

import Image from '@/app/_components/Image';
import Popper from '@/app/_components/Popper';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { usePopperContext } from '@/utils/providers/PopperProvider';

interface Props {
    anchorEl: HTMLButtonElement | null;
}

const Component = ({ anchorEl }: Props) => {
    const { profile, closePoppers } = usePopperContext();
    const { switchModal } = useModalContext();
    const { secret, logout } = useAuthContext();
    const { data: user } = useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: false,
    });

    if (!profile || !user) {
        return null;
    }

    return (
        <Popper
            disablePortal
            placement="bottom-end"
            id="profile"
            open={profile}
            onDismiss={closePoppers}
            anchorEl={anchorEl}
        >
            <div className="flex items-center gap-4 p-4">
                <div className="avatar">
                    <div className="w-10 rounded">
                        <Image
                            src={user.avatar}
                            alt="pfp"
                            width={44}
                            height={44}
                        />
                    </div>
                </div>
                <h5>{user.username}</h5>
            </div>
            <ul className="menu w-full p-0 pb-4 [&_li>*]:rounded-none [&_li>*]:py-3">
                <li>
                    <Link href={'/u/' + user.username} onClick={closePoppers}>
                        <MaterialSymbolsPerson />
                        Профіль
                    </Link>
                </li>
                <li>
                    <Link
                        href={'/u/' + user.username + '/list'}
                        onClick={closePoppers}
                    >
                        <MaterialSymbolsEventList />
                        Список аніме
                    </Link>
                </li>
                <li>
                    <Link
                        href={'/u/' + user.username + '/favorites'}
                        onClick={closePoppers}
                    >
                        <MaterialSymbolsFavoriteRounded />
                        Улюблене
                    </Link>
                </li>
                <li>
                    <button
                        onClick={() => {
                            switchModal('userSettings');
                            closePoppers();
                        }}
                    >
                        <MaterialSymbolsSettingsOutline />
                        Налаштування
                    </button>
                </li>
                <li className="mt-2">
                    <button
                        onClick={() => {
                            logout();
                            closePoppers();
                        }}
                    >
                        <MaterialSymbolsLogoutRounded className="text-error" />
                        Вийти
                    </button>
                </li>
            </ul>
        </Popper>
    );
};

export default Component;
