'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { xml2json } from 'xml-js';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import importWatch from '@/utils/api/settings/importWatch';
import Link from "next/link";

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { switchModal } = useModalContext();
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const [rewrite, setRewrite] = useState(true);
    const [watchList, setWatchList] = useState<{
        myinfo: Record<string, any>;
        anime: Record<string, any>[];
    }>();
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
                console.log(res.myanimelist);
                setWatchList(res.myanimelist);
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

        if (watchList?.anime && watchList.anime.length > 0) {
            try {
                const res = await importWatch({
                    overwrite: rewrite,
                    anime: watchList.anime,
                    secret: String(secret),
                });

                enqueueSnackbar(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">
                            {watchList.anime.length}
                        </span>{' '}
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

    return (
        <div className="py-8 px-8 flex flex-col gap-6">
            <div className="h-12 flex items-center">
                <h3>Список</h3>
            </div>
            <div className="w-full">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Імпорт списку</span>
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
                            <p className="label-text">
                                Перетягніть файл сюди...
                            </p>
                        ) : !watchList ? (
                            <p className="label-text opacity-60">
                                Перетягніть сюди <span>.XML</span> файл, або
                                натисніть, щоб завантажити
                            </p>
                        ) : (
                            <div>
                                <p>
                                    У вашому файлі знайдено{' '}
                                    <span className="rounded-sm bg-accent text-accent-content px-1">
                                        {watchList.anime.length}
                                    </span>{' '}
                                    аніме, що готові до імпорту
                                </p>
                            </div>
                        )}
                    </div>
                    <label className="label">
                        <span className="label-text label-text-alt">
                            Ви можете імпортувати свій список з{' '}
                            <Link target="_blank" href="https://myanimelist.net/panel.php?go=export" className="hover:!text-accent-content hover:bg-accent-focus rounded-sm bg-accent text-accent-content px-1">
                                MyAnimeList
                            </Link>{' '}
                            або{' '}
                            <span className="rounded-sm bg-accent text-accent-content px-1">
                                Shikimori
                            </span>
                        </span>
                    </label>
                </div>
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
                    disabled={!watchList}
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
