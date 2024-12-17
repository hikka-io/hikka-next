'use client';

import Snowfall from 'react-snowfall';

import { useSettingsContext } from '@/services/providers/settings-provider';

const SnowfallManager = () => {
    const { snowflakes } = useSettingsContext();

    if (!snowflakes) {
        return null;
    }

    return (
        <Snowfall snowflakeCount={100} speed={[0.5, 1.5]} wind={[-0.5, 1]} />
    );
};

export default SnowfallManager;
