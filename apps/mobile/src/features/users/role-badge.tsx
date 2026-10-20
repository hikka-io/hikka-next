import type { FC } from 'react';

import { Shield, ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { USER_ROLE } from '@hikka/core';

import { Icon } from '@/components/ui/icon';

const ROLE = {
    admin: { glyph: ShieldCheck, className: 'text-role-admin' },
    moderator: { glyph: Shield, className: 'text-role-moderator' },
} as const;

type Props = {
    role?: string | null;
};

const RoleBadge: FC<Props> = ({ role }) => {
    if (role !== 'admin' && role !== 'moderator') return null;

    const { glyph, className } = ROLE[role];

    return (
        <View
            accessible
            accessibilityLabel={USER_ROLE[role].label}
            className="shrink-0 rounded-sm border border-surface-inset-border bg-surface-inset p-1"
        >
            <Icon as={glyph} className={`size-4 ${className}`} />
        </View>
    );
};

export default RoleBadge;
