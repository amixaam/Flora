import { View, Text } from "react-native";
import React from "react";
import ModalLayout from "./ModalLayout";
import { textStyles } from "../../styles/text";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";
import { Spacing } from "../../styles/constants";

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
            <View style={{ gap: Spacing.xs }}>
                <Text style={[textStyles.text, { textAlign: "center" }]}>
                    Are you sure you want to delete this {containerType}?
                </Text>
                <Text style={[textStyles.text, { textAlign: "center" }]}>
                    You cannot undo this action.
                </Text>
            </View>
            <View
                style={{
                    gap: 8,
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <SubmitButton text="Delete" handleSubmitForm={confirm} />
                <CancelButton handlePress={dismiss} />
            </View>
        </ModalLayout>
    );
};

export default DeleteContainer;
