import { View, Text } from "react-native";
import React from "react";
import ModalLayout from "./ModalLayout";
import { textStyles } from "../../styles/text";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";

const DeletePlaylist = ({
    dismiss = () => {
        console.log("dismissed!");
    },
    visible = false,
    confirm = () => {
        console.log("confirmed!");
    },
}) => {
    return (
        <ModalLayout
            visible={visible}
            title="Delete playlist?"
            dismiss={dismiss}
        >
            <Text style={[textStyles.text, { textAlign: "center" }]}>
                Are you sure you want to delete this playlist? You cannot undo
                this action.
            </Text>
            <View style={{ marginTop: 8, rowGap: 8 }}>
                <SubmitButton text="Delete" handleSubmitForm={confirm} />
                <CancelButton handlePress={dismiss} />
            </View>
        </ModalLayout>
    );
};

export default DeletePlaylist;