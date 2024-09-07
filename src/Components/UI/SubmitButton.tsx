import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { Colors } from "../../styles/constants";

const SubmitButton = ({ handleSubmitForm = () => {}, text = "Submit" }) => {
    return (
        <TouchableNativeFeedback onPress={handleSubmitForm}>
            <View
                style={[
                    mainStyles.button_skeleton,
                    { backgroundColor: Colors.primary },
                ]}
            >
                <Text style={[textStyles.text, { color: Colors.bg }]}>
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SubmitButton;
