import { type Dispatch, type SetStateAction, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';
import { xml2json } from 'xml-js';

import {
    ContentTypeEnum,
    type ImportReadArgs,
    type ImportWatchArgs,
} from '@hikka/api';

import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import FoundList from './found-list';

type Props = {
    content_type: ContentTypeEnum;
    list: ImportReadArgs[] | ImportWatchArgs[];
    setList:
        | Dispatch<SetStateAction<ImportReadArgs[]>>
        | Dispatch<SetStateAction<ImportWatchArgs[]>>;
};

const ImportList = ({ list, setList, content_type }: Props) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const nativeType = (value: string) => {
            const nValue = Number(value);
            if (!Number.isNaN(nValue)) {
                return nValue;
            }
            const bValue = value.toLowerCase();
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
                const keyNo = Object.keys(parentElement._parent).length;
                const keyName = Object.keys(parentElement._parent)[keyNo - 1];

                if (keyName === 'my_comments') {
                    parentElement._parent[keyName] = String(value);
                } else {
                    parentElement._parent[keyName] = nativeType(value);
                }
            } catch (_e) {}
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
                setList(
                    res.myanimelist[
                        content_type === ContentTypeEnum.ANIME
                            ? 'anime'
                            : 'manga'
                    ],
                );
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/xml': ['.xml'],
        },
    });

    return (
        <div className="flex w-full flex-col gap-2">
            <Label>Файл списку</Label>
            <div
                {...getRootProps({
                    className: cn(
                        'h-28 w-full p-4',
                        'flex items-center justify-center',
                        'cursor-pointer rounded-lg border surface text-center',
                        'transition duration-100',
                        'hover:bg-secondary/20/90',
                        isDragActive && 'bg-secondary/20/90',
                    ),
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-muted-foreground text-sm">
                        Перетягніть файл сюди...
                    </p>
                ) : list.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        Перетягніть сюди <span>.XML</span> файл, або натисніть,
                        щоб завантажити
                    </p>
                ) : (
                    <FoundList list={list} type={content_type} />
                )}
            </div>
            <small className="text-muted-foreground">
                <span>
                    Ви можете імпортувати свій список з{' '}
                    <Link
                        target="_blank"
                        to="https://myanimelist.net/panel.php?go=export"
                        className="text-primary-foreground hover:underline"
                    >
                        MyAnimeList
                    </Link>{' '}
                    або{' '}
                    <span className="text-primary-foreground">Shikimori</span>
                </span>
            </small>
        </div>
    );
};

export default ImportList;
