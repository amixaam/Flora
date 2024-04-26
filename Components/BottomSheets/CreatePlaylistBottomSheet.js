import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import SheetLayout from "./SheetLayout";

const CreatePlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const { createPlaylist } = useSongsStore();
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");

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
                <ImagePickerButton image={image} setImage={setImage} />
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

export default CreatePlaylistBottomSheet;
