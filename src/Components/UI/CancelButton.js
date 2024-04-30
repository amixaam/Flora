import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { colors } from "../../styles/constants";

const CancelButton = ({ handlePress, text = "Cancel" }) => {
    return (
        <TouchableNativeFeedback onPress={handlePress}>
            <View
                style={[
                    mainStyles.button_skeleton,
                    { backgroundColor: colors.input60 },
                ]}
            >
                <Text style={[textStyles.h6, { color: colors.primary90 }]}>
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default CancelButton;
