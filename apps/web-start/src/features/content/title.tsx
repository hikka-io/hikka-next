import { ContentTypeEnum } from '@hikka/api';

import { CONTENT_CONFIG } from '@/utils/constants/common';
import { Link, useParams } from '@/utils/navigation';
import { useTitle } from '@/utils/title/use-title';

type TitleProps = {
    className?: string;
    content_type: 'anime' | 'manga' | 'novel';
};

const Title = ({ className, content_type }: TitleProps) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));
    const title = useTitle(data);

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col justify-between gap-4" id="content-title">
            <div className="flex flex-col">
                <h2>{title}</h2>

                <p className="text-muted-foreground text-sm">
                    {data.data_type === ContentTypeEnum.ANIME
                        ? 'title_ja' in data
                            ? data.title_ja
                            : null
                        : 'title_original' in data
                          ? (data as { title_original?: string | null })
                                .title_original
                          : null}
                </p>
            </div>
            <div className="flex items-center justify-between gap-2">
                {data.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.genres.map((genre) => (
                            <span key={genre.slug} className="text-sm">
                                <Link
                                    className="rounded px-1 underline decoration-primary-foreground decoration-dashed transition-colors duration-100 hover:bg-primary-border hover:text-primary-foreground"
                                    to={`/${content_type}`}
                                    search={{ genres: [genre.slug] }}
                                >
                                    {genre.name_ua}
                                </Link>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Title;
