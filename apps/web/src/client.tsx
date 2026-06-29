import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { StartClient } from '@tanstack/react-start/client';

// Custom client entry overriding TanStack Start's default, which wraps the app
// in <StrictMode>. StrictMode's dev-only double-invocation of effects tears a
// freshly-mounted query observer down mid-fetch; TanStack Query then cancels
// the signal-consuming request with `cancel({ revert: true })`, throwing a
// `CancelledError` into React's commit phase. That surfaces at the router error
// boundary and — because every remount re-triggers the same double-invoke — the
// recovery loops and blanks the page. StrictMode is inert in production (no
// double-invoke), so dropping it here only affects dev and removes the loop
// while leaving production behaviour unchanged.
startTransition(() => {
    hydrateRoot(document, <StartClient />);
});
