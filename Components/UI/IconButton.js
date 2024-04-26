import React from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../styles";

const IconButton = ({
    onPress = () => {
        console.log("Pressed!");
    },
    icon = "alert-circle",
    size = 24,
    isDisabled = false,
}) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={isDisabled}>
            <MaterialCommunityIcons
                name={icon}
                size={size}
                style={[
                    mainStyles.color_text,
                    isDisabled ? { opacity: 0.5 } : {},
                ]}
            />
        </TouchableOpacity>
    );
};

export default IconButton;
