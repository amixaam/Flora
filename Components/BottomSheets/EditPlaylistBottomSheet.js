import {
    Image,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
} from "react-native";
import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
    TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import * as ImagePicker from "expo-image-picker";
import SheetLayout from "./SheetLayout";
import { mainStyles, textStyles } from "../styles";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";
import TextInput from "../UI/TextInput";

const EditPlaylistBottomSheet = forwardRef(({ props }, ref) => {
    // TODO: add a confirmation modal for deleting things
    const { selectedPlaylist, editPlaylist } = useSongsStore();
    const [image, setImage] = useState(selectedPlaylist.image);
    const [name, setName] = useState(selectedPlaylist.name);
    const [description, setDescription] = useState(
        selectedPlaylist.description
    );

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

    useEffect(() => {
        if (selectedPlaylist === null) return;
        setImage(selectedPlaylist.image);
        setName(selectedPlaylist.name);
        setDescription(selectedPlaylist.description);
    }, [selectedPlaylist]);

    const handleSubmitForm = () => {
        if (selectedPlaylist.id == 1) return;

        editPlaylist(selectedPlaylist.id, name, description, image);
        ref.current.dismiss();
    };

    if (selectedPlaylist === null) return;
    return (
        <SheetLayout ref={ref} title={"Edit " + selectedPlaylist.name}>
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
                        handleSubmitForm={handleSubmitForm}
                        text="Edit"
                    />
                    <CancelButton
                        handlePress={() => {
                            ref.current.dismiss();
                        }}
                    />
                </View>
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
    button: {
        width: "fit-content",
        marginHorizontal: "auto",
        paddingVertical: 8,
        backgroundColor: "lightgray",
    },
});

export default EditPlaylistBottomSheet;
