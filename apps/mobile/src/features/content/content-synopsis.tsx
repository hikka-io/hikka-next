import { type FC, useState } from 'react';

import { SegmentedControl } from '@expo/ui/community/segmented-control';
import { View } from 'react-native';

import { isBlankDescription } from '@hikka/core';

import { MDViewer } from '@/components/markdown';
import TextExpand from '@/components/text-expand';
import { Header, HeaderTitle } from '@/components/ui/header';
import { useSession } from '@/features/auth';

import type { ContentInfo } from './queries';

const SYNOPSIS_LINES = 8;

type Props = {
    content: ContentInfo;
};

const ContentSynopsis: FC<Props> = ({ content }) => {
    const { user } = useSession();
    const [active, setActive] = useState(0);
    const options = [
        { label: 'UA', text: content.synopsis_ua },
        { label: 'EN', text: content.synopsis_en },
    ].filter((option) => !isBlankDescription(option.text));

    if (options.length === 0) {
        return null;
    }

    const index = active < options.length ? active : 0;
    const synopsis = options[index];

    return (
        <View className="gap-3">
            <Header>
                <HeaderTitle>Опис</HeaderTitle>
            </Header>
            {options.length > 1 && (
                <SegmentedControl
                    values={options.map((option) => option.label)}
                    selectedIndex={index}
                    onChange={(event) =>
                        setActive(event.nativeEvent.selectedSegmentIndex)
                    }
                />
            )}
            <TextExpand
                lines={SYNOPSIS_LINES}
                contentKey={`${content.slug}-${synopsis.label}`}
                expandLabel="Показати повний опис"
            >
                <MDViewer
                    key={`${content.slug}-${synopsis.label}`}
                    authenticated={!!user}
                    selectable
                >
                    {synopsis.text ?? ''}
                </MDViewer>
            </TextExpand>
        </View>
    );
};

export default ContentSynopsis;
