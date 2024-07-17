'use client';

import { Value, createPlateEditor } from '@udecode/plate-common';
import { computeDiff } from '@udecode/plate-diff';
import { FC, useMemo } from 'react';

import PlateEditor from './plate-editor';
import plugins from './plugins';
import { deserializeMd } from './serializer-md';

interface Props {
    current: string;
    previous: string;
    className?: string;
}

const PlateDiff: FC<Props> = ({ current, previous, className }) => {
    const diffValue = useMemo(() => {
        const editor = createPlateEditor({ plugins });

        return computeDiff(
            deserializeMd(editor, previous),
            deserializeMd(editor, current),
            {
                isInline: editor.isInline,
                lineBreakChar: '¶',
            },
        ) as Value;
    }, [previous, current]);

    return (
        <PlateEditor
            key={JSON.stringify(diffValue)}
            readOnly
            disableToolbar
            value={diffValue}
            className={className}
            editorClassName="text-sm p-4"
        />
    );
};

export default PlateDiff;
