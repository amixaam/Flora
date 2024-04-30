import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import SheetLayout from "./SheetLayout";
import DatePickerInput from "../UI/DatePickerInput";

const EditPlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const { selectedPlaylist, editPlaylist } = useSongsStore();
    const [image, setImage] = useState(selectedPlaylist?.image);
    const [name, setName] = useState(selectedPlaylist?.name);
    const [description, setDescription] = useState(
        selectedPlaylist?.description
    );
    const [date, setDate] = useState(selectedPlaylist?.date);
    const [artist, setArtist] = useState(selectedPlaylist?.artist);

    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (selectedPlaylist === null) return;
        setImage(selectedPlaylist.image);
        setName(selectedPlaylist.name);
        setDescription(selectedPlaylist.description);
        setArtist(selectedPlaylist.artist);
        setDate(new Date(selectedPlaylist.date));
    }, [selectedPlaylist]);

    const handleSubmitForm = () => {
        if (selectedPlaylist.id == 1) return;

        editPlaylist(
            selectedPlaylist.id,
            name,
            description,
            image,
            artist,
            date
        );
        ref.current.dismiss();
    };

    if (!selectedPlaylist) return;
    return (
        <SheetLayout ref={ref} name={"Edit " + selectedPlaylist.name}>
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
                    <TextInput
                        bottomSheet={true}
                        placeholder="Artist"
                        value={artist}
                        setValue={setArtist}
                    />
                    <CancelButton
                        handlePress={() => {
                            setDate(new Date());
                            setShowPicker(!showPicker);
                        }}
                        text={
                            date instanceof Date
                                ? date.getFullYear()
                                : "No date"
                        }
                    />
                    <DatePickerInput
                        value={date}
                        setValue={setDate}
                        visibility={showPicker}
                        dismiss={() => setShowPicker(false)}
                    />
                </View>
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
