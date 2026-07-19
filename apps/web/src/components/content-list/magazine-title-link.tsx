import { Link } from '@/utils/navigation';
import { ContentTypeEnum, MagazineResponse } from '@hikka/api';

type Props = {
    magazine: MagazineResponse;
    type: Extract<ContentTypeEnum, 'manga' | 'novel'>;
};

export function MagazineTitleLink({ type, magazine }: Props) {
    if (!magazine) return null;

    return (
        <Link
            to={`/${type}`}
            search={{ magazines: magazine.slug }}
            className="flex items-center gap-2 hover:underline"
        >
            <span className="line-clamp-1 font-medium text-sm leading-tight">
                {magazine.name_en}
            </span>
        </Link>
    );
}
