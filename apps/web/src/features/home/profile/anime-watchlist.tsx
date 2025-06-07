'use client';

import { WatchResponse, WatchStatusEnum } from '@hikka/client';
import { useCreateWatch, useSearchUserWatches, useSession } from '@hikka/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';

import { Progress } from '@/components/ui/progress';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useDebouncedState } from '@/services/hooks/use-debounce';
import { useModalContext } from '@/services/providers/modal-provider';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';
import { cn } from '@/utils/utils';

import WatchEditModal from '../../modals/watch-edit-modal.component';
import GenericList from './generic-list';

const EPISODES_DECLENSION: [string, string, string] = [
  'епізод',
  'епізоди',
  'епізодів',
];

interface AnimeWatchlistProps { }

const AnimeWatchlist: React.FC<AnimeWatchlistProps> = () => {
  const { user } = useSession();
  const router = useRouter();
  const { openModal } = useModalContext();

  const [_, updatedWatch, setUpdatedWatch] = useDebouncedState<WatchResponse>();

  const { mutate: mutateCreateWatch, reset } = useCreateWatch();

  const openEditModal = (watch: WatchResponse) => {
    if (watch) {
      openModal({
        content: (
          <WatchEditModal
            watch={watch}
            slug={watch.anime.slug}
          />
        ),
        className: '!max-w-xl',
        title: watch.anime.title,
        forceModal: true,
      });
    }
  };

  const handleAddEpisode = (watch: WatchResponse) => {
    if (!watch) return;

    const episodes = (updatedWatch?.episodes ?? watch.episodes) + 1;

    // Prevent exceeding total episodes
    if (
      watch.anime.episodes_total &&
      episodes > watch.anime.episodes_total
    )
      return;

    setUpdatedWatch({
      ...watch,
      status:
        episodes === watch.anime.episodes_total
          ? WatchStatusEnum.COMPLETED
          : WatchStatusEnum.WATCHING,
      episodes,
    });
  };

  const handleRemoveEpisode = (watch: WatchResponse) => {
    if (!watch) return;

    const episodes = (updatedWatch?.episodes ?? watch.episodes) - 1;

    if (episodes < 0) return;

    setUpdatedWatch({
      ...watch,
      episodes,
    });
  };

  useEffect(() => {
    if (updatedWatch) {
      mutateCreateWatch({
        slug: updatedWatch.anime.slug,
        args: {
          note: updatedWatch.note,
          episodes: updatedWatch.episodes,
          rewatches: updatedWatch.rewatches,
          score: updatedWatch.score,
          status: updatedWatch.status,
        },
      });
    }
  }, [mutateCreateWatch, updatedWatch]);

  return (
    <GenericList
      resetSelection={reset}
      useList={
        () => (
          useSearchUserWatches({
            username: user!!.username, args: {
              watch_status: WatchStatusEnum.WATCHING,
              sort: ["watch_updated:desc"]
            }
          }).list
        )}
      renderListItem={(item, selected, onClick) => (
        <Tooltip key={item.anime.slug}>
          <TooltipTrigger asChild>
            <ContentCard
              onClick={onClick}
              image={item.anime.image}
              className={cn(
                'transition-opacity',
                !selected &&
                'opacity-30 hover:opacity-60',
              )}
            />
          </TooltipTrigger>
          <TooltipContent className="max-w-48 truncate">
            {item.anime.title}
          </TooltipContent>
        </Tooltip>
      )}
      renderSelectedItem={(item) => (
        <>
          <Link
            className="w-fit flex-1"
            href={`/anime/${item.anime.slug}`}
          >
            <H5>{item.anime.title}</H5>
            <AnimeDetails watch={item} />
          </Link>

          <div className="flex w-full flex-col gap-2">
            <P className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">
                {updatedWatch?.episodes ??
                  item.episodes}
              </span>
              /{item.anime.episodes_total ?? '?'}{' '}
              епізодів
            </P>

            <Progress
              className="h-2"
              value={
                updatedWatch?.episodes ??
                item.episodes
              }
              max={
                item.anime.episodes_total ??
                item.episodes
              }
            />
          </div>

          <ActionButtons
            addEpisode={() => { handleAddEpisode(item) }}
            removeEpisode={() => { handleRemoveEpisode(item) }}
            openEditModal={() => { openEditModal(item) }}
          />
        </>
      )}
      openPage={(item) => { router.push(`/anime/${item.anime.slug}`) }}
    />
  )
}

const AnimeDetails = ({ watch }: { watch: WatchResponse }): React.ReactElement => {
  // Rendering Helper: Anime Details
  return (
    <div className="mt-1 flex cursor-pointer items-center gap-2">
      {watch.anime.year && (
        <Label className="cursor-pointer text-xs text-muted-foreground">
          {watch.anime.year}
        </Label>
      )}
      {watch.anime.media_type && (
        <>
          <div className="size-1 rounded-full bg-muted-foreground" />
          <Label className="cursor-pointer text-xs text-muted-foreground">
            {
              ANIME_MEDIA_TYPE[watch.anime.media_type]
                .title_ua
            }
          </Label>
        </>
      )}
      {watch.anime.episodes_total && (
        <>
          <div className="size-1 rounded-full bg-muted-foreground" />
          <Label className="cursor-pointer text-xs text-muted-foreground">
            {watch.anime.episodes_total}{' '}
            {getDeclensionWord(
              watch.anime.episodes_total,
              EPISODES_DECLENSION,
            )}
          </Label>
        </>
      )}
    </div>
  );
};

const ActionButtons = ({ addEpisode, removeEpisode, openEditModal }: { addEpisode: () => void, removeEpisode: () => void, openEditModal: () => void }): React.ReactElement => {
  // Rendering Helper: Buttons
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" size="md" onClick={openEditModal}>
        <MaterialSymbolsSettingsOutlineRounded />
        Налаштування
      </Button>
      <div className="flex">
        <Button
          className="flex-1 rounded-r-none"
          onClick={addEpisode}
          variant="secondary"
          size="md"
        >
          <MaterialSymbolsAddRounded />
          <div className="flex gap-1">
            <span className="hidden sm:block">Додати</span>
            <span className="capitalize sm:normal-case">
              епізод
            </span>
          </div>
        </Button>
        <Button
          className="rounded-l-none"
          onClick={removeEpisode}
          variant="secondary"
          size="icon-md"
        >
          <MaterialSymbolsRemoveRounded />
        </Button>
      </div>
    </div>
  );
};

export default AnimeWatchlist;
