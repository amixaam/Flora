import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Colors } from "../../../styles/constants";

const CancelButton = ({
    handlePress = () => {},
    text = "Cancel",
    flex = false,
}) => {
    return (
        <TouchableNativeFeedback onPress={handlePress}>
            <View
                style={[
                    mainStyles.button_skeleton,
                    { backgroundColor: Colors.input, flex: flex ? 1 : 0 },
                ]}
            >
                <Text style={[textStyles.text, { color: Colors.primary }]}>
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default CancelButton;
