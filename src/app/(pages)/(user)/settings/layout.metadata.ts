import { Metadata } from 'next';

import _generateMetadata from '@/utils/generate-metadata';

export interface MetadataProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: 'Налаштування',
        robots: {
            index: false,
        },
    });
}
