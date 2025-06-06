'use client';

import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react';
import { useEditorReadOnly } from '@udecode/plate/react';
import { BoldIcon, ItalicIcon } from 'lucide-react';

import { EmojiDropdownMenu } from './emoji-dropdown-menu';
import { ImageGroupToolbarButton } from './image-group-toolbar-button';
import { InsertDropdownMenu } from './insert-dropdown-menu';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
// import { TableDropdownMenu } from './table-dropdown-menu';
import { ToolbarGroup } from './toolbar';
import { VideoToolbarButton } from './video-toolbar-button';

export function ArticleToolbarButtons() {
    const readOnly = useEditorReadOnly();

    return (
        <div className="flex w-full">
            {!readOnly && (
                <>
                    <ToolbarGroup>
                        <InsertDropdownMenu type="advanced" />
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <MarkToolbarButton
                            nodeType={BoldPlugin.key}
                            tooltip="Жирний (⌘+B)"
                        >
                            <BoldIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={ItalicPlugin.key}
                            tooltip="Курсив (⌘+I)"
                        >
                            <ItalicIcon />
                        </MarkToolbarButton>
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <LinkToolbarButton />
                        {/* <TableDropdownMenu /> */}
                        <EmojiDropdownMenu />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ImageGroupToolbarButton />
                        <VideoToolbarButton />
                    </ToolbarGroup>
                </>
            )}
        </div>
    );
}
