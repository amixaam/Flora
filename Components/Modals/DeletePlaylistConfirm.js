import { View, Text } from "react-native";
import React from "react";
import ModalLayout from "./ModalLayout";
import { textStyles } from "../styles";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";

const DeletePlaylistConfirm = ({
    dismiss = () => {
        console.log("dismissed!");
    },
    visible = false,
    deletePlaylist = () => {
        console.log("deleted!");
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
                <SubmitButton text="Delete" handleSubmitForm={deletePlaylist} />
                <CancelButton handlePress={dismiss} />
            </View>
        </ModalLayout>
    );
};

export default DeletePlaylistConfirm;
