import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { Colors } from "../../styles/constants";

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
                        backgroundColor: "#00000060",
                        flex: 1,
                        justifyContent: "center",
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                mainStyles.modal,
                                { backgroundColor: Colors.secondary },
                            ]}
                        >
                            <Text
                                style={[textStyles.h4, { textAlign: "center" }]}
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