'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { xml2json } from 'xml-js';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import importWatch from '@/utils/api/settings/importWatch';
import Link from 'next/link';
import MaterialSymbolsCheckSmallRounded from '~icons/material-symbols/check-small-rounded';
import importAnilistWatch from '@/utils/api/settings/importAnilistWatch';

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [aniListLoading, setAniListLoading] = useState(false);
    const [aniListUsername, setAniListUsername] = useState('');
    const [tab, setTab] = useState<'general' | 'aniList'>('general');
    const { switchModal } = useModalContext();
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const [rewrite, setRewrite] = useState(true);
    const [watchList, setWatchList] = useState<Record<string, any>[]>([]);
    const [importing, setImporting] = useState<boolean>(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const nativeType = (value: string) => {
            let nValue = Number(value);
            if (!isNaN(nValue)) {
                return nValue;
            }
            let bValue = value.toLowerCase();
            if (bValue === 'true') {
                return true;
            } else if (bValue === 'false') {
                return false;
            }
            return value;
        };

        const removeJsonTextAttribute = (
            value: string,
            parentElement: Record<string, any>,
        ) => {
            try {
                let keyNo = Object.keys(parentElement._parent).length;
                let keyName = Object.keys(parentElement._parent)[keyNo - 1];
                parentElement._parent[keyName] = nativeType(value);
            } catch (e) {}
        };

        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = Array.from(acceptedFiles)[0];

            const text = await file.text();

            const res = JSON.parse(
                xml2json(text, {
                    compact: true,
                    trim: true,
                    ignoreDeclaration: true,
                    ignoreInstruction: true,
                    ignoreAttributes: true,
                    ignoreComment: true,
                    ignoreCdata: false,
                    ignoreDoctype: true,
                    cdataFn: removeJsonTextAttribute,
                    textFn: removeJsonTextAttribute,
                }),
            );

            if ('myanimelist' in res) {
                setWatchList(res.myanimelist.anime);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/xml': ['.xml'],
        },
    });

    const handleCompleteImport = async () => {
        setImporting(true);

        if (watchList && watchList.length > 0) {
            try {
                const res = await importWatch({
                    overwrite: rewrite,
                    anime: watchList,
                    secret: String(secret),
                });

                enqueueSnackbar(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">{watchList.length}</span>{' '}
                        аніме до Вашого списку.
                    </span>,
                    { variant: 'success' },
                );

                await queryClient.invalidateQueries();
                switchModal('userSettings');
            } catch (e) {}
        }

        setImporting(false);
    };

    useEffect(() => {
        setWatchList([]);
    }, [tab]);

    const getFromAniList = async () => {
        setAniListLoading(true);
        try {
            const res = await importAnilistWatch({ username: aniListUsername });
            res.length > 0 && setWatchList(res);
        } catch (e) {
            enqueueSnackbar(
                'Не вдалось завантажити список даного користувача',
                { variant: 'error' },
            );
        }
        setAniListLoading(false);
    };

    const found = (
        <div>
            <p>
                У вашому списку знайдено{' '}
                <span className="rounded-sm bg-accent text-accent-content px-1">
                    {watchList.length}
                </span>{' '}
                аніме, що готові до імпорту
            </p>
        </div>
    );

    const aniListImport = (
        <div className="w-full flex flex-col gap-2">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Ім’я користувача AniList</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Введіть імʼя користувача"
                        className="input bg-secondary/60 w-full flex-1"
                        onChange={(e) => setAniListUsername(e.target.value)}
                    />
                    <button
                        onClick={getFromAniList}
                        disabled={
                            aniListUsername.length === 0 ||
                            aniListLoading ||
                            importing
                        }
                        className="btn btn-square btn-secondary"
                    >
                        {aniListLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <MaterialSymbolsCheckSmallRounded className="text-2xl" />
                        )}
                    </button>
                </div>
            </div>
            {watchList.length > 0 && found}
        </div>
    );

    const generalImport = (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">Файл списку</span>
            </label>
            <div
                {...getRootProps({
                    className: clsx(
                        'w-full h-28 p-4',
                        'flex justify-center items-center',
                        // 'border border-secondary',
                        'cursor-pointer bg-secondary/60 rounded-lg text-center',
                        'transition duration-100',
                        'hover:bg-secondary/90',
                        isDragActive && 'bg-secondary/90',
                    ),
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="label-text">Перетягніть файл сюди...</p>
                ) : watchList.length === 0 ? (
                    <p className="label-text opacity-60">
                        Перетягніть сюди <span>.XML</span> файл, або натисніть,
                        щоб завантажити
                    </p>
                ) : (
                    found
                )}
            </div>
            <label className="label">
                <span className="label-text label-text-alt">
                    Ви можете імпортувати свій список з{' '}
                    <Link
                        target="_blank"
                        href="https://myanimelist.net/panel.php?go=export"
                        className="hover:!text-accent-content hover:bg-accent-focus rounded-sm bg-accent text-accent-content px-1"
                    >
                        MyAnimeList
                    </Link>{' '}
                    або{' '}
                    <span className="rounded-sm bg-accent text-accent-content px-1">
                        Shikimori
                    </span>
                </span>
            </label>
        </div>
    );

    return (
        <div className="py-8 px-8 flex flex-col gap-6">
            <div className="h-12 flex items-center">
                <h3>Імпорт</h3>
            </div>
            <div className="tabs w-full">
                <button
                    onClick={() => setTab('general')}
                    className={clsx(
                        'tab flex-1',
                        tab === 'general' && 'tab-bordered tab-active',
                    )}
                >
                    Загальний
                </button>
                <button
                    onClick={() => setTab('aniList')}
                    className={clsx(
                        'tab flex-1',
                        tab === 'aniList' && 'tab-bordered tab-active',
                    )}
                >
                    AniList
                </button>
            </div>
            <div className="w-full flex flex-col gap-2">
                {tab === 'general' && generalImport}
                {tab === 'aniList' && aniListImport}
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">
                            Переписати аніме, які вже додані до списку
                        </span>
                        <input
                            type="checkbox"
                            checked={rewrite}
                            onChange={() => setRewrite(!rewrite)}
                            className="checkbox checkbox-accent"
                        />
                    </label>
                </div>
            </div>

            <div className="w-full">
                <button
                    onClick={handleCompleteImport}
                    disabled={watchList.length === 0}
                    type="submit"
                    className="btn btn-accent w-full"
                >
                    {importing && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Імпортувати
                </button>
            </div>
        </div>
    );
};

export default Component;
