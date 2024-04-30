import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { TextInput as RNTextInput } from "react-native";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { colors } from "../../styles/constants";
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
                    { backgroundColor: colors.input },
                ]}
                placeholderTextColor={colors.primary90}
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
                { backgroundColor: colors.input },
            ]}
            placeholderTextColor={colors.primary90}
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
        />
    );
};

export default TextInput;
