import {
    BaseH1Plugin,
    BaseH2Plugin,
    BaseH3Plugin,
    BaseH4Plugin,
    BaseH5Plugin,
} from '@platejs/basic-nodes';

import {
    H1ElementStatic,
    H2ElementStatic,
    H3ElementStatic,
    H4ElementStatic,
    H5ElementStatic,
} from '@/components/plate/ui/heading-node-static';

export const BaseHeadingsKit = [
    BaseH1Plugin.withComponent(H1ElementStatic),
    BaseH2Plugin.withComponent(H2ElementStatic),
    BaseH3Plugin.withComponent(H3ElementStatic),
    BaseH4Plugin.withComponent(H4ElementStatic),
    BaseH5Plugin.withComponent(H5ElementStatic),
];
