import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
import { Colors, Spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { CombineStrings } from "../utils/CombineStrings";
import MinimiseText from "../utils/MinimiseText";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
    const opacity = useSharedValue(1);

    // blurry BG
    const imageOpacity = useSharedValue(1);

    // Reset the position of the player
    const resetPosition = (startFrom?: any) => {
        "worklet";
        translateX.value = startFrom ? startFrom : withSpring(0);
    };

    // pan gestures
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            const { translationX, translationY } = event;
            const SWIPE_LENGTH = 50;

            // Swipe Left - Next Song
            if (translationX < -SWIPE_LENGTH) {
                runOnJS(skipToNext)();
                imageOpacity.value = withTiming(0, {
                    duration: 300,
                });
                translateX.value = withTiming(-SCREEN_WIDTH, {}, () => {
                    resetPosition(SCREEN_WIDTH);
                    imageOpacity.value = withTiming(1, { duration: 300 }); // Fade in new image
                    translateX.value = withSpring(0, {
                        stiffness: 250,
                        damping: 20,
                    });
                });
            }

            // Swipe Right - Previous Song
            if (translationX > SWIPE_LENGTH) {
                runOnJS(skipToPrevious)();
                imageOpacity.value = withTiming(0, {
                    duration: 300,
                });
                translateX.value = withTiming(SCREEN_WIDTH, {}, () => {
                    resetPosition(-SCREEN_WIDTH);
                    imageOpacity.value = withTiming(1, { duration: 300 }); // Fade in new image
                    translateX.value = withSpring(0, {
                        stiffness: 250,
                        damping: 20,
                    });
                });
            }

            // Swipe Down - Dismiss Screen
            if (translationY > SWIPE_LENGTH) {
                runOnJS(goBack)();
            }

            // Reset animation if no intentional swipe
            if (
                Math.abs(translationX) < SWIPE_LENGTH &&
                Math.abs(translationY) < SWIPE_LENGTH
            ) {
                resetPosition();
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            opacity: opacity.value,
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <View style={[mainStyles.container, { justifyContent: "center" }]}>
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

                {/* gesture pill */}
                <View
                    style={{
                        backgroundColor: Colors.primary,
                        width: 54,
                        height: 6,
                        borderRadius: Spacing.round,
                        position: "absolute",
                        top: Spacing.xl * 2,
                        alignSelf: "center",
                    }}
                />

                <Animated.View
                    style={[
                        {
                            flex: 1,
                            justifyContent: "center",
                            marginHorizontal: Spacing.appPadding * 2,
                            gap: Spacing.md,
                        },
                        animatedStyle,
                    ]}
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
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                            }}
                        >
                            <Text style={[textStyles.h5]} numberOfLines={1}>
                                {MinimiseText(activeTrack?.title, 20, true)}
                            </Text>
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
                                activeTrack?.isLiked ? "heart" : "heart-outline"
                            }
                        />
                    </View>

                    <PlaybackControls />
                </Animated.View>
                <SongSheet ref={SongOptionsRef} dismiss={dismissSongoptions} />
            </View>
        </GestureDetector>
    );
};

export default PlayerScreen;
