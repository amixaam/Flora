import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import { BottomSheetProps } from "../../types/other";
import { Album } from "../../types/song";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import { SheetModalLayout } from "./SheetModalLayout";

const EditAlbum = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedAlbum, editAlbum } = useSongsStore();
        const [inputFields, setInputFields] = useState<Partial<Album>>({
            title: "",
            artist: "",
            year: "",
            artwork: undefined,
        });

        useEffect(() => {
            if (!selectedAlbum) return;
            setInputFields({
                title: selectedAlbum.title,
                artist: selectedAlbum.artist,
                year: selectedAlbum.year,
                artwork: selectedAlbum.artwork,
            });
        }, [selectedAlbum]);

        if (!selectedAlbum) return;

        const handleSubmitForm = () => {
            if (!inputFields.title) inputFields.title = "Unnamed album";
            if (!inputFields.artist) inputFields.artist = "No artist";
            if (!inputFields.year) inputFields.year = "No year";

            editAlbum(selectedAlbum.id, inputFields);
            props.dismiss?.();
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Edit ${selectedAlbum.title}`}
                snapPoints={[SnapPoints.lg]}
            >
                <BottomSheetView
                    style={{
                        rowGap: Spacing.sm,
                        flex: 1,
                    }}
                >
                    <ImagePickerButton
                        image={inputFields.artwork}
                        setImage={(artwork: string) =>
                            setInputFields({ ...inputFields, artwork: artwork })
                        }
                    />
                    <TextInput
                        bottomSheet={true}
                        placeholder="Title"
                        value={inputFields.title}
                        setValue={(value) =>
                            setInputFields({ ...inputFields, title: value })
                        }
                    />
                    <BottomSheetView
                        style={{ columnGap: Spacing.sm, flexDirection: "row" }}
                    >
                        <TextInput
                            bottomSheet={true}
                            placeholder="Artist"
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
                            placeholder="Year"
                            value={inputFields.year?.toString()}
                            setValue={(value) =>
                                setInputFields({ ...inputFields, year: value })
                            }
                        />
                    </BottomSheetView>

                    <View
                        style={{ flexDirection: "row", columnGap: Spacing.sm }}
                    >
                        <SubmitButton
                            handleSubmitForm={handleSubmitForm}
                            text="Edit"
                        />
                        <CancelButton
                            handlePress={() => {
                                props.dismiss?.();
                            }}
                        />
                    </View>
                </BottomSheetView>
            </SheetModalLayout>
        );
    }
);

export default EditAlbum;
