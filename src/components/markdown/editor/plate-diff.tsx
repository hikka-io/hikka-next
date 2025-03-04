'use client';

import { Value } from '@udecode/plate';
import { computeDiff } from '@udecode/plate-diff';
import { createPlateEditor } from '@udecode/plate/react';
import { FC, useMemo } from 'react';

import BasicEditor from './basic-editor';
import { basicPlugins } from './plugins';
import { deserializeMd } from './plugins/markdown-plugin/deserialize-md';

interface Props {
    current: string;
    previous: string;
    className?: string;
}

const PlateDiff: FC<Props> = ({ current, previous, className }) => {
    const diffValue = useMemo(() => {
        const editor = createPlateEditor({
            plugins: basicPlugins,
        });

        return computeDiff(
            deserializeMd({ editor, data: previous }),
            deserializeMd({ editor, data: current }),
            {
                lineBreakChar: '¶',
            },
        ) as Value;
    }, [previous, current]);

    return (
        <BasicEditor
            disableToolbar
            readOnly
            initialValue={diffValue}
            className={className}
        />
    );
};

export default PlateDiff;
