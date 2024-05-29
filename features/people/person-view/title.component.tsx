'use client';

import { useParams } from 'next/navigation';
import { useRef } from 'react';

import EditButton from '@/components/edit-button';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';

import useSession from '@/services/hooks/auth/use-session';
import usePersonInfo from '@/services/hooks/people/use-person-info';

const Title = () => {
    const { user: loggedUser } = useSession();
    const divRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const { data: person } = usePersonInfo({ slug: String(params.slug) });

    if (!person) {
        return null;
    }

    const name = person.name_ua || person.name_en || person.name_native;
    const otherLanguagesName =
        name === person.name_en
            ? person.name_native
            : `${person.name_native} / ${person.name_en}`;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4" ref={divRef}>
                <div>
                    <div className="flex gap-4">
                        <H2>{name}</H2>
                        {loggedUser && (
                            <EditButton
                                key={String(params.slug)}
                                slug={String(params.slug)}
                                content_type="person"
                                className="hidden lg:flex"
                            />
                        )}
                    </div>
                    <P className="mt-2">{otherLanguagesName}</P>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {loggedUser && (
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type="person"
                            className="flex lg:hidden"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Title;
