import * as ImagePicker from "expo-image-picker";
import React from "react";
import { PressableProps, StyleProp } from "react-native";
import { TouchableRipple } from "react-native-paper";
import AlbumArt from "../UI chunks/AlbumArt";

interface ImagePickerTypes {
    image?: string;
    defaultImage?: string;
    setImage: any;
    size?: number;
    style?: StyleProp<PressableProps>;
}

const ImagePickerButton = ({
    image,
    defaultImage,
    setImage,
    size = 128,
    style,
}: ImagePickerTypes) => {
    const pickImage = async () => {
        const responde = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (!responde.granted) {
            const response =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!response.granted) return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };

    return (
        <TouchableRipple
            onPress={pickImage}
            style={[
                {
                    aspectRatio: 1,
                    height: size,
                    position: "relative",
                },
                style,
            ]}
        >
            <AlbumArt
                image={defaultImage || image}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        </TouchableRipple>
    );
};

export default ImagePickerButton;
