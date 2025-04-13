'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import MDViewer from '../../../components/markdown/viewer/MD-viewer';
import TextExpand from '../../../components/text-expand';
import Block from '../../../components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderTitle,
} from '../../../components/ui/header';
import {
    ToggleGroup,
    ToggleGroupItem,
} from '../../../components/ui/toggle-group';
import useNovelInfo from '../../../services/hooks/novel/use-novel-info';

const Description = () => {
    const [active, setActive] = useState<'synopsis_ua' | 'synopsis_en'>(
        'synopsis_ua',
    );
    const params = useParams();
    const { data } = useNovelInfo({ slug: String(params.slug) });

    if (!data || (!data.synopsis_ua && !data.synopsis_en)) {
        return null;
    }

    return (
        <Block>
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
