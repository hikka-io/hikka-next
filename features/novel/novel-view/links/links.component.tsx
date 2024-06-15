'use client';

import { useParams } from 'next/navigation';
import { FC, useState } from 'react';
import MaterialSymbolsInfoIRounded from '~icons/material-symbols/info-i-rounded';
import MaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';

import P from '@/components/typography/p';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import HorizontalCard from '@/components/ui/horizontal-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import useNovelInfo from '@/services/hooks/novel/use-novel-info';
import { useModalContext } from '@/services/providers/modal-provider';

import LinksModal from './links-modal';

interface Props {
    extended?: boolean;
}

const Links: FC<Props> = ({ extended }) => {
    const [active, setActive] = useState<API.External['type']>('general');
    const params = useParams();
    const { openModal } = useModalContext();
    const { data: novel } = useNovelInfo({ slug: String(params.slug) });

    if (!novel) {
        return null;
    }

    if (novel.external.length === 0) {
        return null;
    }

    const watchLinksData = novel.external.filter((l) => l.type === 'watch');
    const generalLinksData = novel.external.filter((l) => l.type === 'general');

    const filteredWatchLinksData = watchLinksData.slice(0, 3);
    const filteredGeneralLinksData = generalLinksData.slice(0, 3);

    const linksData =
        active === 'general'
            ? filteredGeneralLinksData
            : filteredWatchLinksData;

    const handleOpenLinksModal = () => {
        openModal({
            type: 'sheet',
            title: 'Посилання',
            side: 'right',
            content: <LinksModal />,
        });
    };

    return (
        <Block>
            <Header title="Посилання" onClick={handleOpenLinksModal}>
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={(value: API.External['type']) =>
                        value && setActive(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    <ToggleGroupItem
                        value="general"
                        aria-label="Загальні посилання"
                    >
                        <MaterialSymbolsInfoIRounded />
                    </ToggleGroupItem>
                    {watchLinksData.length > 0 && (
                        <ToggleGroupItem
                            value="watch"
                            aria-label="Посилання для перегляду"
                        >
                            <MaterialSymbolsPlayArrowRounded />
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </Header>
            <div className="flex flex-col gap-6">
                {linksData.map((link) => (
                    <HorizontalCard
                        key={link.url}
                        title={link.text}
                        description={link.url}
                        descriptionHref={link.url}
                        href={link.url}
                        imageRatio={1}
                        imageContainerClassName="w-10"
                        descriptionClassName="break-all"
                        image={<P>{link.text[0]}</P>}
                    />
                ))}
            </div>
        </Block>
    );
};

export default Links;
