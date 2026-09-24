import { BaseBasicBlocksKit } from './plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from './plugins/basic-marks-base-kit';
import { BaseImageGroupKit } from './plugins/image-group-base-kit';
import { BaseLinkKit } from './plugins/link-base-kit';
import { BaseListKit } from './plugins/list-classic-base-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { BaseSpoilerKit } from './plugins/spoiler-base-kit';
import { BaseStrikethroughKit } from './plugins/strikethrough-base-kit';
import { BaseVideoKit } from './plugins/video-base-kit';

export const StaticKit = [
    ...BaseBasicBlocksKit,
    ...BaseLinkKit,
    ...BaseSpoilerKit,
    ...BaseVideoKit,
    ...BaseImageGroupKit,
    ...BaseBasicMarksKit,
    ...BaseStrikethroughKit,
    ...BaseListKit,
    ...MarkdownKit,
];
