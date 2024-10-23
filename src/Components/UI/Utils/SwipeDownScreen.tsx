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
const HEADER_HEIGHT = 56;

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
    const scrollOffset = useSharedValue(0);
    const isScrolling = useSharedValue(false);
    const startY = useSharedValue(0);

    const scrollGesture = Gesture.Native()
        .onBegin(() => {
            isScrolling.value = true;
        })
        .onEnd(() => {
            isScrolling.value = false;
        });

    const dismissGesture = Gesture.Pan()
        .onStart((event) => {
            startY.value = event.absoluteY;
        })
        .onUpdate((event) => {
            // Only allow dismissal if:
            // 1. Scroll is at the top (scrollOffset is 0) OR
            // 2. The gesture started in the header area
            if (scrollOffset.value === 0 || startY.value < HEADER_HEIGHT) {
                translateY.value = Math.max(0, event.translationY);
            }
        })
        .onEnd((event) => {
            const DISMISS_THRESHOLD = 10;

            // Only process dismissal if we're actually tracking a dismiss gesture
            if (translateY.value > 0) {
                if (event.translationY > DISMISS_THRESHOLD) {
                    runOnJS(router.back)();
                    translateY.value = withTiming(
                        SCREEN_HEIGHT,
                        { duration: 100 },
                        () => {}
                    );
                } else {
                    translateY.value = withTiming(0);
                }
            }
        })
        .simultaneousWithExternalGesture(scrollGesture);

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
