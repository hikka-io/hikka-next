'use client';

import { MDXEditorMethods } from '@mdxeditor/editor';
import React, { useEffect, useRef } from 'react';

import MDEditor from '@/components/markdown/editor/MD-editor';
import Header from '@/components/ui/header';

import { useCollectionContext } from '@/services/providers/collection-provider';

const CollectionTitle = () => {
    const ref = useRef<MDXEditorMethods>(null);

    const {
        title,
        description,
        setState: setCollectionState,
    } = useCollectionContext();

    useEffect(() => {
        if (ref.current) {
            ref.current.setMarkdown(description);
        }
    }, [description]);

    return (
        <div className="flex flex-col gap-4">
            <Header title={title || 'Нова колекція'} />
            <MDEditor
                onChange={(markdown) =>
                    setCollectionState!((state) => ({
                        ...state,
                        description: markdown,
                    }))
                }
                placeholder="Введіть опис"
                markdown={description}
                ref={ref}
            />
        </div>
    );
};

export default CollectionTitle;
