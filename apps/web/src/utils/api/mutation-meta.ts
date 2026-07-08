/**
 * The global `MutationCache.onError` in `router.tsx` toasts `error.message` for
 * every failed mutation. A mutation that shows its own error toast must set this
 * meta flag, otherwise the user sees two toasts for one failure.
 *
 * Usage:
 *   useMutation({ ...someMutation(), meta: MUTATION_META_SKIP_ERROR_TOAST, onError })
 */
export const MUTATION_META_SKIP_ERROR_TOAST = {
    skipGlobalErrorToast: true,
} as const;

export function shouldSkipGlobalErrorToast(
    meta: Record<string, unknown> | undefined,
): boolean {
    return meta?.skipGlobalErrorToast === true;
}
