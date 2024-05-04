import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../../styles/constants";
import { textStyles } from "../../styles/text";

const ImagePickerButton = ({
    image,
    setImage,
}: {
    image?: string;
    setImage: any;
}) => {
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
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={[
                        {
                            backgroundColor: Colors.input,
                            alignSelf: "center",
                            width: "50%",
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
                            width: "50%",
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