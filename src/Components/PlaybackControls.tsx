import { Text, View } from "react-native";
import { useSongsStore } from "../store/songs";
import IconButton from "./UI/IconButton";

import {
    usePlaybackState,
    useProgress
} from "react-native-track-player";
import { textStyles } from "../styles/text";
import { FormatSecs } from "../utils/FormatMillis";
import PlaybackSlider from "./PlaybackSlider";

const PlaybackControls = () => {
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
                rowGap: 8,
            }}
        >
            <Text style={[textStyles.small, { textAlign: "center" }]}>
                {"placeholder text"}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <IconButton icon={"shuffle"} size={32} isDisabled={true} />
                <IconButton
                    onPress={previous}
                    icon={"skip-previous"}
                    size={48}
                />
                <IconButton
                    onPress={hanldePlayPausePress}
                    icon={
                        playbackState.state === "playing"
                            ? "pause-circle"
                            : "play-circle"
                    }
                    size={64}
                />
                <IconButton onPress={next} icon={"skip-next"} size={48} />
                <IconButton icon={"repeat-once"} size={32} isDisabled={true} />
            </View>
            <PlaybackSlider
                trackDuration={progress.duration}
                trackPosition={progress.position}
                skipPosition={seekToPosition}
            />
            <Text style={[textStyles.detail, { textAlign: "center" }]}>
                {FormatSecs(progress.position)} /{" "}
                {FormatSecs(progress.duration)}
            </Text>
        </View>
    );
};
export default PlaybackControls;
