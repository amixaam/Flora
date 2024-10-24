import { router } from "expo-router";
import { Dimensions, View } from "react-native";
import {
    Gesture,
    GestureDetector,
    ScrollView,
} from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Colors } from "../../../styles/constants";
import React from "react";
import SheetHeader from "../Headers/SheetHeader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const VELOCITY_THRESHOLD = 500; // Pixels per second
const DISTANCE_THRESHOLD = SCREEN_HEIGHT * 0.4; // % of window height

const SwipeDownScreen = ({
    children,
    bgColor = Colors.secondary,
    disable = false,
    header = <SheetHeader />,
}: {
    children?: React.ReactNode;
    bgColor?: Colors;
    disable?: boolean;
    header?: React.ReactNode;
}) => {
    if (disable) {
        return (
            <View style={{ flex: 1, backgroundColor: bgColor }}>
                {header}
                {children}
            </View>
        );
    }

    const translateY = useSharedValue(0);
    const scrollOffset = useSharedValue(0);

    const dismissGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (scrollOffset.value <= 0) {
                translateY.value = Math.max(0, event.translationY);
            }
        })
        .onEnd((event) => {
            if (
                event.translationY > DISTANCE_THRESHOLD ||
                event.velocityY > VELOCITY_THRESHOLD
            ) {
                runOnJS(router.back)();
                translateY.value = withTiming(
                    SCREEN_HEIGHT,
                    { duration: 100 },
                    () => {}
                );
            } else {
                translateY.value = withTiming(0);
            }
        });

    const headerGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = Math.max(0, event.translationY);
        })
        .onEnd((event) => {
            if (
                event.translationY > DISTANCE_THRESHOLD ||
                event.velocityY > VELOCITY_THRESHOLD
            ) {
                runOnJS(router.back)();
                translateY.value = withTiming(
                    SCREEN_HEIGHT,
                    { duration: 100 },
                    () => {}
                );
            } else {
                translateY.value = withTiming(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    flex: 1,
                    backgroundColor: bgColor,
                },
            ]}
        >
            <GestureDetector gesture={headerGesture}>{header}</GestureDetector>
            <GestureDetector gesture={dismissGesture}>
                <ScrollView
                    style={{ flex: 1 }}
                    onScroll={(event) => {
                        scrollOffset.value = event.nativeEvent.contentOffset.y;
                    }}
                >
                    {children}
                </ScrollView>
            </GestureDetector>
        </Animated.View>
    );
};

export default SwipeDownScreen;
