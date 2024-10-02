import React from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, DefaultIcon, IconSizes } from "../../../styles/constants";

type IconButtonTypes = {
    touchableOpacityProps?: React.ComponentProps<typeof TouchableOpacity>;
    icon?: string;
    size?: IconSizes;
};

const IconButton = ({
    touchableOpacityProps = {},
    icon = DefaultIcon,
    size = IconSizes.md,
}: IconButtonTypes) => {
    return (
        <TouchableOpacity {...touchableOpacityProps}>
            <MaterialCommunityIcons
                name={icon}
                size={size}
                style={[
                    touchableOpacityProps.disabled && { opacity: 0.5 },
                    { color: Colors.primary },
                ]}
            />
        </TouchableOpacity>
    );
};

export default IconButton;
