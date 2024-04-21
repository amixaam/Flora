import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles, textStyles } from "../styles";

const SubmitButton = ({ handleSubmitForm, text = "Submit" }) => {
    return (
        <TouchableNativeFeedback onPress={handleSubmitForm}>
            <View
                style={[
                    mainStyles.button_skeleton,
                    mainStyles.color_bg_primary,
                ]}
            >
                <Text style={[textStyles.h6, mainStyles.color_text_bg]}>
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SubmitButton;
