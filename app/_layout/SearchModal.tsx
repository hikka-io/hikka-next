'use client';

import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import AntDesignCloseCircleFilled from '~icons/ant-design/close-circle-filled';
import AntDesignCloseOutlined from '~icons/ant-design/close-outlined';

import { useQuery } from '@tanstack/react-query';

import Modal from '@/app/_components/Modal';
import SearchCard from '@/app/_components/SearchCard';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import useDebounce from '@/utils/hooks/useDebounce';
import { useModalContext } from '@/utils/providers/ModalProvider';

const Component = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce({ value: searchValue, delay: 500 });
    const { search, closeModals, switchModal } = useModalContext();
    const { data, isLoading, error } = useQuery<
        { list: Hikka.Anime[]; pagination: Hikka.Pagination },
        Error
    >({
        queryKey: ['searchList', value],
        queryFn: () =>
            getAnimeCatalog({
                query: value,
            }),
        enabled: value !== undefined && value.length >= 3,
    });

    const onDismiss = () => {
        closeModals();
        setSearchValue('');
    };

    const remove = () => {
        setSearchValue('');
        inputRef.current?.focus();
    };

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                switchModal('search', true);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Modal
            open={Boolean(search)}
            onDismiss={onDismiss}
            id="searchModal"
            boxClassName="p-0 flex flex-col relative"
            title="Пошук"
        >
            <div
                className={clsx(
                    'relative p-8 border-b-secondary',
                    data && data.list.length > 0 && 'border-b'
                )}
            >
                <div className="input input-md flex bg-secondary/60 items-center gap-2 pr-4">
                    <input
                        autoFocus={true}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        ref={inputRef}
                        className="h-full w-full bg-transparent"
                    />
                    <button
                        disabled={!searchValue}
                        onClick={remove}
                        className="btn btn-square btn-ghost btn-badge border-0 disabled:bg-transparent"
                    >
                        <AntDesignCloseCircleFilled />
                    </button>
                </div>
            </div>
            {data && data.list.length > 0 && (
                <div className="flex-1 overflow-y-scroll pb-8">
                    {data.list.map((anime) => (
                        <SearchCard
                            onClick={onDismiss}
                            anime={anime}
                            key={anime.slug}
                        />
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default Component;
