import { Text, View } from "react-native";
import { useSongsStore } from "../store/songs";
import IconButton from "./UI/IconButton";

import { usePlaybackState, useProgress } from "react-native-track-player";
import { IconSizes, Spacing } from "../styles/constants";
import { textStyles } from "../styles/text";
import { FormatSecs } from "../utils/FormatMillis";
import PlaybackSlider from "./PlaybackSlider";
import { Direction } from "../types/other";

const PlaybackControls = ({
    animation = (direction: Direction, fast: boolean) => {},
}) => {
    const { play, pause, next, previous, seekToPosition } = useSongsStore();
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const hanldePlayPausePress = () => {
        if (playbackState.state === "playing") pause();
        else play();
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
                        disabled: true,
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
                    icon={"repeat"}
                    size={IconSizes.lg}
                    touchableOpacityProps={{
                        disabled: true,
                    }}
                />
            </View>
            <PlaybackSlider
                trackDuration={progress.duration}
                trackPosition={progress.position}
                skipPosition={seekToPosition}
            />
            <Text style={[textStyles.small, { textAlign: "center" }]}>
                {FormatSecs(progress.position)}
                {" / "}
                {FormatSecs(progress.duration)}
            </Text>
        </View>
    );
};
export default PlaybackControls;
