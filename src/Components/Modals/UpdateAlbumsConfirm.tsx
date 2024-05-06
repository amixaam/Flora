import { View, Text } from "react-native";
import React from "react";
import ModalLayout from "./ModalLayout";
import { textStyles } from "../../styles/text";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";

const UpdateAlbumsConfirm = ({
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
                This action will update the saved metadata for all songs in this
                album, to match the album. (artwork, artist, year)
            </Text>
            <View style={{ marginTop: 8, rowGap: 8 }}>
                <SubmitButton text="Update" handleSubmitForm={confirm} />
                <CancelButton handlePress={dismiss} />
            </View>
        </ModalLayout>
    );
};

export default UpdateAlbumsConfirm;
