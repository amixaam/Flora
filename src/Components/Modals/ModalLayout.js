import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { colors } from "../../styles/constants";

const ModalLayout = ({
    title = "Modal title",
    children,
    dismiss = () => {
        console.log("Modal dismissed!");
    },
    visible = false,
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
                    onPress={dismiss}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                mainStyles.modal,
                                { backgroundColor: colors.secondary },
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
