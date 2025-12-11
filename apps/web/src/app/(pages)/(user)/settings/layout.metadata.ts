import { Metadata } from 'next';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

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
