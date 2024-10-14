import { router } from "expo-router";
import React from "react";
import { StyleProp, TextStyle, TextStyleAndroid, View } from "react-native";
import Animated, {
    interpolate,
    interpolateColor,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import IconButton from "../Buttons/IconButton";

interface SheetHeaderProps {
    title?: string | React.ReactElement;
    titleStyle?: StyleProp<TextStyle | TextStyleAndroid>;
    headerbgColor?: Colors;
    headerLeft?: IconButtonProps | React.ReactElement;
    headerRight?: IconButtonProps | React.ReactElement;
    interpolateRange?: [number, number];
    scrollY: SharedValue<number>;
}

export interface IconButtonProps {
    icon?: string;
    onPress?: () => void;
}

const AnimatedHeader = ({
    title = "Modal title",
    titleStyle,
    interpolateRange = [200, 400],
    headerLeft = {
        icon: "arrow-left",
        onPress: () => {
            router.back();
        },
    },
    headerRight,
    scrollY,
}: SheetHeaderProps) => {
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                scrollY.value,
                interpolateRange,
                ["#05050600", "#050506"],
                "RGB"
            ),
            borderColor: interpolateColor(scrollY.value, interpolateRange, [
                Colors.transparent,
                Colors.secondary,
            ]),
        };
    });
    const headerTextAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollY.value, interpolateRange, [0, 1]),
            transform: [
                {
                    translateX: interpolate(
                        scrollY.value,
                        interpolateRange,
                        [-10, 0],
                        "clamp"
                    ),
                },
            ],
        };
    });
    const headerRightDisplay = (): React.ReactNode => {
        if (!headerRight) return;
        if (React.isValidElement(headerRight)) {
            return headerRight;
        } else {
            return <HeaderButton {...headerRight} />;
        }
    };

    const headerLeftDisplay = (): React.ReactNode => {
        if (!headerLeft) return;
        if (React.isValidElement(headerLeft)) {
            return headerLeft;
        } else {
            return <HeaderButton {...headerLeft} />;
        }
    };

    const Title = (): React.ReactNode => {
        if (React.isValidElement(title)) {
            return title;
        } else {
            return (
                <Animated.Text
                    style={[
                        textStyles.h5,
                        { paddingTop: 2 },
                        // ^ potentially overriden ^
                        titleStyle,
                        headerTextAnimatedStyle,
                        { flex: 1 },
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Animated.Text>
            );
        }
    };

    return (
        <Animated.View
            style={[
                {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    borderBottomWidth: 2,
                },
                headerAnimatedStyle,
            ]}
        >
            <SafeAreaView edges={["top"]} />
            <View
                style={{
                    gap: Spacing.xl,
                    paddingHorizontal: Spacing.appPadding,
                    paddingVertical: Spacing.md,
                    flexDirection: "row",
                }}
            >
                {headerLeftDisplay()}
                {Title()}
                {headerRightDisplay()}
            </View>
        </Animated.View>
    );
};

const HeaderButton = ({
    icon = "alert-circle",
    onPress = () => {},
}: IconButtonProps) => {
    return <IconButton icon={icon} onPress={onPress} />;
};

export default AnimatedHeader;
