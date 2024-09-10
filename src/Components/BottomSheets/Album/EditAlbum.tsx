import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import { Album } from "../../../types/song";
import CancelButton from "../../UI/CancelButton";
import ImagePickerButton from "../../UI/ImagePickerButton";
import SubmitButton from "../../UI/SubmitButton";
import TextInput from "../../UI/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";

const EditAlbum = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedContainer, editAlbum, copyAlbumTagsToSongs } =
            useSongsStore();
        const [inputFields, setInputFields] = useState<Partial<Album>>({
            title: "",
            artist: "",
            year: "",
            artwork: undefined,
        });

        useEffect(() => {
            if (!selectedContainer || !("artist" in selectedContainer)) return;
            setInputFields({
                title: selectedContainer.title,
                artist: selectedContainer.artist,
                year: selectedContainer.year,
                artwork: selectedContainer.artwork,
            });
        }, [selectedContainer]);

        if (!selectedContainer || !("artist" in selectedContainer)) return;

        const handleSubmitForm = () => {
            if (!inputFields.title) inputFields.title = "Unnamed album";
            if (!inputFields.artist) inputFields.artist = "No artist";
            if (!inputFields.year) inputFields.year = "No year";

            editAlbum(selectedContainer.id, inputFields);
            copyAlbumTagsToSongs(selectedContainer.id);
            props.dismiss?.();
        };

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={`Edit ${selectedContainer.title}`}
                    snapPoints={[SnapPoints.lg]}
                >
                    <BottomSheetView
                        style={{
                            gap: Spacing.md,
                            flexDirection: "row",
                            marginHorizontal: Spacing.appPadding,
                        }}
                    >
                        <ImagePickerButton
                            image={inputFields.artwork}
                            setImage={(artwork: string) =>
                                setInputFields({
                                    ...inputFields,
                                    artwork: artwork,
                                })
                            }
                            touchableOpacityProps={{
                                style: {
                                    flex: 1,
                                    width: 128,
                                },
                            }}
                        />

                        <BottomSheetView style={{ flex: 1, gap: Spacing.md }}>
                            <BottomSheetView style={{ gap: Spacing.sm }}>
                                <TextInput
                                    bottomSheet={true}
                                    placeholder="Album name..."
                                    value={inputFields.title}
                                    setValue={(value) =>
                                        setInputFields({
                                            ...inputFields,
                                            title: value,
                                        })
                                    }
                                />
                                <TextInput
                                    bottomSheet={true}
                                    placeholder="Artist..."
                                    value={inputFields.artist}
                                    setValue={(value) =>
                                        setInputFields({
                                            ...inputFields,
                                            artist: value,
                                        })
                                    }
                                />
                                <TextInput
                                    bottomSheet={true}
                                    placeholder="Year..."
                                    value={inputFields.year}
                                    setValue={(value) =>
                                        setInputFields({
                                            ...inputFields,
                                            year: value,
                                        })
                                    }
                                />
                            </BottomSheetView>

                            <BottomSheetView
                                style={{
                                    flexDirection: "row",
                                    gap: Spacing.sm,
                                }}
                            >
                                <SubmitButton
                                    handleSubmitForm={handleSubmitForm}
                                    text="Save"
                                />
                                <CancelButton
                                    handlePress={() => {
                                        props.dismiss?.();
                                    }}
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
