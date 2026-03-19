'use client';

import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useRandomReadByStatus, useRandomWatchByStatus } from '@hikka/react';
import { useRouter } from '@tanstack/react-router';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import FeRandom from '@/components/icons/fe/FeRandom';
import MaterialSymbolsMoreVert from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { ReadFiltersModal } from '@/features/read';
import { AnimeFiltersModal } from '@/features/watch';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const ToolsCombobox = ({ content_type }: Props) => {
    const search = useFilterSearch<{ status?: string }>();
    const params = useParams();
    const router = useRouter();

    const status = search.status as ReadStatusEnum | WatchStatusEnum;

    const mutationRandomRead = useRandomReadByStatus({
        options: {
            onSuccess: (data) => {
                router.navigate({ to: `/${content_type}/${data.slug}` as '/' });
            },
        },
    });
    const mutationRandomWatch = useRandomWatchByStatus({
        options: {
            onSuccess: (data) => {
                router.navigate({ to: `/${content_type}/${data.slug}` as '/' });
            },
        },
    });

    const handleRandomContent = async () => {
        if (content_type !== ContentTypeEnum.ANIME) {
            mutationRandomRead.mutate({
                contentType: content_type,
                username: String(params.username),
                status: status as ReadStatusEnum,
            });
            return;
        }

        mutationRandomWatch.mutate({
            username: String(params.username),
            status: status as WatchStatusEnum,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-md">
                    <MaterialSymbolsMoreVert />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRandomContent}>
                    <FeRandom className="size-4" />
                    <span>
                        Випадкове{' '}
                        <span className="lowercase">
                            {CONTENT_TYPES[content_type].title_ua}
                        </span>
                    </span>
                </DropdownMenuItem>
                {content_type !== ContentTypeEnum.ANIME && (
                    <ReadFiltersModal
                        sort_type="read"
                        content_type={content_type}
                    >
                        <DropdownMenuItem
                            className="flex lg:hidden"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <AntDesignFilterFilled className="size-4" /> Фільтри
                        </DropdownMenuItem>
                    </ReadFiltersModal>
                )}
                {content_type === ContentTypeEnum.ANIME && (
                    <AnimeFiltersModal sort_type="watch">
                        <DropdownMenuItem
                            className="flex lg:hidden"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <AntDesignFilterFilled className="size-4" /> Фільтри
                        </DropdownMenuItem>
                    </AnimeFiltersModal>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ToolsCombobox;
