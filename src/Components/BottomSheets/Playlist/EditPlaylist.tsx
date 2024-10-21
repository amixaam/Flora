import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { useSongsStore } from "../../../store/songsStore";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import ImagePickerButton from "../../UI/Buttons/ImagePickerButton";
import TextInput from "../../UI/Inputs/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";
import MainButton from "../../UI/Buttons/MainButton";

const EditPlaylist = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedContainer, editPlaylist } = useSongsStore();

        const [image, setImage] = useState("");
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");

        useEffect(() => {
            if (!selectedContainer || !("description" in selectedContainer))
                return;

            setImage(selectedContainer.artwork as string);
            setTitle(selectedContainer.title);
            setDescription(selectedContainer.description as string);
        });

        if (!selectedContainer || !("description" in selectedContainer)) return;

        const handleSubmitForm = () => {
            editPlaylist(selectedContainer.id, {
                title: title || "Unnamed playlist",
                description: description,
                artwork: image,
            });
            props.dismiss?.();
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Edit ${selectedContainer.title}`}
                snapPoints={[SnapPoints.md]}
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
                                bottomSheet={true}
                                placeholder="Playlist name..."
                                onChangeText={setTitle}
                                defaultValue={selectedContainer.title}
                            />
                            <TextInput
                                bottomSheet={true}
                                placeholder="Description..."
                                onChangeText={setDescription}
                                defaultValue={selectedContainer.description}
                            />
                        </BottomSheetView>

                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                gap: Spacing.sm,
                            }}
                        >
                            <MainButton
                                onPress={handleSubmitForm}
                                text="Save"
                            />
                            <MainButton
                                type="secondary"
                                onPress={props.dismiss}
                                text="Cancel"
                            />
                        </BottomSheetView>
                    </BottomSheetView>
                </BottomSheetView>
            </SheetModalLayout>
        );
    }
);

export default EditPlaylist;
