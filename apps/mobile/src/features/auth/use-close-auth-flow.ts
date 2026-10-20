import { useRouter } from 'expo-router';

// An email link can open over another auth sheet, so a single back would land on it.
export function useCloseAuthFlow() {
    const router = useRouter();

    return () => {
        if (router.canDismiss()) router.dismissAll();
        else if (router.canGoBack()) router.back();
        else router.replace('/');
    };
}
