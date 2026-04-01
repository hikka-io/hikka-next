'use client';

import { usePersonBySlug, useTitle } from '@hikka/react';
import { useRef } from 'react';

import { useParams } from '@/utils/navigation';

const Title = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const { data: person } = usePersonBySlug({ slug: String(params.slug) });
    const title = useTitle(person);

    if (!person) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4" ref={divRef}>
                <div>
                    <div className="flex gap-4">
                        <h2>{title}</h2>
                    </div>
                    <p className="mt-2">{person.name_native}</p>
                </div>
            </div>
        </div>
    );
};

export default Title;
