import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { TextInput as RNTextInput, StyleProp, TextStyle } from "react-native";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Colors } from "../../../styles/constants";

interface TextInputProps extends React.ComponentProps<typeof RNTextInput> {
    bottomSheet?: boolean;
}

const TextInput = ({ bottomSheet = false, ...TextInput }: TextInputProps) => {
    const style: StyleProp<TextStyle> = [
        textStyles.text,
        mainStyles.text_input_skeleton,
        { backgroundColor: Colors.input },
    ];

    const commonProps: TextInputProps = {
        placeholderTextColor: Colors.primary90,
        placeholder: "Placeholder...",
    };

    if (bottomSheet) {
        return (
            <BottomSheetTextInput
                {...commonProps}
                {...TextInput}
                style={style}
            />
        );
    }

    return <RNTextInput {...commonProps} {...TextInput} style={style} />;
};

export default TextInput;
