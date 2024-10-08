import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";

type ImagePickerTypes = {
    touchableOpacityProps?: React.ComponentProps<typeof TouchableOpacity>;
    image?: string;
    setImage: any;
};

const ImagePickerButton = ({
    touchableOpacityProps,
    image,
    setImage,
}: ImagePickerTypes) => {
    const pickImage = async () => {
        await ImagePicker.getMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };

    return (
        <TouchableOpacity onPress={pickImage} {...touchableOpacityProps}>
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={[
                        {
                            backgroundColor: Colors.input,
                            alignSelf: "center",
                            width: "100%",
                            aspectRatio: 1,
                            borderRadius: 7,
                        },
                    ]}
                />
            ) : (
                <View
                    style={[
                        {
                            backgroundColor: Colors.input,
                            alignSelf: "center",
                            width: "100%",
                            aspectRatio: 1,
                            borderRadius: 7,
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    ]}
                >
                    <Text
                        style={[textStyles.text, { color: Colors.primary90 }]}
                    >
                        Select artwork
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default ImagePickerButton;
