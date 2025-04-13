'use client';

import Link from 'next/link';
import { FC } from 'react';

import MaterialSymbolsArrowRightAltRounded from '@/components/icons/material-symbols/MaterialSymbolsArrowRightAltRounded';
import H3 from '@/components/typography/h3';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import Details from './details';
import General from './general';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.MainContent;
}

const EditContent: FC<Props> = ({ slug, content_type, content }) => {
    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Block>
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-1 items-center gap-4 overflow-hidden">
                    <Link
                        href={link}
                        target="_blank"
                        className="hover:underline"
                    >
                        <H3>Контент</H3>
                    </Link>
                </div>
                <Button size="icon-sm" variant="outline" asChild>
                    <Link href={link} target="_blank">
                        <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                <General
                    content={content}
                    content_type={content_type}
                    slug={slug}
                />
                <Details content={content} />
            </div>
        </Block>
    );
};

export default EditContent;
