'use client';

import { useState } from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export interface DescriptionOption {
    value: string;
    /** Toggle label, e.g. "UA" / "EN". */
    label: string;
    ariaLabel: string;
    text?: string | null;
}

interface Props {
    title?: string;
    options: DescriptionOption[];
    className?: string;
    id?: string;
}

/**
 * Shared "Опис" block used by content and character pages: renders a markdown
 * description with an optional UA/EN toggle. Empty options are dropped, the
 * toggle only appears when more than one language is available, and the whole
 * block renders nothing when there is no text at all.
 */
const DescriptionBlock = ({ title = 'Опис', options, className, id }: Props) => {
    const valid = options.filter((o) => o.text && o.text.trim() !== '');
    const [active, setActive] = useState(valid[0]?.value);

    if (valid.length === 0) {
        return null;
    }

    const activeValue = valid.some((o) => o.value === active)
        ? active
        : valid[0].value;
    const description =
        valid.find((o) => o.value === activeValue)?.text ?? valid[0].text;

    return (
        <Block className={className} id={id}>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>{title}</HeaderTitle>
                    {valid.length > 1 && (
                        <ToggleGroup
                            type="single"
                            value={activeValue}
                            onValueChange={(value) => value && setActive(value)}
                            size="badge"
                        >
                            {valid.map((option) => (
                                <ToggleGroupItem
                                    key={option.value}
                                    value={option.value}
                                    aria-label={option.ariaLabel}
                                >
                                    {option.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    )}
                </HeaderContainer>
            </Header>
            <TextExpand>
                <MDViewer>{description}</MDViewer>
            </TextExpand>
        </Block>
    );
};

export default DescriptionBlock;
