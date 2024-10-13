import {
    Easing,
    Text,
    TouchableNativeFeedback,
    View,
    ViewStyle,
} from "react-native";
import { useSongsStore } from "../../../store/songs";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleProp } from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureType,
} from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import TextTicker from "react-native-text-ticker";
import { usePlaybackState, useProgress } from "react-native-track-player";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { CombineStrings } from "../../../utils/CombineStrings";
import IconButton from "../Buttons/IconButton";
import AlbumArt from "./AlbumArt";

export const MiniPlayer = ({ style }: { style?: StyleProp<ViewStyle> }) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    // Reset the position of the player
    const resetPosition = () => {
        "worklet";
        translateX.value = withSpring(0, { damping: 15 });
        opacity.value = withTiming(1, { duration: 200 });
    };

    const skipAnimation = (direction: 1 | -1) => {
        opacity.value = withTiming(0, { duration: 150 });
        translateX.value = withTiming(
            direction * 200,
            { duration: 200 },
            () => {
                translateX.value = direction * -200;
                resetPosition();
            }
        );
    };

    const { next, previous, activeSong } = useSongsStore();

    const onSongChange = (direction: 1 | -1) => {
        if (direction === -1) {
            previous();
        } else {
            next();
        }
    };

    const skipGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;

            // Max swipe for opacity
            const SWIPE_DISTANCE = 150;
            opacity.value =
                1 - Math.min(Math.abs(event.translationX) / SWIPE_DISTANCE, 1);
        })
        .onEnd((event) => {
            const SWIPE_THRESHOLD = 40;
            const direction = event.translationX > 0 ? 1 : -1;

            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                runOnJS(onSongChange)(direction);
                // @ts-ignore
                runOnJS(skipAnimation)(direction);
            } else {
                resetPosition();
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            opacity: opacity.value,
        };
    });

    const openPlayer = () => {
        router.push("/overlays/player");
    };

    if (!activeSong) return null;

    return (
        <View style={style} testID="mini-player">
            <TouchableNativeFeedback onPress={openPlayer}>
                <View style={newStyles.miniPlayer}>
                    <SongDetails
                        skipGesture={skipGesture}
                        animatedStyle={animatedStyle}
                    />
                    <SongControls skipAnimation={skipAnimation} />
                </View>
            </TouchableNativeFeedback>
        </View>
    );
};
export default MiniPlayer;

interface d {
    transform: {
        translateX: number;
    }[];
    opacity: number;
}

interface SongDetailsProps {
    skipGesture: GestureType;
    animatedStyle: d;
}

const SongDetails = ({ skipGesture, animatedStyle }: SongDetailsProps) => {
    const { activeSong } = useSongsStore();
    if (!activeSong) return null;

    return (
        <View
            style={{
                flex: 1,
                overflow: "hidden",
                position: "relative",
                paddingStart: Spacing.appPadding,
            }}
        >
            <LinearGradient
                colors={["transparent", Colors.secondary]}
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 16,
                    zIndex: 1,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            />
            <GestureDetector gesture={skipGesture}>
                <Animated.View
                    style={[
                        {
                            flexDirection: "row",
                            alignItems: "center",
                            gap: Spacing.sm,
                            flex: 1,
                        },
                        animatedStyle,
                    ]}
                >
                    <AlbumArt
                        image={activeSong.artwork}
                        style={{ height: 46 }}
                    />

                    <View
                        style={{
                            flexDirection: "column",
                            flex: 1,
                            position: "relative",
                        }}
                    >
                        <TextTicker
                            key={activeSong.title}
                            style={textStyles.h6}
                            duration={12 * 1000}
                            marqueeDelay={2 * 1000}
                            easing={Easing.linear}
                            bounce={false}
                            scroll={false}
                            loop
                        >
                            {activeSong.title}
                        </TextTicker>
                        <Text style={textStyles.small} numberOfLines={1}>
                            {CombineStrings([
                                activeSong.artist,
                                activeSong.year,
                            ])}
                        </Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

interface SongControlsProps {
    skipAnimation: (direction: 1 | -1) => void;
}

const SongControls = ({ skipAnimation }: SongControlsProps) => {
    const { play, pause, next, previous } = useSongsStore();
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const hanldePlayPausePress = () => {
        if (playbackState.state === "playing") pause();
        else play();
    };

    const handlePlayNext = () => {
        next();
        skipAnimation(1);
    };

    const handlePlayPrevious = () => {
        previous();
        if (progress.position < 3) {
            skipAnimation(-1);
        }
    };

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing.mmd,
            }}
        >
            <IconButton
                touchableOpacityProps={{
                    onPress: handlePlayPrevious,
                }}
                icon="skip-previous"
            />
            <IconButton
                touchableOpacityProps={{
                    onPress: hanldePlayPausePress,
                }}
                size={IconSizes.lg}
                icon={playbackState.state === "playing" ? "pause" : "play"}
            />
            <IconButton
                touchableOpacityProps={{
                    onPress: handlePlayNext,
                }}
                icon="skip-next"
            />
        </View>
    );
};
