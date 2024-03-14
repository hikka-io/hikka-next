'use client';

import { useRef } from 'react';

import { useParams } from 'next/navigation';

import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';
import usePersonInfo from '@/services/hooks/people/usePersonInfo';


const Component = () => {
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
                    </div>
                    <P className="mt-2">{person.name_native}</P>
                </div>
            </div>
        </div>
    );
};

export default Component;
