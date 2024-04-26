import React from "react";
import { TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../styles";

const PrimaryRoundIconButton = ({
    icon = "shuffle",
    size = 24,
    padding = 8,
    onPress = () => {
        console.log("pressed button!");
    },
}) => {
    return (
        <TouchableNativeFeedback onPress={onPress}>
            <MaterialCommunityIcons
                name={icon}
                size={size}
                style={[
                    mainStyles.roundButton,
                    mainStyles.color_text_bg,
                    mainStyles.color_bg_primary,
                    { padding: padding },
                ]}
            />
        </TouchableNativeFeedback>
    );
};

export default PrimaryRoundIconButton;
