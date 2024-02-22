'use client';

import clsx from 'clsx';
import { MouseEvent } from 'react';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import { useLoggedUser } from '@/app/page.hooks';
import WatchEditModal from '@/components/modals/watch-edit-modal';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';
import createQueryString from '@/utils/createQueryString';

import DetailsCell from './ui/details-cell';
import EpisodesCell from './ui/episodes-cell';
import MediaCell from './ui/media-cell';
import NumberCell from './ui/number-cell';
import ScoreCell from './ui/score-cell';

interface Props {
    data: Hikka.Watch[];
}

const Component = ({ data }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { openModal } = useModalContext();
    const params = useParams();

    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const { data: loggedUser } = useLoggedUser();

    const switchSort = (newSort: 'watch_score' | 'watch_episodes' | 'media_type') => {
        const query = createQueryString(
            'order',
            order && newSort !== sort ? order : order === 'asc' ? 'desc' : 'asc',
            createQueryString(
                'sort',
                newSort,
                new URLSearchParams(searchParams),
            ),
        ).toString();

        router.replace(`${pathname}?${query}`);
    };

    const openWatchEditModal = (
        e: MouseEvent<HTMLElement>,
        anime: Hikka.Anime,
    ) => {
        const target = e.target as HTMLElement;

        if (
            target &&
            'getAttribute' in target &&
            (target.getAttribute('href') || target.getAttribute('src'))
        )
            return;

        openModal({
            content: <WatchEditModal slug={anime.slug} />,
            className: '!max-w-xl',
            title:
                anime[titleLanguage!] ||
                anime.title_ua ||
                anime.title_en ||
                anime.title_ja,
        });
    };

    return (
        <div className="overflow-x-auto">
            <Table className="table">
                <TableHeader className="overflow-hidden rounded-lg bg-secondary/30 backdrop-blur [&_tr]:border-b-0">
                    <TableRow className="border-b-0">
                        <TableHead className="w-8">#</TableHead>
                        <TableHead>Деталі</TableHead>
                        <TableHead
                            className={clsx(
                                'w-20 cursor-pointer select-none hover:underline',
                                sort === 'watch_episodes' && 'text-primary',
                            )}
                            align="center"
                            onClick={() => switchSort('watch_episodes')}
                        >
                            Епізоди
                        </TableHead>
                        <TableHead
                            className={clsx(
                                'hidden w-32 cursor-pointer select-none hover:underline lg:table-cell text-center',
                                sort === 'media_type' && 'text-primary',
                            )}
                            align="center"
                            onClick={() => switchSort('media_type')}
                        >
                            Тип
                        </TableHead>
                        <TableHead
                            className={clsx(
                                'w-20 cursor-pointer select-none hover:underline',
                                sort === 'watch_score' && 'text-primary',
                            )}
                            align="center"
                            onClick={() => switchSort('watch_score')}
                        >
                            Оцінка
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((res, i) => (
                        <TableRow
                            key={res.reference}
                            onClick={(e) =>
                                loggedUser?.username === params.username &&
                                openWatchEditModal(e, res.anime)
                            }
                        >
                            <NumberCell number={i + 1} />
                            <DetailsCell
                                anime={res.anime}
                                titleLanguage={titleLanguage!}
                            />
                            <EpisodesCell
                                episodes={res.episodes}
                                total={res.anime.episodes_total}
                            />
                            <MediaCell media_type={res.anime.media_type} />
                            <ScoreCell score={res.score} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Component;
