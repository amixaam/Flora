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
import { IconSizes, Spacing } from "../styles/constants";
import { newStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { CombineStrings } from "../utils/CombineStrings";

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
            <TouchableNativeFeedback onPress={() => router.push("/player")}>
                <View style={newStyles.miniPlayer}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: Spacing.sm,
                        }}
                    >
                        <AlbumArt
                            image={activeTrack.artwork}
                            style={{ height: 46 }}
                        />
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: Spacing.md,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                <Text style={textStyles.h6} numberOfLines={1}>
                                    {activeTrack.title}
                                </Text>
                                <Text
                                    style={textStyles.small}
                                    numberOfLines={1}
                                >
                                    {CombineStrings([
                                        activeTrack.artist,
                                        activeTrack.year,
                                    ])}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: Spacing.sm,
                                }}
                            >
                                <IconButton
                                    touchableOpacityProps={{
                                        onPress: previous,
                                    }}
                                    icon="skip-previous"
                                />
                                <IconButton
                                    touchableOpacityProps={{
                                        onPress: hanldePlayPausePress,
                                    }}
                                    size={IconSizes.lg}
                                    icon={
                                        playbackState.state === "playing"
                                            ? "pause"
                                            : "play"
                                    }
                                />
                                <IconButton
                                    touchableOpacityProps={{
                                        onPress: next,
                                    }}
                                    icon="skip-next"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
};
export default MiniPlayer;
