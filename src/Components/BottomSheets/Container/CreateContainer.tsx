import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useState } from "react";
import { useSongsStore } from "../../../store/songsStore";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import { ContainerType } from "../../../types/song";
import ImagePickerButton from "../../UI/Buttons/ImagePickerButton";
import TextInput from "../../UI/Inputs/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";
import MainButton from "../../UI/Buttons/MainButton";

interface CreateContainerProps extends BottomSheetProps {
    type: ContainerType;
}

const CreateContainer = forwardRef<BottomSheetModal, CreateContainerProps>(
    (props, ref) => {
        const { createAlbum, createPlaylist } = useSongsStore();

        const [type, setType] = useState<ContainerType>(props.type);
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [artist, setArtist] = useState("");
        const [year, setYear] = useState("");
        const [image, setImage] = useState("");

        const handleSubmit = () => {
            if (type === ContainerType.ALBUM) {
                createAlbum({
                    title,
                    artist,
                    year,
                    artwork: image,
                });
            } else {
                createPlaylist({
                    title,
                    description,
                    artwork: image,
                });
            }

            // Reset form
            setTitle("");
            setDescription("");
            setArtist("");
            setYear("");
            setImage("");

            props.dismiss?.();
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Create ${type.toLowerCase()}`}
                snapPoints={[SnapPoints.md]}
            >
                <BottomSheetView
                    style={{
                        gap: Spacing.md,
                        flexDirection: "row",
                        marginHorizontal: Spacing.appPadding,
                    }}
                >
                    <ImagePickerButton image={image} setImage={setImage} />

                    <BottomSheetView style={{ flex: 1, gap: Spacing.md }}>
                        <BottomSheetView style={{ gap: Spacing.sm }}>
                            <TextInput
                                bottomSheet
                                placeholder={`${type} name...`}
                                onChangeText={setTitle}
                                defaultValue={title}
                            />

                            {type === ContainerType.PLAYLIST ? (
                                <TextInput
                                    bottomSheet
                                    placeholder="Description..."
                                    onChangeText={setDescription}
                                    defaultValue={description}
                                />
                            ) : (
                                <>
                                    <TextInput
                                        bottomSheet
                                        placeholder="Artist..."
                                        onChangeText={setArtist}
                                        defaultValue={artist}
                                    />
                                    <TextInput
                                        bottomSheet
                                        placeholder="Year..."
                                        inputMode="numeric"
                                        onChangeText={setYear}
                                        defaultValue={year}
                                    />
                                </>
                            )}
                        </BottomSheetView>

                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                gap: Spacing.sm,
                            }}
                        >
                            <MainButton text="Create" onPress={handleSubmit} />
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

export default CreateContainer;
