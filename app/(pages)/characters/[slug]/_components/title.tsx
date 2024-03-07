'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import { useParams, usePathname } from 'next/navigation';

import EditListModal from '@/components/modals/editlist-modal';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import useCharacterInfo from '@/services/hooks/characters/useCharacterInfo';
import useIsMobile from '@/services/hooks/useIsMobile';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';


const EditButton = ({ className }: { className?: string }) => {
    const { openModal } = useModalContext();
    const params = useParams();

    return (
        <Button
            variant="outline"
            size="icon-xs"
            onClick={() =>
                openModal({
                    content: (
                        <EditListModal
                            content_type="character"
                            slug={String(params.slug)}
                        />
                    ),
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
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const divRef = useRef<HTMLDivElement>(null);
    const { secret } = useAuthContext();
    const params = useParams();
    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

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
                        <H2>
                            {character.name_ua ||
                                character.name_en ||
                                character.name_ja ||
                                ''}{' '}
                        </H2>
                        {secret && <EditButton className="hidden lg:flex" />}
                    </div>
                    <P className="mt-2">{character.name_ja}</P>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {secret && <EditButton className="flex lg:hidden" />}
                </div>
            </div>
        </div>
    );
};

export default Component;
