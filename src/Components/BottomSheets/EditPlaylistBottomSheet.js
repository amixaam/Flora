import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import SheetLayout from "./SheetLayout";

const EditPlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const { selectedPlaylist, editPlaylist } = useSongsStore();
    const [image, setImage] = useState(selectedPlaylist?.artwork);
    const [name, setName] = useState(selectedPlaylist?.name);
    const [description, setDescription] = useState(
        selectedPlaylist?.description
    );

    useEffect(() => {
        if (selectedPlaylist === null) return;
        setImage(selectedPlaylist.artwork);
        setName(selectedPlaylist.name);
        setDescription(selectedPlaylist.description);
    }, [selectedPlaylist]);

    const handleSubmitForm = () => {
        if (selectedPlaylist.id == 1) return;

        editPlaylist(selectedPlaylist.id, name, description, image);
        ref.current.dismiss();
    };

    if (!selectedPlaylist) return;
    return (
        <SheetLayout
            ref={ref}
            title={"Edit " + selectedPlaylist.name}
            index={2}
        >
            <BottomSheetView
                style={{
                    rowGap: 8,
                    flex: 1,
                }}
            >
                <ImagePickerButton image={image} setImage={setImage} />
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

export default EditPlaylistBottomSheet;
