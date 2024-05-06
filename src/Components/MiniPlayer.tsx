import { router } from "expo-router";
import { Text, TouchableNativeFeedback, View, ViewStyle } from "react-native";
import { useSongsStore } from "../store/songs";
import AlbumArt from "./AlbumArt";
import IconButton from "./UI/IconButton";

import { StyleProp } from "react-native";
import {
    useActiveTrack,
    usePlaybackState,
    useProgress,
} from "react-native-track-player";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import PlaybackSlider from "./PlaybackSlider";

export const MiniPlayer = ({ style }: { style?: StyleProp<ViewStyle> }) => {
    const { play, pause, next, previous, seekToPosition } = useSongsStore();

    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const hanldePlayPausePress = () => {
        if (playbackState.state === "playing") pause();
        else play();
    };

    if (!activeTrack) return;
    return (
        <View style={style}>
            <TouchableNativeFeedback
                style={{ flex: 1 }}
                onPress={() => router.push("/player")}
            >
                <View style={mainStyles.miniPlayer}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 8,
                        }}
                    >
                        <AlbumArt
                            image={activeTrack.artwork}
                            style={{
                                height: 48,
                                aspectRatio: 1,
                                borderRadius: 5,
                            }}
                        />
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                columnGap: 16,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                <Text style={textStyles.h4} numberOfLines={1}>
                                    {activeTrack.title}
                                </Text>
                                <Text
                                    style={textStyles.detail}
                                    numberOfLines={1}
                                >
                                    {`${activeTrack.artist} • ${activeTrack.year}`}
                                </Text>
                            </View>
                            <View
                                style={{ flexDirection: "row", columnGap: 16 }}
                            >
                                <IconButton
                                    onPress={previous}
                                    icon="skip-previous"
                                    size={36}
                                />
                                <IconButton
                                    onPress={hanldePlayPausePress}
                                    icon={
                                        playbackState.state === "playing"
                                            ? "pause"
                                            : "play"
                                    }
                                    size={36}
                                />
                                <IconButton
                                    onPress={next}
                                    icon="skip-next"
                                    size={36}
                                />
                            </View>
                        </View>
                    </View>
                    <PlaybackSlider
                        trackDuration={progress.duration}
                        trackPosition={progress.position}
                        skipPosition={seekToPosition}
                    />
                </View>
            </TouchableNativeFeedback>
        </View>
    );
};
export default MiniPlayer;
