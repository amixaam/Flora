import React from "react";
import { TouchableNativeFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { mainStyles } from "../../styles/styles";
import { Colors, DefaultIcon, IconSizes } from "../../styles/constants";
const SecondaryRoundIconButton = ({
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
                    { padding: padding, color: Colors.primary },
                    style,
                ]}
            />
        </TouchableNativeFeedback>
    );
};

export default SecondaryRoundIconButton;
