import { RepeatMode } from "react-native-track-player";

export interface BottomSheetProps {
    dismiss: () => void;
}

export enum Direction {
    LEFT,
    RIGHT,
}

// seconds to disable skip when skipping backwards
export const SECONDS_DISABLE_SKIP = 2;
export const DEFAULT_REPEAT_MODE = RepeatMode.Queue;