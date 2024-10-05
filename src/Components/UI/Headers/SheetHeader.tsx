import { router } from "expo-router";
import React from "react";
import { StyleProp, Text, TextStyle, TextStyleAndroid } from "react-native";
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
}

export interface IconButtonProps {
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

    const Title = (): React.ReactNode => {
        if (React.isValidElement(title)) {
            return title;
        } else {
            return (
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
            );
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
            {Title()}
            {headerRightDisplay()}
        </SafeAreaView>
    );
};

const HeaderButton = ({
    icon = "alert-circle",
    onPress = () => {},
}: IconButtonProps) => {
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
