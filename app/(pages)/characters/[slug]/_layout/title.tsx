'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import { useParams, usePathname } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { CHARACTER_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import { Button } from '@/app/_components/ui/button';


const EditButton = ({ className }: { className?: string }) => {
    const { switchModal } = useModalContext();

    return (
        <Button
            variant="outline"
            size="icon-xs"
            onClick={() => switchModal('animeEditList')}
            className={clsx(
                className,
            )}
        >
            <MaterialSymbolsEditRounded />
        </Button>
    );
};

const Component = () => {
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const divRef = useRef<HTMLDivElement>(null);
    const { secret } = useAuthContext();
    const params = useParams();
    const character: Hikka.Character | undefined = queryClient.getQueryData([
        'character',
        params.slug,
    ]);

    useEffect(() => {
        if (
            isMobile &&
            divRef.current &&
            CHARACTER_NAV_ROUTES.some(
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
                    {/*{secret && <EditButton className="flex lg:hidden" />}*/}
                </div>
            </div>
        </div>
    );
};

export default Component;