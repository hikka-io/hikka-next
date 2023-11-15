'use client';

import { Dispatch, SetStateAction } from 'react';
import { Popper } from '@mui/base/Popper';
import { createPortal } from 'react-dom';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import Image from '@/app/_components/Image';

import MaterialSymbolsPerson from '~icons/material-symbols/person';
import MaterialSymbolsEventList from '~icons/material-symbols/event-list';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded';
import Link from 'next/link';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    anchorEl: HTMLButtonElement | null;
}

const Component = ({ open, setOpen, anchorEl }: Props) => {
    const { secret, logout } = useAuthContext();
    const { data: user } = useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: false,
    });

    const closeMenu = () => {
        setOpen(false);
    };

    if (!open || !user) {
        return null;
    }

    return createPortal(
        <div role="presentation" className="fixed z-[1300] inset-0">
            <div
                className="fixed flex items-center justify-center inset-0 bg-black/60 -z-[1]"
                onClick={closeMenu}
            />
            <Popper
                role="menu"
                disablePortal
                placement="bottom-end"
                id="profile"
                open={open}
                anchorEl={anchorEl}
            >
                <div className="mt-3 flex overflow-hidden flex-col rounded-lg w-60 border border-solid border-secondary bg-black shadow-md">
                    <div className="flex gap-4 items-center p-4">
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
                    <ul className="menu p-0 w-full [&_li>*]:rounded-none [&_li>*]:py-3 pb-4">
                        <li>
                            <Link
                                href={'/u/' + user.username}
                                onClick={closeMenu}
                            >
                                <MaterialSymbolsPerson />
                                Профіль
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={'/u/' + user.username + '/list'}
                                onClick={closeMenu}
                            >
                                <MaterialSymbolsEventList />
                                Список аніме
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={'/u/' + user.username + '/favorites'}
                                onClick={closeMenu}
                            >
                                <MaterialSymbolsFavoriteRounded />
                                Улюблене
                            </Link>
                        </li>
                        <li className="mt-2">
                            <button
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                            >
                                <MaterialSymbolsLogoutRounded className="text-error" />
                                Вийти
                            </button>
                        </li>
                    </ul>
                </div>
            </Popper>
        </div>,
        document.body,
    );
};

export default Component;
