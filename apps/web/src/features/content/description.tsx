'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { CONTENT_CONFIG } from '@/utils/constants/common';

interface Props {
    className?: string;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Description = ({ className, content_type }: Props) => {
    const [active, setActive] = useState<'synopsis_ua' | 'synopsis_en'>(
        'synopsis_ua',
    );
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    if (!data || (!data.synopsis_ua && !data.synopsis_en)) {
        return null;
    }

    return (
        <Block className={className}>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Опис</HeaderTitle>
                    <ToggleGroup
                        type="single"
                        value={active}
                        onValueChange={(value: 'synopsis_ua' | 'synopsis_en') =>
                            value && setActive(value)
                        }
                        size="badge"
                    >
                        {data.synopsis_ua && (
                            <ToggleGroupItem
                                value="synopsis_ua"
                                aria-label="Опис українскою"
                            >
                                UA
                            </ToggleGroupItem>
                        )}
                        {data.synopsis_en && (
                            <ToggleGroupItem
                                value="synopsis_en"
                                aria-label="Опис англійською"
                            >
                                EN
                            </ToggleGroupItem>
                        )}
                    </ToggleGroup>
                </HeaderContainer>
            </Header>

            <TextExpand>
                <MDViewer>
                    {data[active] || data.synopsis_ua || data.synopsis_en}
                </MDViewer>
            </TextExpand>
        </Block>
    );
};

export default Description;
