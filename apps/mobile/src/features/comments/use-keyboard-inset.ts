import { useEffect, useRef, useState } from 'react';

import { Keyboard, Platform, type View } from 'react-native';

const IOS = Platform.OS === 'ios';

/**
 * How much of the view the keyboard covers, for bottom padding. Measured in window
 * coordinates because a form sheet does not start at the top of the screen, which
 * `KeyboardAvoidingView` assumes; on Android the resized window leaves no overlap.
 */
export function useKeyboardInset() {
    const ref = useRef<View>(null);
    const [inset, setInset] = useState(0);

    useEffect(() => {
        const show = Keyboard.addListener(
            IOS ? 'keyboardWillShow' : 'keyboardDidShow',
            (event) => {
                ref.current?.measureInWindow((_x, y, _width, height) =>
                    setInset(
                        Math.max(0, y + height - event.endCoordinates.screenY),
                    ),
                );
            },
        );
        const hide = Keyboard.addListener(
            IOS ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setInset(0),
        );

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    return { ref, inset };
}
