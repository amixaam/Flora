import { router } from "expo-router";
import React from "react";
import { Dimensions, Easing, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { IconButton as PaperIconButton } from "react-native-paper";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextTicker from "react-native-text-ticker";
import {
    skipToNext,
    skipToPrevious,
} from "react-native-track-player/lib/src/trackPlayer";
import SongSheet from "../../Components/BottomSheets/Song/SongSheet";
import AlbumArt from "../../Components/UI/UI chunks/AlbumArt";
import ImageBlurBackground from "../../Components/UI/UI chunks/ImageBlurBackground";
import PlaybackControls from "../../Components/UI/UI chunks/PlaybackControls";
import useTrack from "../../hooks/useActiveTrack";
import useBottomSheetModal from "../../hooks/useBottomSheetModal";
import { usePlaybackStore } from "../../store/playbackStore";
import { useSongsStore } from "../../store/songsStore";
import { Colors, Spacing } from "../../styles/constants";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { Direction } from "../../types/other";
import { Song } from "../../types/song";
import { CombineStrings } from "../../utils/CombineStrings";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PlayerScreen = () => {
    const { setSelectedSong } = useSongsStore();
    const { toggleLike } = usePlaybackStore();

    const { bottom } = useSafeAreaInsets();

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

    const { track: activeSong, updateTrack } = useTrack();

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
                    image={activeSong?.artwork}
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
                            <AlbumArt
                                image={activeSong?.artwork}
                                style={{
                                    aspectRatio: 1,
                                    borderRadius: Spacing.radius,
                                }}
                            />
                            <View
                                style={{
                                    marginBottom: Spacing.xl,
                                    gap: Spacing.sm,
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
                                        key={activeSong?.title}
                                        style={textStyles.h5}
                                        duration={12 * 1000}
                                        marqueeDelay={2 * 1000}
                                        easing={Easing.linear}
                                        bounce={false}
                                        scroll={false}
                                        loop
                                    >
                                        {activeSong?.title}
                                    </TextTicker>
                                    <Text
                                        style={[textStyles.text]}
                                        numberOfLines={1}
                                    >
                                        {CombineStrings([
                                            activeSong?.artist as string,
                                            activeSong?.year as string,
                                        ])}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <PaperIconButton
                                        testID={
                                            activeSong?.rating
                                                ? "unlike-button"
                                                : "like-button"
                                        }
                                        onPress={() => {
                                            toggleLike(activeSong?.id);
                                            updateTrack({
                                                rating: activeSong?.rating
                                                    ? 0
                                                    : 1,
                                            });
                                        }}
                                        icon={
                                            activeSong?.rating
                                                ? "heart"
                                                : "heart-outline"
                                        }
                                        iconColor={Colors.primary}
                                        style={{ marginRight: -Spacing.sm }}
                                        disabled={!activeSong}
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    </GestureDetector>
                    <PlaybackControls animation={triggerSkipAnimation} />
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        bottom: Spacing.appPadding + bottom,
                        right: Spacing.appPadding,
                        left: Spacing.appPadding,
                        gap: Spacing.xl * 1.5,
                    }}
                >
                    <View>
                        {activeSong && (
                            <Text style={textStyles.small}>
                                {CombineStrings([
                                    activeSong.extension.toUpperCase(),
                                    Math.round(activeSong.sampleRate / 100) /
                                        10 +
                                        " kHz",
                                    Math.floor(activeSong.bitRate / 1000) +
                                        " kb/s",
                                ])}
                            </Text>
                        )}
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <PaperIconButton
                            testID="queue-button"
                            icon="playlist-play"
                            onPress={() => router.push("/overlays/queue")}
                            iconColor={Colors.primary}
                        />
                        <PaperIconButton
                            testID="sleep-button"
                            icon="alarm"
                            iconColor={Colors.primary}
                            disabled
                        />
                        <PaperIconButton
                            testID="options-button"
                            icon="dots-vertical"
                            onPress={async () => {
                                await setSelectedSong(activeSong as Song);
                                openSongOptions();
                            }}
                            disabled={!activeSong}
                            iconColor={Colors.primary}
                        />
                    </View>
                </View>
                <SongSheet ref={SongOptionsRef} dismiss={dismissSongOptions} />
            </Animated.View>
        </GestureDetector>
    );
};

export default PlayerScreen;
