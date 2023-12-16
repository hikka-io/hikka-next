'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import { useParams, usePathname } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { ANIME_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';


const Component = () => {
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const divRef = useRef<HTMLDivElement>(null);
    const { switchModal } = useModalContext();
    const { secret } = useAuthContext();
    const params = useParams();
    const character: Hikka.Character | undefined = queryClient.getQueryData([
        'character',
        params.slug,
    ]);

    const EditButton = ({ className }: { className?: string }) => {
        return (
            <button
                onClick={() => switchModal('animeEditList')}
                className={clsx(
                    'btn btn-square btn-secondary btn-outline btn-xs',
                    className,
                )}
            >
                <MaterialSymbolsEditRounded />
            </button>
        );
    };

    useEffect(() => {
        if (
            isMobile &&
            divRef.current &&
            ANIME_NAV_ROUTES.some(
                (r) =>
                    r.url !== '' &&
                    pathname === '/characters/' + params.slug + r.url,
            )
        ) {
            divRef.current.scrollIntoView(true);
        }
    }, [pathname]);

    if (!character) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4" ref={divRef}>
                <div>
                    <div className="flex gap-4">
                        <h2>
                            {character.name_ua ||
                                character.name_en ||
                                character.name_ja ||
                                ''}{' '}
                        </h2>
                        {secret && <EditButton className="hidden lg:flex" />}
                    </div>
                    <p className="mt-2">{character.name_ja}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {secret && <EditButton className="flex lg:hidden" />}
                </div>
            </div>
        </div>
    );
};

export default Component;