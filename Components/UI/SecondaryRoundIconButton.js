import React from "react";
import { TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../styles";

const SecondaryRoundIconButton = ({
    icon = "shuffle",
    size = 28,
    padding = 8,
    onPress = () => {
        console.log("pressed button!");
    },
    style = {},
}) => {
    return (
        <TouchableNativeFeedback onPress={onPress}>
            <MaterialCommunityIcons
                name={icon}
                size={size}
                style={[
                    mainStyles.roundButton,
                    mainStyles.color_text,
                    { padding: padding },
                    style,
                ]}
            />
        </TouchableNativeFeedback>
    );
};

export default SecondaryRoundIconButton;
