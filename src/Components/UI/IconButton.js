import React from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, iconSizes } from "../../styles/constants";

const IconButton = ({
    onPress = () => {
        console.log("Pressed!");
    },
    icon = "alert-circle",
    size = iconSizes.md,
    isDisabled = false,
}) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={isDisabled}>
            <MaterialCommunityIcons
                name={icon}
                size={size}
                style={[
                    isDisabled ? { opacity: 0.5 } : {},
                    { color: colors.primary },
                ]}
            />
        </TouchableOpacity>
    );
};

export default IconButton;
