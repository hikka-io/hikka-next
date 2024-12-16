'use client';

import { Value } from '@udecode/plate-common';
import { createPlateEditor } from '@udecode/plate-common/react';
import { computeDiff } from '@udecode/plate-diff';
import { FC, useMemo } from 'react';

import PlateEditor from './plate-editor';
import { editorPlugins } from './plugins';
import { deserializeMd } from './plugins/markdown-plugin/deserialize-md';

interface Props {
    current: string;
    previous: string;
    className?: string;
}

const PlateDiff: FC<Props> = ({ current, previous, className }) => {
    const diffValue = useMemo(() => {
        const editor = createPlateEditor({
            plugins: editorPlugins,
        });

        return computeDiff(
            deserializeMd({ editor, data: previous }),
            deserializeMd({ editor, data: current }),
            {
                isInline: editor.isInline,
                lineBreakChar: '¶',
            },
        ) as Value;
    }, [previous, current]);

    return (
        <PlateEditor
            disableToolbar
            readOnly
            initialValue={diffValue}
            className={className}
        />
    );
};

export default PlateDiff;
