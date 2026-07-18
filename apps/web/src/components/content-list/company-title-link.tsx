import { Link } from '@/utils/navigation';
import { CompanyResponse } from '@hikka/api';

type Props = {
    studio: CompanyResponse;
};

export function CompanyTitleLink({ studio }: Props) {
    if (!studio) return null;

    return (
        <Link
            to="/anime"
            search={{ studios: studio.slug }}
            className="flex items-center gap-2 hover:underline"
        >
            {studio.image && (
                <img
                    src={studio.image}
                    alt={studio.name}
                    width={48}
                    height={48}
                    className="w-6 shrink-0 rounded-sm object-cover"
                    loading="lazy"
                />
            )}
            <span className="line-clamp-1 font-medium text-sm leading-tight">
                {studio.name}
            </span>
        </Link>
    );
}
