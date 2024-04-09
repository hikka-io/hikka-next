'use client';

import * as React from 'react';

import Details from '@/app/(pages)/edit/components/content/components/details';
import General from '@/app/(pages)/edit/components/content/components/general';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.AnimeInfo | API.Character | API.Person;
}

const Content = ({ slug, content_type, content }: Props) => {
    const [type, setType] = React.useState<'general' | 'details'>('details');
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
            <SubHeader title="Контент" variant="h4">
                <Button
                    variant={type === 'details' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setType('details')}
                >
                    Деталі
                </Button>
                <Button
                    variant={type === 'general' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setType('general')}
                >
                    Загальне
                </Button>
            </SubHeader>
            {type === 'general' && (
                <General href={link} poster={poster} title={title} />
            )}
            {type === 'details' && <Details content={content} />}
        </div>
    );
};

export default Content;
