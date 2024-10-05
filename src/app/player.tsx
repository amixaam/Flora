import { router } from "expo-router";
import React from "react";
import { Dimensions, Easing, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import TextTicker from "react-native-text-ticker";
import {
    skipToNext,
    skipToPrevious,
} from "react-native-track-player/lib/src/trackPlayer";
import SongSheet from "../Components/BottomSheets/Song/SongSheet";
import PlaybackControls from "../Components/UI/UI chunks/PlaybackControls";
import useBottomSheetModal from "../hooks/useBottomSheetModal";
import { useSongsStore } from "../store/songs";
import { Spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { Direction } from "../types/other";
import { CombineStrings } from "../utils/CombineStrings";
import ImageBlurBackground from "../Components/UI/UI chunks/ImageBlurBackground";
import AlbumArt from "../Components/UI/UI chunks/AlbumArt";
import PrimaryRoundIconButton from "../Components/UI/Buttons/PrimaryRoundIconButton";
import IconButton from "../Components/UI/Buttons/IconButton";
import TrackPlayer from "react-native-track-player";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PlayerScreen = () => {
    const { activeSong, likeSong, unlikeSong, setSelectedSong } =
        useSongsStore();

    const {
        sheetRef: SongOptionsRef,
        open: openSongOptions,
        close: dismissSongOptions,
    } = useBottomSheetModal();

    const goBack = () => {
        router.back();
    };

    // player UI
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const imageOpacity = useSharedValue(1);

    // Reset the position of the player
    const resetPosition = (startFrom?: any) => {
        "worklet";
        translateX.value = startFrom ? startFrom : withSpring(0);
    };

    const dismissGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = Math.max(0, event.translationY);
        })
        .onEnd((event) => {
            const DISMISS_THRESHOLD = 100;

            // Swipe Down - Dismiss Screen
            if (event.translationY > DISMISS_THRESHOLD) {
                runOnJS(goBack)();
                translateY.value = withTiming(SCREEN_HEIGHT, {}, () => {});
            } else {
                translateY.value = withTiming(0); // Reset if swipe was not enough
            }
        })
        .minDistance(2)
        .failOffsetX(1);

    const triggerSkipAnimation = (
        direction: Direction,
        fast: boolean = false
    ) => {
        const duration = fast ? 200 : 600; //600
        const defaultDuration = fast ? 200 : 300; //300
        const opacityDuration = fast ? 200 : 300; //300
        const dampingRatio = 0.8; //0.8

        if (direction === Direction.LEFT) {
            imageOpacity.value = withTiming(0, { duration: opacityDuration });
            translateX.value = withTiming(
                -SCREEN_WIDTH,
                { duration: defaultDuration },
                () => {
                    resetPosition(SCREEN_WIDTH);
                    translateX.value = withSpring(0, {
                        dampingRatio: dampingRatio,
                        duration: duration,
                    });
                    imageOpacity.value = withTiming(1, {
                        duration: opacityDuration,
                    });
                }
            );
        } else if (direction === Direction.RIGHT) {
            imageOpacity.value = withTiming(0, { duration: opacityDuration });
            translateX.value = withTiming(
                SCREEN_WIDTH,
                { duration: defaultDuration },
                () => {
                    resetPosition(-SCREEN_WIDTH);
                    translateX.value = withSpring(0, {
                        dampingRatio: dampingRatio,
                        duration: duration,
                    });
                    imageOpacity.value = withTiming(1, {
                        duration: opacityDuration,
                    });
                }
            );
        }
    };

    const skipGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            const SWIPE_THRESHOLD = 50;

            if (event.translationX < -SWIPE_THRESHOLD) {
                runOnJS(skipToNext)();
                runOnJS(triggerSkipAnimation)(Direction.LEFT);
            } else if (event.translationX > SWIPE_THRESHOLD) {
                runOnJS(skipToPrevious)();
                runOnJS(triggerSkipAnimation)(Direction.RIGHT);
            } else {
                translateX.value = withSpring(0); // Reset if no significant swipe
            }
        })
        .minDistance(2)
        .failOffsetY(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const animatedVerticalStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const currentTrack = TrackPlayer.getActiveTrack();
    if (!activeSong || !currentTrack) {
        return null;
    }

    return (
        <GestureDetector gesture={dismissGesture}>
            <Animated.View
                style={[
                    mainStyles.container,
                    { justifyContent: "center" },
                    animatedVerticalStyle,
                ]}
            >
                <ImageBlurBackground
                    image={activeSong.artwork}
                    blur={15}
                    style={{
                        height: "85%",
                        top: 0,
                    }}
                    gradient={{
                        colors: [
                            "#050506",
                            "#05050650",
                            "#05050650",
                            "#05050630",
                            "#050506",
                        ],
                        locations: [0.1, 0.4, 0.5, 0.6, 1],
                    }}
                    opacity={imageOpacity}
                />

                <View
                    style={[
                        {
                            justifyContent: "center",
                            marginHorizontal: Spacing.appPadding * 2,
                            gap: Spacing.md,
                        },
                    ]}
                >
                    <GestureDetector gesture={skipGesture}>
                        <Animated.View
                            style={[{ gap: Spacing.md }, animatedStyle]}
                        >
                            <View>
                                <AlbumArt
                                    image={activeSong.artwork}
                                    style={{
                                        aspectRatio: 1,
                                        borderRadius: Spacing.radius,
                                    }}
                                />
                                <PrimaryRoundIconButton
                                    icon="pencil"
                                    onPress={async () => {
                                        await setSelectedSong(activeSong);
                                        openSongOptions();
                                    }}
                                    style={{
                                        position: "absolute",
                                        bottom: Spacing.md,
                                        right: Spacing.md,
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    marginBottom: Spacing.xl,
                                    gap: Spacing.xl,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "column",
                                        flex: 1,
                                    }}
                                >
                                    <TextTicker
                                        key={activeSong.title}
                                        style={textStyles.h5}
                                        duration={12 * 1000}
                                        marqueeDelay={2 * 1000}
                                        easing={Easing.linear}
                                        bounce={false}
                                        scroll={false}
                                        loop
                                    >
                                        {activeSong.title}
                                    </TextTicker>
                                    <Text style={[textStyles.text]}>
                                        {CombineStrings([
                                            activeSong.artist,
                                            activeSong.year,
                                        ])}
                                    </Text>
                                </View>
                                <IconButton
                                    touchableOpacityProps={{
                                        onPress: () =>
                                            activeSong.isLiked
                                                ? unlikeSong(activeSong.id)
                                                : likeSong(activeSong.id),
                                    }}
                                    icon={
                                        activeSong.isLiked
                                            ? "heart"
                                            : "heart-outline"
                                    }
                                />
                            </View>
                        </Animated.View>
                    </GestureDetector>
                    <PlaybackControls animation={triggerSkipAnimation} />
                </View>
                <SongSheet ref={SongOptionsRef} dismiss={dismissSongOptions} />
            </Animated.View>
        </GestureDetector>
    );
};

export default PlayerScreen;
