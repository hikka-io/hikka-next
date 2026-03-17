import { createContext, useContext } from 'react';

import type { ImagePreset } from '@/utils/constants/image-presets';

export const ImagePresetContext = createContext<ImagePreset | undefined>(
    undefined,
);

export function useImagePreset() {
    return useContext(ImagePresetContext);
}
