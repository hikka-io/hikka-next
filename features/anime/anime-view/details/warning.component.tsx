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

    const containsWord = (texts: (string | undefined)[], words: string[]): boolean => {
        return texts.some(text =>
            words.some(word =>
                text?.toLowerCase().includes(word.toLowerCase())
            )
        );
    };

    if (!data || !containsWord([data.title_original, data.title_en, data.title_ja, data.title_ua, data.synopsis_en], WARNING_WORDS)) {
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
