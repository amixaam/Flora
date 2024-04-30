import React from "react";
import { TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../../styles/styles";
import { colors, iconSizes } from "../../styles/constants";

const PrimaryRoundIconButton = ({
    icon = "shuffle",
    size = iconSizes.md,
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
                        backgroundColor: colors.primary,
                        color: colors.bg,
                    },
                    style,
                ]}
            />
        </TouchableNativeFeedback>
    );
};

export default PrimaryRoundIconButton;
