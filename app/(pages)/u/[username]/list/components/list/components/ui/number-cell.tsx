'use client';

import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';

import { useParams } from 'next/navigation';

import WatchEditModal from '@/components/modals/watch-edit-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    number: number;
    anime: API.Anime;
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
}

const Component = ({ number, anime, titleLanguage }: Props) => {
    const params = useParams();
    const { openModal } = useModalContext();
    const { data: loggedUser } = useLoggedUser();

    const openWatchEditModal = () => {
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
        <TableCell className="w-12 pr-0">
            {loggedUser?.username === params.username && (
                <Button
                    size="icon-sm"
                    className="hidden group-hover:flex"
                    onClick={openWatchEditModal}
                >
                    <MaterialSymbolsMoreVert />
                </Button>
            )}
            <Label
                className={cn(
                    'text-muted-foreground',
                    loggedUser?.username === params.username &&
                        'inline group-hover:hidden',
                )}
            >
                {number}
            </Label>
        </TableCell>
    );
};

export default Component;
