import { View, Text } from "react-native";
import React from "react";
import ModalLayout from "./ModalLayout";
import { textStyles } from "../../styles/text";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";

const UpdateSongsToo = ({
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
            title="Update song tags?"
            dismiss={dismiss}
        >
            <Text style={[textStyles.text, { textAlign: "center" }]}>
                Do you want to update the song tags aswell? This will update the
                year, artist and artwork.
            </Text>
            <View style={{ marginTop: 8, rowGap: 8 }}>
                <SubmitButton text="Update" handleSubmitForm={confirm} />
                <CancelButton handlePress={dismiss} text="Don't update" />
            </View>
        </ModalLayout>
    );
};

export default UpdateSongsToo;
