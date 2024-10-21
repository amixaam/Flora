import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { useSongsStore } from "../../../store/songsStore";
import { Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import ImagePickerButton from "../../UI/Buttons/ImagePickerButton";
import TextInput from "../../UI/Inputs/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";
import MainButton from "../../UI/Buttons/MainButton";

const EditAlbum = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedContainer, editAlbum } = useSongsStore();
        const [title, setTitle] = useState("");
        const [artist, setArtist] = useState("");
        const [year, setYear] = useState("");
        const [image, setImage] = useState("");

        useEffect(() => {
            if (!selectedContainer || "description" in selectedContainer)
                return;

            setTitle(selectedContainer.title);
            setArtist(selectedContainer.artist);
            setYear(selectedContainer.year);
            setImage(selectedContainer.artwork as string);
        });

        if (!selectedContainer || !("artist" in selectedContainer)) return;

        const handleSubmitForm = () => {
            editAlbum(selectedContainer.id, {
                title: title || "Unnamed album",
                artist: artist || "No artist",
                year: year || "No year",
                artwork: image || undefined,
            });

            props.dismiss?.();
        };

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={`Edit ${selectedContainer.title}`}
                >
                    <BottomSheetView
                        style={{
                            gap: Spacing.md,
                            flexDirection: "row",
                            marginHorizontal: Spacing.appPadding,
                        }}
                    >
                        <ImagePickerButton
                            image={image}
                            defaultImage={selectedContainer.artwork}
                            setImage={setImage}
                        />

                        <BottomSheetView style={{ flex: 1, gap: Spacing.md }}>
                            <BottomSheetView style={{ gap: Spacing.sm }}>
                                <TextInput
                                    bottomSheet
                                    placeholder="Album name..."
                                    defaultValue={selectedContainer.title}
                                    onChangeText={setTitle}
                                />
                                <TextInput
                                    bottomSheet
                                    placeholder="Artist..."
                                    defaultValue={selectedContainer.artist}
                                    onChangeText={setArtist}
                                />
                                <TextInput
                                    bottomSheet
                                    placeholder="Year..."
                                    inputMode="numeric"
                                    defaultValue={selectedContainer.year}
                                    onChangeText={setYear}
                                />
                            </BottomSheetView>

                            <BottomSheetView
                                style={{
                                    flexDirection: "row",
                                    gap: Spacing.sm,
                                }}
                            >
                                <MainButton
                                    text="Save"
                                    onPress={handleSubmitForm}
                                />
                                <MainButton
                                    text="Cancel"
                                    type="secondary"
                                    onPress={() => props.dismiss?.()}
                                />
                            </BottomSheetView>
                        </BottomSheetView>
                    </BottomSheetView>
                </SheetModalLayout>
            </>
        );
    }
);

export default EditAlbum;
