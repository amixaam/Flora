import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { TextInput as RNTextInput } from "react-native";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Colors } from "../../../styles/constants";

interface Props {
    bottomSheet?: boolean;
    placeholder?: string;
    value?: string;
    inputProps?: React.ComponentProps<typeof RNTextInput>;
    setValue?: (value: string) => void;
}

const TextInput = ({
    bottomSheet = false,
    placeholder = "Placeholder",
    inputProps,
    value,
    setValue,
}: Props) => {
    if (bottomSheet) {
        return (
            <BottomSheetTextInput
                style={[
                    mainStyles.text_input_skeleton,
                    textStyles.text,
                    { backgroundColor: Colors.input },
                ]}
                placeholderTextColor={Colors.primary90}
                {...inputProps}
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
                { backgroundColor: Colors.input },
            ]}
            placeholderTextColor={Colors.primary90}
            {...inputProps}
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
        />
    );
};

export default TextInput;
