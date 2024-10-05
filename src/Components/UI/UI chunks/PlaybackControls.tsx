import { Text, View } from "react-native";
import { useSongsStore } from "../../../store/songs";

import TrackPlayer, {
    RepeatMode,
    usePlaybackState,
    useProgress,
} from "react-native-track-player";
import { IconSizes, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { CalculateDurationLeft, FormatSecs } from "../../../utils/FormatMillis";
import PlaybackSlider from "../Utils/PlaybackSlider";
import { Direction } from "../../../types/other";
import IconButton from "../Buttons/IconButton";
import { router } from "expo-router";

const PlaybackControls = ({
    animation = (direction: Direction, fast: boolean) => {},
}) => {
    const {
        play,
        pause,
        next,
        previous,
        seekToPosition,
        shuffle,
        toggleRepeatMode,
        repeatMode,
    } = useSongsStore();
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const hanldePlayPausePress = () => {
        if (playbackState.state === "playing") pause();
        else play();
    };

    const getRepeatIcon = () => {
        switch (repeatMode) {
            case RepeatMode.Off:
                return "repeat-off";
            case RepeatMode.Track:
                return "repeat-once";
            case RepeatMode.Queue:
                return "repeat";
            default:
                return "repeat-off";
        }
    };

    return (
        <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                gap: Spacing.sm,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <IconButton
                    icon={"shuffle"}
                    size={IconSizes.lg}
                    touchableOpacityProps={{
                        onPress: shuffle,
                    }}
                />
                <IconButton
                    touchableOpacityProps={{
                        onPress: () => {
                            previous();
                            if (progress.position < 3) {
                                animation(Direction.RIGHT, true);
                            }
                        },
                    }}
                    icon={"skip-previous"}
                    size={IconSizes.xl}
                />
                <IconButton
                    touchableOpacityProps={{
                        onPress: hanldePlayPausePress,
                    }}
                    icon={
                        playbackState.state === "playing"
                            ? "pause-circle"
                            : "play-circle"
                    }
                    size={IconSizes.xxl}
                />
                <IconButton
                    touchableOpacityProps={{
                        onPress: () => {
                            next();
                            animation(Direction.LEFT, true);
                        },
                    }}
                    icon={"skip-next"}
                    size={IconSizes.xl}
                />
                <IconButton
                    icon={getRepeatIcon()}
                    size={IconSizes.lg}
                    touchableOpacityProps={{
                        onPress: toggleRepeatMode,
                    }}
                />
            </View>
            <View style={{ gap: Spacing.sm }}>
                <PlaybackSlider
                    trackDuration={progress.duration}
                    trackPosition={progress.position}
                    skipPosition={seekToPosition}
                />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={[textStyles.small]}>
                        {FormatSecs(progress.position)}
                    </Text>
                    <Text style={[textStyles.small]}>
                        -
                        {CalculateDurationLeft(
                            progress.position,
                            progress.duration
                        )}
                    </Text>
                </View>
            </View>
            
        </View>
    );
};
export default PlaybackControls;
