'use client';

import Modal from '@/app/_components/Modal';
import { useModalContext } from '@/utils/providers/ModalProvider';
import AntDesignCloseCircleFilled from '~icons/ant-design/close-circle-filled';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import SearchCard from '@/app/_components/SearchCard';
import clsx from 'clsx';
import useDebounce from "@/utils/hooks/useDebounce";

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
        enabled: value !== undefined && value.length >= 3
    });

    const onDismiss = () => {
        closeModals();
        setSearchValue("");
    };

    const remove = () => {
        setSearchValue('');
        inputRef.current?.focus();
    };


    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                switchModal('search', true);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
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
                    'relative py-8 px-8 flex flex-col gap-6',
                    "after:content-[' '] after:z-10 after:absolute after:-bottom-[calc(2rem-1px)] after:left-0 after:w-full after:h-8 after:bg-gradient-to-b after:from-base-100 after:to-transparent",
                )}
            >
                <div className="input input-md bg-secondary/60 flex items-center pr-4 gap-2">
                    <input
                        autoFocus={true}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        ref={inputRef}
                        className="w-full h-full bg-transparent"
                    />
                    <button
                        onClick={remove}
                        disabled={!searchValue}
                        className="btn border-0 btn-ghost btn-sm btn-square disabled:bg-transparent"
                    >
                        <AntDesignCloseCircleFilled />
                    </button>
                </div>
            </div>
            {data && (
                <div className="overflow-y-scroll flex-1 pb-8">
                    {data.list.map((anime) => (
                        <SearchCard onClick={onDismiss} anime={anime} key={anime.slug} />
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default Component;
