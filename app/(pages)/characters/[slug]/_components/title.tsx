'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import { useParams, usePathname } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import { CHARACTER_NAV_ROUTES } from '@/app/_utils/constants';
import useIsMobile from '@/app/_utils/hooks/useIsMobile';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';
import { useModalContext } from '@/app/_utils/providers/modal-provider';
import EditListModal from '@/app/_components/modals/editlist-modal';


const EditButton = ({ className }: { className?: string }) => {
    const { openModal } = useModalContext();
    const params = useParams();

    return (
        <Button
            variant="outline"
            size="icon-xs"
            onClick={() =>
                openModal({
                    content: <EditListModal content_type="character" slug={String(params.slug)} />,
                    type: 'sheet',
                    title: 'Список правок',
                })
            }
            className={clsx(className)}
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
                    {secret && <EditButton className="flex lg:hidden" />}
                </div>
            </div>
        </div>
    );
};

export default Component;