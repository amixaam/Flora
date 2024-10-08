import { router } from "expo-router";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Colors } from "../../../styles/constants";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SwipeDownScreen = ({
    children,
    bgColor = Colors.secondary,
    disable = false,
}: {
    children?: React.ReactNode;
    bgColor?: Colors;
    disable?: boolean;
}) => {
    if (disable) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: bgColor,
                }}
            >
                {children}
            </View>
        );
    }
    const translateY = useSharedValue(0);

    const dismissGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = Math.max(0, event.translationY);
        })
        .onEnd((event) => {
            const DISMISS_THRESHOLD = 10;

            // Swipe Down - Dismiss Screen
            if (event.translationY > DISMISS_THRESHOLD) {
                runOnJS(router.back)();
                translateY.value = withTiming(
                    SCREEN_HEIGHT,
                    { duration: 100 },
                    () => {}
                );
            } else {
                translateY.value = withTiming(0); // Reset if swipe was not enough
            }
        })
        .requireExternalGestureToFail()
        .minDistance(5)
        .failOffsetX(4);

    const animatedVerticalStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <GestureDetector gesture={dismissGesture}>
            <Animated.View
                style={[
                    animatedVerticalStyle,
                    {
                        flex: 1,
                        backgroundColor: bgColor,
                    },
                ]}
            >
                {children}
            </Animated.View>
        </GestureDetector>
    );
};

export default SwipeDownScreen;
