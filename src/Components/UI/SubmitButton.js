import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { colors } from "../../styles/constants";

const SubmitButton = ({ handleSubmitForm, text = "Submit" }) => {
    return (
        <TouchableNativeFeedback onPress={handleSubmitForm}>
            <View
                style={[
                    mainStyles.button_skeleton,
                    { backgroundColor: colors.primary },
                ]}
            >
                <Text style={[textStyles.h6, { color: colors.bg }]}>
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SubmitButton;
