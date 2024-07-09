'use client';

import { useParams } from 'next/navigation';

import P from '@/components/typography/p';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import { WARNING_WORDS } from '@/utils/constants';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';

const Warning = () => {
    const params = useParams();
    const { data } = useAnimeInfo({ slug: String(params.slug) });

    if (!data || !WARNING_WORDS.some(word => data.slug.includes(word.toLowerCase()))) {
        return null;
    }

    return (
        <Block>
            <Card className='border-destructive/60'>
                <P className="text-sm text-muted-foreground">
                    {"Примітка модерації"}
                </P>
                <P className='font-semibold text-destructive'>Цей твір просуває російську культуру та не рекомендований до перегляду чи читання.</P>
            </Card>
        </Block>
    );
};

export default Warning;
