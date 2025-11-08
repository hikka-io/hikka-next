'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useHikkaClient } from '@hikka/react';

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

type ExportResponse = {
    anime?: ExportAnimeItem[];
    manga?: ExportMangaItem[];
    novel?: ExportMangaItem[];
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
        case 'watching': return 'Watching';
        case 'completed': return 'Completed';
        case 'on_hold': return 'On-Hold';
        case 'dropped': return 'Dropped';
        case 'planned':
        default: return 'Plan to Watch';
    }
};

const mapMangaStatusToMal = (status: string): string => {
    switch (status) {
        case 'reading': return 'Reading';
        case 'completed': return 'Completed';
        case 'on_hold': return 'On-Hold';
        case 'dropped': return 'Dropped';
        case 'planned':
        default: return 'Plan to Read';
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
        ' Created by XML Export feature at MyAnimeList.net',
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
            // { tag: 'series_type', value: '' },
            // { tag: 'series_episodes', value: 0 },
            // { tag: 'my_id', value: 0 },
            { tag: 'my_watched_episodes', value: item.episodes ?? 0 },
            // { tag: 'my_start_date', value: '0000-00-00' },
            // { tag: 'my_finish_date', value: '0000-00-00' },
            // { tag: 'my_rated', value: '' },
            { tag: 'my_score', value: item.score ?? 0 },
            // { tag: 'my_storage', value: '' },
            // { tag: 'my_storage_value', value: '0.00' },
            { tag: 'my_status', value: mapAnimeStatusToMal(item.status) },
            { tag: 'my_comments', value: item.note ?? '', isCdata: true },
            { tag: 'my_times_watched', value: item.rewatches ?? 0 },
            // { tag: 'my_rewatch_value', value: '' },
            // { tag: 'my_priority', value: 'LOW' },
            // { tag: 'my_tags', value: '', isCdata: true },
            // { tag: 'my_rewatching', value: 0 },
            // { tag: 'my_rewatching_ep', value: 0 },
            // { tag: 'my_discuss', value: 1 },
            // { tag: 'my_sns', value: 'default' },
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
            // { tag: 'manga_volumes', value: 0 }, 
            // { tag: 'manga_chapters', value: 0 },
            // { tag: 'my_id', value: 0 },
            { tag: 'my_read_volumes', value: item.volumes ?? 0 },
            { tag: 'my_read_chapters', value: item.chapters ?? 0 },
            // { tag: 'my_start_date', value: '0000-00-00' },
            // { tag: 'my_finish_date', value: '0000-00-00' },
            { tag: 'my_scanalation_group', value: '', isCdata: true },
            { tag: 'my_score', value: item.score ?? 0 },
            // { tag: 'my_storage', value: null },
            // { tag: 'my_retail_volumes', value: 0 },
            { tag: 'my_status', value: mapMangaStatusToMal(item.status) },
            { tag: 'my_comments', value: item.note ?? '', isCdata: true },
            { tag: 'my_times_read', value: item.rereads ?? 0 },
            // { tag: 'my_tags', value: '', isCdata: true },
            // { tag: 'my_priority', value: 'Low' },
            // { tag: 'my_reread_value', value: null },
            { tag: 'my_rereading', value: 'NO' },
            { tag: 'my_discuss', value: 'YES' },
            // { tag: 'my_sns', value: 'default' },
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

const fetchExportData = async (client: ReturnType<typeof useHikkaClient>): Promise<ExportResponse> => {
    const internalClient: any = (client as any)?.client ?? client;
    if (internalClient?.settings?.exportLists) {
        return (await internalClient.settings.exportLists()) as ExportResponse;
    }
    const response = await fetch('/settings/export', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch export data');
    }
    return (await response.json()) as ExportResponse;
};

export const ExportAnime = () => {
    const [loading, setLoading] = useState(false);
    const client = useHikkaClient();

    const handleExport = async () => {
        try {
            setLoading(true);
            const data = await fetchExportData(client);
            const anime = data.anime || [];
            if (!anime.length) {
                toast.error('Немає аніме для експорту.');
                return;
            }
            const xml = buildAnimeXml(anime);
            downloadXml(xml, 'hikka-anime-export.xml');
            toast.success('XML файл з аніме списком успішно згенеровано.');
        } catch (error) {
            console.error(error);
            toast.error('Не вдалося експортувати список аніме. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <Label>Експорт аніме</Label>
            <p className="text-sm text-muted-foreground">
                Завантажити ваш список аніме у форматі XML, сумісному з MyAnimeList.
            </p>
            <Button onClick={handleExport} disabled={loading} size="md">
                {loading && <span className="loading loading-spinner mr-2"></span>}
                Експортувати
            </Button>
        </div>
    );
};

export const ExportManga = () => {
    const [loading, setLoading] = useState(false);
    const client = useHikkaClient();

    const handleExport = async () => {
        try {
            setLoading(true);
            const data = await fetchExportData(client);
            const manga = [...(data.manga || []), ...(data.novel || [])];
            if (!manga.length) {
                toast.error('Немає манґи чи ранобе для експорту.');
                return;
            }
            const xml = buildMangaXml(manga);
            downloadXml(xml, 'hikka-manga-export.xml');
            toast.success('XML файл з манґою та ранобе успішно згенеровано.');
        } catch (error) {
            console.error(error);
            toast.error('Не вдалося експортувати список манґи/ранобе. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <Label>Експорт манґи та ранобе</Label>
            <p className="text-sm text-muted-foreground">
                Завантажити ваш список манґи та ранобе у форматі XML, сумісному з MyAnimeList.
            </p>
            <Button onClick={handleExport} disabled={loading} size="md">
                {loading && <span className="loading loading-spinner mr-2"></span>}
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