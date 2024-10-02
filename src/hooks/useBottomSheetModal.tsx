import { useRef, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

function useBottomSheetModal(beforeOpenCallback?: () => Promise<void>): {
    sheetRef: React.RefObject<BottomSheetModal>;
    open: () => Promise<void>;
    close: () => void;
} {
    const sheetRef = useRef<BottomSheetModal>(null);

    const open = useCallback(async () => {
        if (beforeOpenCallback) {
            await beforeOpenCallback();
        }
        sheetRef.current?.present();
    }, [beforeOpenCallback]);

    const close = useCallback(() => {
        sheetRef.current?.dismiss();
    }, []);

    return { sheetRef, open, close };
}
export default useBottomSheetModal;
