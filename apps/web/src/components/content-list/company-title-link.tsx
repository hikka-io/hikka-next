import type { CompanyResponse } from '@hikka/api';

import { Link } from '@/utils/navigation';

type Props = {
    studio: CompanyResponse;
};

export function CompanyTitleLink({ studio }: Props) {
    if (!studio) return null;

    return (
        <Link
            to="/anime"
            search={{ studios: studio.slug }}
            className="flex items-center gap-1.5 hover:underline"
        >
            {studio.image && (
                <img
                    src={studio.image}
                    alt={studio.name}
                    width={48}
                    height={48}
                    className="w-5 shrink-0 rounded-sm object-cover md:w-6"
                    loading="lazy"
                />
            )}
            <span className="line-clamp-1 font-medium leading-tight">
                {studio.name}
            </span>
        </Link>
    );
}
