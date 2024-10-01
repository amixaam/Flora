import { router } from "expo-router";
import { StyleProp, Text, TextStyle, TextStyleAndroid } from "react-native";
import { Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import IconButton from "../IconButton";
import React from "react";

interface SheetHeaderProps {
    title?: string;
    titleStyle?: StyleProp<TextStyle | TextStyleAndroid>;
    headerbgColor?: Colors;
    headerLeft?: headerButtonProps;
    headerRight?: headerButtonProps | React.ReactElement;
}

interface headerButtonProps {
    icon?: string;
    onPress?: () => void;
}

const SheetHeader = ({
    title = "Modal title",
    titleStyle,
    headerbgColor,
    headerLeft = {
        icon: "arrow-left",
        onPress: () => {
            router.back();
        },
    },
    headerRight,
}: SheetHeaderProps) => {
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

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                gap: Spacing.xl,
                flexDirection: "row",
                paddingHorizontal: Spacing.appPadding,
                paddingVertical: Spacing.md,
                backgroundColor: headerbgColor && headerbgColor,
            }}
        >
            {headerLeftDisplay()}
            <Text
                style={[
                    textStyles.h5,
                    { paddingTop: 2 },
                    // ^ potentially overriden ^
                    titleStyle,
                    { flex: 1 },
                ]}
            >
                {title}
            </Text>
            {headerRightDisplay()}
        </SafeAreaView>
    );
};

const HeaderButton = ({
    icon = "alert-circle",
    onPress = () => {},
}: headerButtonProps) => {
    return (
        <IconButton
            icon={icon}
            touchableOpacityProps={{
                onPress: onPress,
            }}
        />
    );
};

export default SheetHeader;
