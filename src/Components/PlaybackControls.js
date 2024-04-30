import { Text, View } from "react-native";
import { useSongsStore } from "../store/songs";
import IconButton from "./UI/IconButton";

import { textStyles } from "../styles/text";
import { FormatMillis } from "../utils/FormatMillis";
import PlaybackSlider from "./PlaybackSlider";
import {
    Event,
    useActiveTrack,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents,
} from "react-native-track-player";

const PlaybackControls = () => {
    const {
        isPlaying,
        playlist,

        play,
        pause,
        next,
        previous,

        skipPosition,
        trackPosition,
        trackDuration,

        shuffle,
        repeat,
        turnOnRepeat,
        turnOffRepeat,

        seekToPosition,
    } = useSongsStore();
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const hanldePlayPausePress = () => {
        if (playbackState.state === "playing") pause();
        else play();
    };

    const handleRepeatPress = () => {
        if (repeat) turnOffRepeat();
        else turnOnRepeat();
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
                {playlist.name}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <IconButton
                    onPress={shuffle}
                    icon={"shuffle"}
                    size={32}
                    isDisabled={true}
                />
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
                <IconButton
                    onPress={handleRepeatPress}
                    icon={repeat ? "repeat-once" : "repeat-off"}
                    size={32}
                    isDisabled={true}
                />
            </View>
            <PlaybackSlider
                trackDuration={progress.duration}
                trackPosition={progress.position}
                skipPosition={seekToPosition}
            />
            <Text style={[textStyles.detail, { textAlign: "center" }]}>
                {FormatMillis(trackPosition)} / {FormatMillis(trackDuration)}
            </Text>
        </View>
    );
};
export default PlaybackControls;
