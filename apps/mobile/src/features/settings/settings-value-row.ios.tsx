import type { FC } from 'react';

import { LabeledContent, Text } from '@expo/ui/swift-ui';
import { foregroundStyle } from '@expo/ui/swift-ui/modifiers';

type Props = {
    title: string;
    value?: string;
};

const SettingsValueRow: FC<Props> = ({ title, value }) => (
    <LabeledContent label={title}>
        <Text
            modifiers={[
                foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
            ]}
        >
            {value ?? ''}
        </Text>
    </LabeledContent>
);

export default SettingsValueRow;
