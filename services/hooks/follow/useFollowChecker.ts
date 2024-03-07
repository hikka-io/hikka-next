import { useQuery } from '@tanstack/react-query';



import checkFollow from '@/services/api/follow/checkFollow';
import { useAuthContext } from '@/services/providers/auth-provider';


const useFollowChecker = ({
    username,
    enabled = true,
}: {
    username: string;
    enabled?: boolean;
}) => {
    const { secret } = useAuthContext();
    
    return useQuery({
        queryKey: ['followChecker', username, { secret }],
        queryFn: () =>
            checkFollow({
                secret: secret!,
                username: username,
            }),
        enabled: enabled && Boolean(secret),
    });
};

export default useFollowChecker;
