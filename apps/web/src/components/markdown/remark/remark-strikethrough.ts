import {
    gfmStrikethroughFromMarkdown,
    gfmStrikethroughToMarkdown,
} from 'mdast-util-gfm-strikethrough';
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough';

export default function remarkStrikethrough() {
    // @ts-expect-error: `this` is the unified Processor at runtime.
    const data = this.data();

    data.micromarkExtensions = [
        ...(data.micromarkExtensions ?? []),
        gfmStrikethrough({ singleTilde: false }),
    ];
    data.fromMarkdownExtensions = [
        ...(data.fromMarkdownExtensions ?? []),
        gfmStrikethroughFromMarkdown(),
    ];
    data.toMarkdownExtensions = [
        ...(data.toMarkdownExtensions ?? []),
        gfmStrikethroughToMarkdown(),
    ];
}
