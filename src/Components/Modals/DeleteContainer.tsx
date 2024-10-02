import { View, Text } from "react-native";
import React from "react";
import ModalLayout from "./ModalLayout";
import { textStyles } from "../../styles/text";
import { Spacing } from "../../styles/constants";
import SubmitButton from "../UI/Buttons/SubmitButton";
import CancelButton from "../UI/Buttons/CancelButton";

const DeleteContainer = ({
    visible = false,
    dismiss = () => {
        console.log("dismissed!");
    },
    confirm = () => {
        console.log("confirmed!");
    },
    containerType = "",
}) => {
    return (
        <ModalLayout
            visible={visible}
            title={"Delete " + containerType + "?"}
            dismiss={dismiss}
        >
            <Text style={[textStyles.text]}>This action is permanent.</Text>
            <View
                style={{
                    gap: Spacing.sm,
                    flexDirection: "row",
                }}
            >
                <SubmitButton text="Delete" handleSubmitForm={confirm} flex />
                <CancelButton handlePress={dismiss} flex />
            </View>
        </ModalLayout>
    );
};

export default DeleteContainer;
