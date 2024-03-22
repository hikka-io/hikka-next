'use client';

import { useRef } from 'react';

import { useParams } from 'next/navigation';

import EditButton from '@/components/edit-button';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';
import usePersonInfo from '@/services/hooks/people/usePersonInfo';
import { useAuthContext } from '@/services/providers/auth-provider';


const Component = () => {
    const { secret } = useAuthContext();
    const divRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const { data: person } = usePersonInfo({ slug: String(params.slug) });

    if (!person) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4" ref={divRef}>
                <div>
                    <div className="flex gap-4">
                        <H2>
                            {person.name_ua ||
                                person.name_en ||
                                person.name_native}
                        </H2>
                        {secret && (
                            <EditButton
                                key={String(params.slug)}
                                slug={String(params.slug)}
                                content_type="person"
                                className="hidden lg:flex"
                            />
                        )}
                    </div>
                    <P className="mt-2">{person.name_native}</P>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {secret && (
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

export default Component;
