import { useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import { personInfoOptions } from '@hikka/api';

import { usePageTitleAnchor } from '@/features/app-shell';
import { useTitle } from '@/features/auth/hooks/use-title';
import { useParams } from '@/utils/navigation';

const Title = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const { data: person } = useQuery(
        personInfoOptions({ path: { slug: String(params.slug) } }),
    );
    const title = useTitle(person);
    const titleAnchor = usePageTitleAnchor();

    if (!person) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4" ref={divRef}>
                <div>
                    <div className="flex gap-4">
                        <h2 ref={titleAnchor}>{title}</h2>
                    </div>
                    <p className="mt-2">{person.name_native}</p>
                </div>
            </div>
        </div>
    );
};

export default Title;
