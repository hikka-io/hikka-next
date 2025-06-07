'use client';

import { WatchArgs, WatchResponse, WatchStatusEnum } from '@hikka/client';
import { useCreateWatch, useSearchUserWatches, useSession } from '@hikka/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import Stack from '@/components/ui/stack';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useDebounce, { useDebouncedState } from '@/services/hooks/use-debounce';
import { useModalContext } from '@/services/providers/modal-provider';
import { ANIME_MEDIA_TYPE } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';
import { cn } from '@/utils/utils';

import WatchEditModal from '../../modals/watch-edit-modal.component';

const EPISODES_DECLENSION: [string, string, string] = [
  'епізод',
  'епізоди',
  'епізодів',
];

interface GenericListProps<T> {
  useList: () => T[] | undefined;
  openPage: (item: T) => void;
  renderListItem: (item: T, selected: boolean, onClick: () => void) => React.ReactElement;
  renderSelectedItem: (item: T) => React.ReactElement;
  resetSelection: () => void;
}

const GenericList = <T,>(
  {
    useList,
    openPage,
    renderListItem,
    renderSelectedItem,
    resetSelection,
  }: GenericListProps<T>
): React.ReactElement => {
  // State Management
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  useEffect(() => {
    resetSelection()
  }, [selectedIndex])

  // Fetch list
  const list = useList();

  // Derived State
  const selectedEntry = list?.[selectedIndex]

  // Event Handlers
  const selectEntry = (index: number) => {
    if (index == selectedIndex) {
      openPage(selectedEntry!!)
      return;
    }

    setSelectedIndex(index);
  };


  // Main Render
  return (
    <>
      {list?.length === 0 && (
        <NotFound
          title={
            <span>
              Список{' '}
              <span className="font-extrabold">Дивлюсь</span>{' '}
              порожній
            </span>
          }
          description="Додайте аніме у список Дивлюсь, щоб відстежувати їх прогрес"
        />
      )}
      {list && list.length > 0 && (
        <Card className="h-full">
          <Stack className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4">
            {list.map((item, index) => (renderListItem(item, selectedIndex === index, () => { selectEntry(index) })))}
          </Stack>

          {selectedEntry && (renderSelectedItem(selectedEntry))}
        </Card>
      )}
    </>
  );
};

export default GenericList;
