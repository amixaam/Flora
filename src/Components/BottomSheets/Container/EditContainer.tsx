import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { useSongsStore } from "../../../store/songsStore";
import { Spacing } from "../../../styles/constants";
import { Album, ContainerType, Playlist } from "../../../types/song";
import { BottomSheetProps } from "../../../types/other";
import ImagePickerButton from "../../UI/Buttons/ImagePickerButton";
import TextInput from "../../UI/Inputs/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";
import MainButton from "../../UI/Buttons/MainButton";

const EditContainer = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedContainer, editAlbum, editPlaylist } = useSongsStore();
        const [formState, setFormState] = useState({
            title: "",
            artist: "",
            year: "",
            description: "",
            image: "",
        });

        useEffect(() => {
            if (!selectedContainer) return;

            const isAlbum = selectedContainer.type === ContainerType.ALBUM;
            const container = selectedContainer as Album | Playlist;

            setFormState({
                title: container.title || "",
                artist: isAlbum ? (container as Album).artist || "" : "",
                year: isAlbum ? (container as Album).year || "" : "",
                description: !isAlbum
                    ? (container as Playlist).description || ""
                    : "",
                image: (container.artwork as string) || "",
            });
        }, [selectedContainer]);

        if (!selectedContainer) return null;

        const isAlbum = selectedContainer.type === ContainerType.ALBUM;

        const handleSubmitForm = () => {
            const updateFields = {
                title: formState.title || selectedContainer.title,
                artwork: formState.image || selectedContainer.artwork,
                ...(isAlbum && {
                    artist:
                        formState.artist || (selectedContainer as Album).artist,
                    year: formState.year || (selectedContainer as Album).year,
                }),
                ...(!isAlbum && {
                    description:
                        formState.description ||
                        (selectedContainer as Playlist).description,
                }),
            };

            if (isAlbum) {
                editAlbum(selectedContainer.id, updateFields);
            } else {
                editPlaylist(selectedContainer.id, updateFields);
            }

            props.dismiss?.();
        };

        return (
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
                        image={formState.image}
                        setImage={(newImage: any) =>
                            setFormState((prev) => ({
                                ...prev,
                                image: newImage as string,
                            }))
                        }
                    />

                    <BottomSheetView style={{ flex: 1, gap: Spacing.md }}>
                        <BottomSheetView style={{ gap: Spacing.sm }}>
                            <TextInput
                                bottomSheet
                                placeholder="Title..."
                                defaultValue={selectedContainer.title}
                                onChangeText={(text) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        title: text,
                                    }))
                                }
                            />

                            {isAlbum ? (
                                <>
                                    <TextInput
                                        bottomSheet
                                        placeholder="Artist..."
                                        defaultValue={
                                            (selectedContainer as Album).artist
                                        }
                                        onChangeText={(text) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                artist: text,
                                            }))
                                        }
                                    />
                                    <TextInput
                                        bottomSheet
                                        placeholder="Year..."
                                        inputMode="numeric"
                                        defaultValue={
                                            (selectedContainer as Album).year
                                        }
                                        onChangeText={(text) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                year: text,
                                            }))
                                        }
                                    />
                                </>
                            ) : (
                                <TextInput
                                    bottomSheet
                                    placeholder="Description..."
                                    defaultValue={
                                        (selectedContainer as Playlist)
                                            .description
                                    }
                                    onChangeText={(text) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            description: text,
                                        }))
                                    }
                                />
                            )}
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
        );
    }
);

export default EditContainer;
