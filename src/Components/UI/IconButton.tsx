import React from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, DefaultIcon, IconSizes } from "../../styles/constants";

const IconButton = ({
    onPress = () => {
        console.log("Pressed!");
    },
    icon = DefaultIcon,
    size = IconSizes.md,
    isDisabled = false,
}) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={isDisabled}>
            <MaterialCommunityIcons
                name={icon}
                size={size}
                style={[
                    isDisabled ? { opacity: 0.5 } : {},
                    { color: Colors.primary },
                ]}
            />
        </TouchableOpacity>
    );
};

export default IconButton;
