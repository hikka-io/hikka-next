'use client';

import { useEffect, useRef } from 'react';



import { useParams, usePathname } from 'next/navigation';



import EditButton from '@/components/edit-button';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';
import useAuth from '@/services/hooks/auth/useAuth';
import useCharacterInfo from '@/services/hooks/characters/useCharacterInfo';
import useIsMobile from '@/services/hooks/useIsMobile';

import { CHARACTER_NAV_ROUTES } from '@/utils/constants';


const Title = () => {
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const divRef = useRef<HTMLDivElement>(null);
    const { auth } = useAuth();
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
                        {auth && (
                            <EditButton
                                key={String(params.slug)}
                                slug={String(params.slug)}
                                content_type="character"
                                className="hidden lg:flex"
                            />
                        )}
                    </div>
                    <P className="mt-2">{character.name_ja}</P>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {auth && (
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type="character"
                            className="flex lg:hidden"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Title;
