'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useHikkaClient } from '@hikka/react';

type ExportItem = {
    note: string | null;
    hikka_slug: string;
    mal_id?: number | null;
    status: string;
    score?: number | null;
    created?: number | null;
    updated?: number | null;
    // anime
    episodes?: number | null;
    rewatches?: number | null;
    // manga/novel
    chapters?: number | null;
    volumes?: number | null;
    rereads?: number | null;
};

type ExportResponse = {
    anime?: ExportItem[];
    manga?: ExportItem[];
    novel?: ExportItem[];
    created?: number;
    updated?: number;
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

const buildItemXml = (item: ExportItem): string => {
    const parts: string[] = [];

    parts.push('    <item>');

    if (item.hikka_slug) {
        parts.push(`      <hikka_slug>${escapeXml(item.hikka_slug)}</hikka_slug>`);
    }

    if (typeof item.mal_id !== 'undefined' && item.mal_id !== null) {
        parts.push(`      <mal_id>${escapeXml(item.mal_id)}</mal_id>`);
    }

    if (typeof item.status !== 'undefined') {
        parts.push(`      <status>${escapeXml(item.status)}</status>`);
    }

    if (typeof item.score !== 'undefined' && item.score !== null) {
        parts.push(`      <score>${escapeXml(item.score)}</score>`);
    }

    if (typeof item.episodes !== 'undefined' && item.episodes !== null) {
        parts.push(`      <episodes>${escapeXml(item.episodes)}</episodes>`);
    }

    if (typeof item.rewatches !== 'undefined' && item.rewatches !== null) {
        parts.push(`      <rewatches>${escapeXml(item.rewatches)}</rewatches>`);
    }

    if (typeof item.chapters !== 'undefined' && item.chapters !== null) {
        parts.push(`      <chapters>${escapeXml(item.chapters)}</chapters>`);
    }

    if (typeof item.volumes !== 'undefined' && item.volumes !== null) {
        parts.push(`      <volumes>${escapeXml(item.volumes)}</volumes>`);
    }

    if (typeof item.rereads !== 'undefined' && item.rereads !== null) {
        parts.push(`      <rereads>${escapeXml(item.rereads)}</rereads>`);
    }

    if (typeof item.note !== 'undefined') {
        parts.push(`      <note>${escapeXml(item.note)}</note>`);
    }

    if (typeof item.created !== 'undefined' && item.created !== null) {
        parts.push(`      <created>${escapeXml(item.created)}</created>`);
    }

    if (typeof item.updated !== 'undefined' && item.updated !== null) {
        parts.push(`      <updated>${escapeXml(item.updated)}</updated>`);
    }

    parts.push('    </item>');

    return parts.join('\n');
};

const buildSectionXml = (name: 'anime' | 'manga' | 'novel', items?: ExportItem[]): string => {
    if (!items || !items.length) return `  <${name}></${name}>`;
    const body = items.map((item) => buildItemXml(item)).join('\n');
    return `  <${name}>\n${body}\n  </${name}>`;
};

const buildXml = (data: ExportResponse): string => {
    const created = typeof data.created !== 'undefined' ? data.created : '';
    const updated = typeof data.updated !== 'undefined' ? data.updated : '';

    const lines: string[] = [];

    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<hikkaExport>');
    lines.push('  <meta>');
    lines.push(`    <created>${escapeXml(created)}</created>`);
    lines.push(`    <updated>${escapeXml(updated)}</updated>`);
    lines.push('  </meta>');
    lines.push(buildSectionXml('anime', data.anime));
    lines.push(buildSectionXml('manga', data.manga));
    lines.push(buildSectionXml('novel', data.novel));
    lines.push('</hikkaExport>');

    return lines.join('\n');
};

const downloadXml = (xml: string, filename = 'hikka-lists.xml') => {
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

const ExportXml = () => {
    const [loading, setLoading] = useState(false);
    const client = useHikkaClient();

    const handleExport = async () => {
        try {
            setLoading(true);

            // Prefer using underlying client if available; otherwise fallback to direct fetch.
            let data: ExportResponse | null = null;

            const internalClient: any = (client as any)?.client ?? client;

            if (internalClient?.settings?.exportLists) {
                data = (await internalClient.settings.exportLists()) as ExportResponse;
            } else {
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

                data = (await response.json()) as ExportResponse;
            }

            const xml = buildXml(data as ExportResponse);

            downloadXml(xml);
            toast.success('XML файл зі списками успішно згенеровано.');
        } catch (error) {
            console.error(error);
            toast.error('Не вдалося експортувати списки. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Label>Експорт списків</Label>
            <p className="text-sm text-muted-foreground">
                Завантажити ваш список перегляду та читання у форматі XML.
            </p>
            <Button onClick={handleExport} disabled={loading} size="md">
                {loading && (
                    <span className="loading loading-spinner mr-2"></span>
                )}
                Експортувати XML
            </Button>
        </div>
    );
};

export default ExportXml;
