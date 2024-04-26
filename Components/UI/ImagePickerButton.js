import * as ImagePicker from "expo-image-picker";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { mainStyles } from "../styles";
import { Image } from "react-native";

const ImagePickerButton = ({ image, setImage }) => {
    const pickImage = async () => {
        await ImagePicker.getMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };

    return (
        <TouchableOpacity onPress={pickImage}>
            <Image
                source={{ uri: image }}
                style={[
                    mainStyles.color_bg_input,
                    {
                        alignSelf: "center",
                        width: "50%",
                        aspectRatio: 1,
                        borderRadius: 7,
                    },
                ]}
            />
        </TouchableOpacity>
    );
};

export default ImagePickerButton;
