import React from "react";
import { TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../../styles/styles";
import {  Colors, DefaultIcon, IconSizes } from "../../styles/constants";

const PrimaryRoundIconButton = ({
    icon = DefaultIcon,
    size = IconSizes.md,
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
                    {
                        padding: padding,
                        backgroundColor: Colors.primary,
                        color: Colors.bg,
                    },
                    style,
                ]}
            />
        </TouchableNativeFeedback>
    );
};

export default PrimaryRoundIconButton;
