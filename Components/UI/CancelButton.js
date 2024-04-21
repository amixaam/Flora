import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles, textStyles } from "../styles";

const CancelButton = ({ handlePress, text = "Cancel" }) => {
    return (
        <TouchableNativeFeedback onPress={handlePress}>
            <View
                style={[
                    mainStyles.button_skeleton,
                    mainStyles.color_bg_input_60,
                ]}
            >
                <Text style={[textStyles.h6, mainStyles.color_text_primary_90]}>
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default CancelButton;
