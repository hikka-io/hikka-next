'use client';

import { useExportLists } from '@hikka/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type ExportAnimeItem = {
    note: string | null;
    hikka_slug: string;
    mal_id?: number | null;
    status: string;
    score?: number | null;
    episodes?: number | null;
    rewatches?: number | null;
};

type ExportMangaItem = {
    note: string | null;
    hikka_slug: string;
    mal_id?: number | null;
    status: string;
    score?: number | null;
    chapters?: number | null;
    volumes?: number | null;
    rereads?: number | null;
};

const escapeXml = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const wrapCdata = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '<![CDATA[]]>';
    return `<![CDATA[${String(value)}]]>`;
};

const mapAnimeStatusToMal = (status: string): string => {
    switch (status) {
        case 'watching':
            return 'Watching';
        case 'completed':
            return 'Completed';
        case 'on_hold':
            return 'On-Hold';
        case 'dropped':
            return 'Dropped';
        case 'planned':
        default:
            return 'Plan to Watch';
    }
};

const mapMangaStatusToMal = (status: string): string => {
    switch (status) {
        case 'reading':
            return 'Reading';
        case 'completed':
            return 'Completed';
        case 'on_hold':
            return 'On-Hold';
        case 'dropped':
            return 'Dropped';
        case 'planned':
        default:
            return 'Plan to Read';
    }
};

const createXmlTag = (tag: string, value: unknown, isCdata = false): string => {
    const content = isCdata ? wrapCdata(value) : escapeXml(value);
    return `    <${tag}>${content}</${tag}>`;
};

const buildAnimeXml = (anime: ExportAnimeItem[]): string => {
    const lines: string[] = [
        '<?xml version="1.0" encoding="UTF-8" ?>',
        '<!--',
        ' Created by XML Export feature at hikka.io',
        '-->',
        '<myanimelist>',
        '  <myinfo>',
        '    <user_export_type>1</user_export_type>',
        '  </myinfo>',
    ];

    for (const item of anime) {
        const animeTags = [
            { tag: 'series_animedb_id', value: item.mal_id ?? 0 },
            { tag: 'series_title', value: item.hikka_slug, isCdata: true },
            { tag: 'my_watched_episodes', value: item.episodes ?? 0 },
            { tag: 'my_score', value: item.score ?? 0 },
            { tag: 'my_status', value: mapAnimeStatusToMal(item.status) },
            { tag: 'my_comments', value: item.note ?? '', isCdata: true },
            { tag: 'my_times_watched', value: item.rewatches ?? 0 },
            { tag: 'update_on_import', value: 1 },
        ];

        lines.push('  <anime>');
        animeTags.forEach(({ tag, value, isCdata }) => {
            lines.push(createXmlTag(tag, value, isCdata));
        });
        lines.push('  </anime>');
    }

    lines.push('</myanimelist>');
    return lines.join('\n');
};

const buildMangaXml = (manga: ExportMangaItem[]): string => {
    const lines: string[] = [
        '<?xml version="1.0" encoding="UTF-8" ?>',
        '<!--',
        ' Created by XML Export feature at hikka.io',
        '-->',
        '<myanimelist>',
        '  <myinfo>',
        '    <user_export_type>2</user_export_type>',
        '  </myinfo>',
    ];

    for (const item of manga) {
        const mangaTags = [
            { tag: 'manga_mangadb_id', value: item.mal_id ?? 0 },
            { tag: 'manga_title', value: item.hikka_slug, isCdata: true },
            { tag: 'my_read_volumes', value: item.volumes ?? 0 },
            { tag: 'my_read_chapters', value: item.chapters ?? 0 },
            { tag: 'my_scanalation_group', value: '', isCdata: true },
            { tag: 'my_score', value: item.score ?? 0 },
            { tag: 'my_status', value: mapMangaStatusToMal(item.status) },
            { tag: 'my_comments', value: item.note ?? '', isCdata: true },
            { tag: 'my_times_read', value: item.rereads ?? 0 },
            { tag: 'update_on_import', value: 1 },
        ];

        lines.push('  <manga>');
        mangaTags.forEach(({ tag, value, isCdata }) => {
            lines.push(createXmlTag(tag, value, isCdata));
        });
        lines.push('  </manga>');
    }

    lines.push('</myanimelist>');
    return lines.join('\n');
};

const downloadXml = (xml: string, filename: string) => {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

export const ExportAnime = () => {
    const [isExporting, setIsExporting] = useState(false);

    const { mutate: exportLists } = useExportLists({
        options: {
            onSuccess: (data) => {
                const anime = data.anime || [];
                if (!anime.length) {
                    toast.error('Немає аніме для експорту.');
                    setIsExporting(false);
                    return;
                }
                const xml = buildAnimeXml(anime);
                downloadXml(xml, 'hikka-anime-export.xml');
                toast.success('XML файл з аніме списком успішно згенеровано.');
                setIsExporting(false);
            },
            onError: (error) => {
                toast.error('Не вдалося експортувати список аніме. Спробуйте ще раз.');
                console.error(error);
                setIsExporting(false);
            },
        },
    });

    const handleExport = () => {
        setIsExporting(true);
        exportLists({});
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <Label>Експорт аніме</Label>
            <p className="text-sm text-muted-foreground">
                Завантажити ваш список аніме у форматі XML, сумісному з MyAnimeList.
            </p>
            <Button onClick={handleExport} disabled={isExporting} size="md">
                {isExporting && <span className="loading loading-spinner"></span>}
                Експортувати
            </Button>
        </div>
    );
};

export const ExportManga = () => {
    const [isExporting, setIsExporting] = useState(false);

    const { mutate: exportLists } = useExportLists({
        options: {
            onSuccess: (data) => {
                const manga = [...(data.manga || []), ...(data.novel || [])];
                if (!manga.length) {
                    toast.error('Немає манґи чи ранобе для експорту.');
                    setIsExporting(false);
                    return;
                }
                const xml = buildMangaXml(manga);
                downloadXml(xml, 'hikka-manga-export.xml');
                toast.success('XML файл з манґою та ранобе успішно згенеровано.');
                setIsExporting(false);
            },
            onError: (error) => {
                toast.error('Не вдалося експортувати список манґи/ранобе. Спробуйте ще раз.');
                console.error(error);
                setIsExporting(false);
            },
        },
    });

    const handleExport = () => {
        setIsExporting(true);
        exportLists({});
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <Label>Експорт манґи та ранобе</Label>
            <p className="text-sm text-muted-foreground">
                Завантажити ваш список манґи та ранобе у форматі XML, сумісному з MyAnimeList.
            </p>
            <Button onClick={handleExport} disabled={isExporting} size="md">
                {isExporting && <span className="loading loading-spinner"></span>}
                Експортувати
            </Button>
        </div>
    );
};

const ExportXml = () => (
    <div className="flex flex-col gap-6">
        <ExportAnime />
        <ExportManga />
    </div>
);

export default ExportXml;