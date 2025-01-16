'use client';

import Snowfall from 'react-snowfall';

import { useSettingsContext } from '@/services/providers/settings-provider';

const SnowfallManager = () => {
    const { snowflakes } = useSettingsContext();

    if (!snowflakes) {
        return null;
    }

    return (
        <Snowfall
            snowflakeCount={100}
            speed={[0.5, 1.5]}
            wind={[-0.5, 1]}
            style={{
                height: '100lvh',
                maskImage:
                    'linear-gradient(to bottom, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0))',
            }}
        />
    );
};

export default SnowfallManager;
