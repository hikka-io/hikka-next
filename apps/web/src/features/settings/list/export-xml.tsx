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
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '\'');
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

const buildAnimeXml = (anime: ExportAnimeItem[]): string => {
    const lines: string[] = [];

    lines.push('<?xml version="1.0" encoding="UTF-8" ?>');
    lines.push('<!--');
    lines.push(' Created by XML Export feature at MyAnimeList.net');
    lines.push(' Version 1.1.0');
    lines.push('-->');
    lines.push('<myanimelist>');
    lines.push('  <myinfo>');
    lines.push('    <user_export_type>1</user_export_type>');
    lines.push('  </myinfo>');

    for (const item of anime) {
        const id = item.mal_id ?? 0;
        const titleSource = item.hikka_slug || '';
        const status = mapAnimeStatusToMal(item.status);
        const score = item.score ?? 0;
        const watched = item.episodes ?? 0;
        const timesWatched = item.rewatches ?? 0;
        const comments = item.note ?? '';

        lines.push('  <anime>');
        lines.push(
            `    <series_animedb_id>${escapeXml(id)}</series_animedb_id>`,
        );
        lines.push(
            `    <series_title>${wrapCdata(titleSource)}</series_title>`,
        );
        lines.push('    <series_type></series_type>');
        lines.push('    <series_episodes>0</series_episodes>');
        lines.push('    <my_id>0</my_id>');
        lines.push(
            `    <my_watched_episodes>${escapeXml(
                watched,
            )}</my_watched_episodes>`,
        );
        lines.push('    <my_start_date>0000-00-00</my_start_date>');
        lines.push('    <my_finish_date>0000-00-00</my_finish_date>');
        lines.push('    <my_rated></my_rated>');
        lines.push(`    <my_score>${escapeXml(score)}</my_score>`);
        lines.push('    <my_storage></my_storage>');
        lines.push('    <my_storage_value>0.00</my_storage_value>');
        lines.push(`    <my_status>${escapeXml(status)}</my_status>`);
        lines.push(
            `    <my_comments>${wrapCdata(comments)}</my_comments>`,
        );
        lines.push(
            `    <my_times_watched>${escapeXml(
                timesWatched,
            )}</my_times_watched>`,
        );
        lines.push('    <my_rewatch_value></my_rewatch_value>');
        lines.push('    <my_priority>LOW</my_priority>');
        lines.push('    <my_tags><![CDATA[]]></my_tags>');
        lines.push('    <my_rewatching>0</my_rewatching>');
        lines.push('    <my_rewatching_ep>0</my_rewatching_ep>');
        lines.push('    <my_discuss>1</my_discuss>');
        lines.push('    <my_sns>default</my_sns>');
        lines.push('    <update_on_import>1</update_on_import>');
        lines.push('  </anime>');
    }

    lines.push('</myanimelist>');

    return lines.join('\n');
};

const buildMangaXml = (manga: ExportMangaItem[]): string => {
    const lines: string[] = [];

    lines.push('<?xml version="1.0" encoding="UTF-8" ?>');
    lines.push('<!--');
    lines.push(' Created by XML Export feature at MyAnimeList.net');
    lines.push(' Version 1.1.0');
    lines.push('-->');
    lines.push('<myanimelist>');
    lines.push('  <myinfo>');
    lines.push('    <user_export_type>2</user_export_type>');
    lines.push('  </myinfo>');

    for (const item of manga) {
        const id = item.mal_id ?? 0;
        const titleSource = item.hikka_slug || '';
        const status = mapMangaStatusToMal(item.status);
        const score = item.score ?? 0;
        const vols = item.volumes ?? 0;
        const chaps = item.chapters ?? 0;
        const comments = item.note ?? '';
        const timesRead = item.rereads ?? 0;

        lines.push('  <manga>');
        lines.push(
            `    <manga_mangadb_id>${escapeXml(
                id,
            )}</manga_mangadb_id>`,
        );
        lines.push(
            `    <manga_title>${wrapCdata(titleSource)}</manga_title>`,
        );
        lines.push(
            `    <manga_volumes>${escapeXml(vols)}</manga_volumes>`,
        );
        lines.push(
            `    <manga_chapters>${escapeXml(chaps)}</manga_chapters>`,
        );
        lines.push('    <my_id>0</my_id>');
        lines.push('    <my_read_volumes>0</my_read_volumes>');
        lines.push('    <my_read_chapters>0</my_read_chapters>');
        lines.push('    <my_start_date>0000-00-00</my_start_date>');
        lines.push('    <my_finish_date>0000-00-00</my_finish_date>');
        lines.push(
            '    <my_scanalation_group><![CDATA[]]></my_scanalation_group>',
        );
        lines.push(`    <my_score>${escapeXml(score)}</my_score>`);
        lines.push('    <my_storage></my_storage>');
        lines.push('    <my_retail_volumes>0</my_retail_volumes>');
        lines.push(`    <my_status>${escapeXml(status)}</my_status>`);
        lines.push(
            `    <my_comments>${wrapCdata(comments)}</my_comments>`,
        );
        lines.push(
            `    <my_times_read>${escapeXml(timesRead)}</my_times_read>`,
        );
        lines.push('    <my_tags><![CDATA[]]></my_tags>');
        lines.push('    <my_priority>Low</my_priority>');
        lines.push('    <my_reread_value></my_reread_value>');
        lines.push('    <my_rereading>NO</my_rereading>');
        lines.push('    <my_discuss>YES</my_discuss>');
        lines.push('    <my_sns>default</my_sns>');
        lines.push('    <update_on_import>1</update_on_import>');
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

const fetchExportData = async (
    client: ReturnType<typeof useHikkaClient>,
): Promise<ExportResponse> => {
    const internalClient: any = (client as any)?.client ?? client;

    if (internalClient?.settings?.exportLists) {
        return (await internalClient.settings.exportLists()) as ExportResponse;
    }

    const response = await fetch('/settings/export', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch export data');
    }

    return (await response.json()) as ExportResponse;
};

export const ExportAnimeXml = () => {
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
            toast.error(
                'Не вдалося експортувати список аніме. Спробуйте ще раз.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Label>Експорт аніме (XML для MAL)</Label>
            <p className="text-sm text-muted-foreground">
                Завантажити ваш список аніме у форматі XML, сумісному з
                MyAnimeList.
            </p>
            <Button onClick={handleExport} disabled={loading} size="md">
                {loading && (
                    <span className="loading loading-spinner mr-2"></span>
                )}
                Експортувати аніме XML
            </Button>
        </div>
    );
};

export const ExportMangaXml = () => {
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
            toast.success(
                'XML файл з манґою та ранобе успішно згенеровано.',
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'Не вдалося експортувати список манґи/ранобе. Спробуйте ще раз.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Label>Експорт манґи та ранобе (XML для MAL)</Label>
            <p className="text-sm text-muted-foreground">
                Завантажити ваш список манґи та ранобе у форматі XML, сумісному
                з MyAnimeList.
            </p>
            <Button onClick={handleExport} disabled={loading} size="md">
                {loading && (
                    <span className="loading loading-spinner mr-2"></span>
                )}
                Експортувати манґу/ранобе XML
            </Button>
        </div>
    );
};

const ExportXml = () => (
    <div className="flex flex-col gap-6">
        <ExportAnimeXml />
        <ExportMangaXml />
    </div>
);

export default ExportXml;
