import { router } from "expo-router";
import { Text, TouchableNativeFeedback, View, ViewStyle } from "react-native";
import { useSongsStore } from "../store/songs";
import AlbumArt from "./AlbumArt";
import IconButton from "./UI/IconButton";

import { StyleProp } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useActiveTrack, usePlaybackState } from "react-native-track-player";
import { IconSizes, Spacing } from "../styles/constants";
import { newStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { CombineStrings } from "../utils/CombineStrings";
import MinimiseText from "../utils/MinimiseText";

export const MiniPlayer = ({ style }: { style?: StyleProp<ViewStyle> }) => {
    const { play, pause, next, previous } = useSongsStore();

    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();

    const hanldePlayPausePress = () => {
        if (playbackState.state === "playing") pause();
        else play();
    };

    const openPlayer = () => {
        router.push("/player");
    };

    const panGesture = Gesture.Pan()
        .onEnd((event) => {
            const { translationX, translationY } = event;

            // Swipe Right - Next Song
            if (translationX < -50) {
                next();
            }

            // Swipe Left - Previous Song
            if (translationX > 50) {
                previous();
            }

            // Swipe Up - Open Screen
            if (translationY < -50) {
                openPlayer();
            }
        })
        .runOnJS(true);

    if (!activeTrack) return;
    return (
        <GestureDetector gesture={panGesture}>
            <View style={style}>
                <TouchableNativeFeedback onPress={openPlayer}>
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
                                    <Text
                                        style={textStyles.h6}
                                        numberOfLines={1}
                                    >
                                        {MinimiseText(
                                            activeTrack.title,
                                            20,
                                            true
                                        )}
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
        </GestureDetector>
    );
};
export default MiniPlayer;
