import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { mainStyles, textStyles } from "../styles";

const ModalLayout = ({
    title = "Modal title",
    children,
    dismiss = () => {
        console.log("Modal dismissed!");
    },
    visible = false,
}) => {
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
                    onPress={dismiss}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                mainStyles.modal,
                                mainStyles.color_bg_secondary,
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
