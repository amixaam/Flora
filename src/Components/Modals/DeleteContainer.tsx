import { View, Text } from "react-native";
import React from "react";
import ModalLayout from "./ModalLayout";
import { textStyles } from "../../styles/text";
import { Spacing } from "../../styles/constants";
import MainButton from "../UI/Buttons/MainButton";

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
                <MainButton flex text="Delete" onPress={confirm} />
                <MainButton
                    flex
                    onPress={dismiss}
                    text="Cancel"
                    type="secondary"
                />
            </View>
        </ModalLayout>
    );
};

export default DeleteContainer;
