'use client';

import * as React from 'react';

import Link from 'next/link';

import SubHeader from '@/components/sub-header';
import BaseCard from '@/components/ui/base-card';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.AnimeInfo | API.Character;
}

const Component = ({ slug, content_type, content }: Props) => {
    const { titleLanguage } = useSettingsContext();

    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    const poster = 'poster' in content ? content.poster : content.image;
    const title =
        'title_en' in content
            ? content[titleLanguage!] ||
              content.title_ua ||
              content.title_en ||
              content.title_ja
            : content.name_ua || content.name_en;

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Контент" variant="h4" />
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <BaseCard href={link} poster={poster} />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <BaseCard href={link} poster={poster} />
                </div>
                <Link href={link}>{title}</Link>
            </div>
        </div>
    );
};

export default Component;