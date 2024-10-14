import React from "react";
import { Pressable, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
    Colors,
    DefaultIcon,
    IconSizes,
    Spacing,
} from "../../../styles/constants";

interface IconButtonTypes extends React.ComponentProps<typeof Pressable> {
    icon?: string;
    iconColor?: Colors;
    size?: IconSizes;
}

const IconButton = ({
    icon = DefaultIcon,
    iconColor = Colors.primary,
    size = IconSizes.md,
    ...touchableOpacityProps
}: IconButtonTypes) => {
    return (
        <Pressable
            {...touchableOpacityProps}
            android_ripple={{
                borderless: true,
                color: Colors.primary + "30",
            }}
        >
            <MaterialCommunityIcons
                name={icon}
                size={size}
                style={[
                    touchableOpacityProps.disabled && { opacity: 0.25 },
                    { color: iconColor },
                ]}
            />
        </Pressable>
    );
};

export default IconButton;
