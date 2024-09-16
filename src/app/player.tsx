import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useRef } from "react";
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
import { useActiveTrack } from "react-native-track-player";
import {
    skipToNext,
    skipToPrevious,
} from "react-native-track-player/lib/src/trackPlayer";
import AlbumArt from "../Components/AlbumArt";
import SongSheet from "../Components/BottomSheets/Song/SongSheet";
import ImageBlurBackground from "../Components/ImageBlurBackground";
import PlaybackControls from "../Components/PlaybackControls";
import IconButton from "../Components/UI/IconButton";
import PrimaryRoundIconButton from "../Components/UI/PrimaryRoundIconButton";
import { useSongsStore } from "../store/songs";
import { Spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { Direction } from "../types/other";
import { CombineStrings } from "../utils/CombineStrings";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PlayerScreen = () => {
    const { likeSong, unlikeSong, setSelectedSong, getSong } = useSongsStore();
    const activeTrack = useActiveTrack();

    const SongOptionsRef = useRef<BottomSheetModal>(null);
    const openSongOptions = useCallback(() => {
        SongOptionsRef.current?.present();
    }, []);
    const dismissSongoptions = useCallback(() => {
        SongOptionsRef.current?.dismiss();
    }, []);

    const handleLikeButtonPress = () => {
        if (activeTrack) {
            if (activeTrack.isLiked) {
                unlikeSong(activeTrack.id);
                activeTrack.isLiked = false;
            } else {
                likeSong(activeTrack.id);
                activeTrack.isLiked = true;
            }
        }
    };

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
                    image={activeTrack?.artwork}
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
                                    image={activeTrack?.artwork}
                                    style={{
                                        aspectRatio: 1,
                                        borderRadius: Spacing.radius,
                                    }}
                                />
                                <PrimaryRoundIconButton
                                    icon="pencil"
                                    onPress={() => {
                                        let song = getSong(activeTrack?.id);
                                        if (song) {
                                            setSelectedSong(song);
                                            openSongOptions();
                                        }
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
                                        key={activeTrack?.title}
                                        style={textStyles.h5}
                                        duration={12 * 1000}
                                        marqueeDelay={2 * 1000}
                                        easing={Easing.linear}
                                        bounce={false}
                                        scroll={false}
                                        loop
                                    >
                                        {activeTrack?.title}
                                    </TextTicker>
                                    <Text style={[textStyles.text]}>
                                        {CombineStrings([
                                            activeTrack?.artist,
                                            activeTrack?.year,
                                        ])}
                                    </Text>
                                </View>
                                <IconButton
                                    touchableOpacityProps={{
                                        onPress: handleLikeButtonPress,
                                    }}
                                    icon={
                                        activeTrack?.isLiked
                                            ? "heart"
                                            : "heart-outline"
                                    }
                                />
                            </View>
                        </Animated.View>
                    </GestureDetector>
                    <PlaybackControls animation={triggerSkipAnimation} />
                </View>
                <SongSheet ref={SongOptionsRef} dismiss={dismissSongoptions} />
            </Animated.View>
        </GestureDetector>
    );
};

export default PlayerScreen;
