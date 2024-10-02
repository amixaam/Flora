import React from "react";
import { Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { Spacing } from "../../styles/constants";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";

const ModalLayout = ({
    title = "Modal title",
    dismiss = () => {
        console.log("Modal dismissed!");
    },
    visible = false,
    children,
}: {
    title?: string;
    dismiss?: () => void;
    visible?: boolean;
    children?: React.ReactNode;
}) => {
    // modal defaults
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={dismiss}>
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#00000090",
                        flex: 1,
                        justifyContent: "center",
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View style={mainStyles.modal}>
                            <Text
                                style={[
                                    textStyles.h4,
                                    { marginBottom: -Spacing.sm },
                                ]}
                            >
                                {title}
                            </Text>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ModalLayout;
