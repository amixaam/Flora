import { Text, View } from "react-native";
import { useSongsStore } from "../store/songs";
import IconButton from "./UI/IconButton";

import { textStyles } from "../styles/text";
import { FormatMillis } from "../utils/FormatMillis";
import PlaybackSlider from "./PlaybackSlider";

const PlaybackControls = ({ isMini = false }) => {
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
    } = useSongsStore();

    const hanldePlayPausePress = () => {
        if (isPlaying) pause();
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
                <IconButton onPress={shuffle} icon={"shuffle"} size={32} />
                <IconButton
                    onPress={previous}
                    icon={"skip-previous"}
                    size={48}
                />
                <IconButton
                    onPress={hanldePlayPausePress}
                    icon={isPlaying ? "pause-circle" : "play-circle"}
                    size={64}
                />
                <IconButton onPress={next} icon={"skip-next"} size={48} />
                <IconButton
                    onPress={handleRepeatPress}
                    icon={repeat ? "repeat-once" : "repeat-off"}
                    size={32}
                />
            </View>
            <PlaybackSlider
                trackDuration={trackDuration}
                trackPosition={trackPosition}
                skipPosition={skipPosition}
            />
            <Text style={[textStyles.detail, { textAlign: "center" }]}>
                {FormatMillis(trackPosition)} / {FormatMillis(trackDuration)}
            </Text>
        </View>
    );
};
export default PlaybackControls;
