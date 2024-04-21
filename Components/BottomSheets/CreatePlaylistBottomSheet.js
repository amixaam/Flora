import {
    Button,
    Image,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import { forwardRef, useState } from "react";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import SheetLayout from "./SheetLayout";
import { mainStyles } from "../styles";
import * as ImagePicker from "expo-image-picker";
import TextInput from "../UI/TextInput";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";

const CreatePlaylistBottomSheet = forwardRef(({ props }, ref) => {
    // TODO: add a confirmation modal for deleting things
    const { createPlaylist } = useSongsStore();
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");

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

    const handleSubmit = () => {
        createPlaylist(name, description, image);
        ref.current.dismiss();
        setDescription("");
        setName("");
        setImage(null);
    };

    return (
        <SheetLayout ref={ref} title={"Create playlist"}>
            <BottomSheetView
                style={{
                    rowGap: 8,
                    flex: 1,
                }}
            >
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
                <BottomSheetView style={{ rowGap: 8, flex: 1 }}>
                    <TextInput
                        bottomSheet={true}
                        placeholder="Name"
                        value={name}
                        setValue={setName}
                    />
                    <TextInput
                        bottomSheet={true}
                        placeholder="Description"
                        value={description}
                        setValue={setDescription}
                    />
                    <View style={{ flexDirection: "row", columnGap: 8 }}>
                        <SubmitButton
                            handleSubmitForm={handleSubmit}
                            text="Create"
                        />
                        <CancelButton
                            handlePress={() => {
                                ref.current.dismiss();
                            }}
                        />
                    </View>
                </BottomSheetView>
            </BottomSheetView>
        </SheetLayout>
    );
});

const styles = StyleSheet.create({
    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "lightgray",
        width: "100%",
        paddingBottom: 4,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    textInput: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: "lightgray",
        borderBottomWidth: 1,
    },
});

export default CreatePlaylistBottomSheet;
