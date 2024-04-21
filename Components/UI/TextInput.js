import { View, Text, TextInput as RNTextInput } from "react-native";
import React from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { mainStyles, textStyles } from "../styles";

const TextInput = ({
    bottomSheet = false,
    placeholder = "Placeholder",
    value,
    setValue,
}) => {
    if (bottomSheet) {
        return (
            <BottomSheetTextInput
                style={[
                    mainStyles.text_input_skeleton,
                    textStyles.text,
                    mainStyles.color_bg_input,
                ]}
                placeholderTextColor={mainStyles.color_text_primary_90.color}
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
            />
        );
    }
    return (
        <RNTextInput
            style={[
                mainStyles.text_input_skeleton,
                textStyles.text,
                mainStyles.color_bg_input,
            ]}
            placeholderTextColor={mainStyles.color_text_primary_90.color}
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
        />
    );
};

export default TextInput;
