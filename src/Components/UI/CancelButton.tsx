import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { Colors } from "../../styles/constants";

const CancelButton = ({ handlePress = () => {}, text = "Cancel" }) => {
    return (
        <TouchableNativeFeedback onPress={handlePress}>
            <View
                style={[
                    mainStyles.button_skeleton,
                    { backgroundColor: Colors.input60 },
                ]}
            >
                <Text style={[textStyles.h6, { color: Colors.primary90 }]}>
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default CancelButton;
