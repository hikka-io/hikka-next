import { ImageGroupElement } from '@/components/plate/ui/image-group-node';

import { ImageGroupPlugin } from './image-group-plugin';
import { ImageKit } from './image-kit';
import { ImagePlaceholderKit } from './image-placeholder-kit';

export const ImageGroupKit = [
    ...ImageKit,
    ...ImagePlaceholderKit,
    ImageGroupPlugin.withComponent(ImageGroupElement),
];
