'use client';

import { usePersonBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';
import { useRef } from 'react';

const Title = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const { data: person } = usePersonBySlug({ slug: String(params.slug) });

    if (!person) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4" ref={divRef}>
                <div>
                    <div className="flex gap-4">
                        <h2>{person.title}</h2>
                    </div>
                    <p className="mt-2">{person.name_native}</p>
                </div>
            </div>
        </div>
    );
};

export default Title;
