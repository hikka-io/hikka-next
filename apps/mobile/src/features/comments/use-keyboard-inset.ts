import { useEffect, useRef, useState } from 'react';

import { Dimensions, Keyboard, Platform, type View } from 'react-native';

const IOS = Platform.OS === 'ios';

/**
 * How much of the view the keyboard covers, for bottom padding. Measured in window
 * coordinates because a form sheet does not start at the top of the screen, which
 * `KeyboardAvoidingView` assumes. On Android the sheet is a dialog window that the keyboard
 * does not resize and whose coordinates start below the status bar, so it is anchored
 * to the screen bottom instead.
 */
export function useKeyboardInset() {
    const ref = useRef<View>(null);
    const [inset, setInset] = useState(0);

    useEffect(() => {
        const show = Keyboard.addListener(
            IOS ? 'keyboardWillShow' : 'keyboardDidShow',
            (event) => {
                if (!IOS) {
                    setInset(
                        Math.max(
                            0,
                            Dimensions.get('screen').height -
                                event.endCoordinates.screenY,
                        ),
                    );
                    return;
                }
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
