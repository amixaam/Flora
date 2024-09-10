import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import { BottomSheetProps } from "../../types/other";
import { Song } from "../../types/song";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import { SheetModalLayout } from "./SheetModalLayout";

const EditSong = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedSong, editSong } = useSongsStore();
        const [inputFields, setInputFields] = useState<Partial<Song>>({
            title: "",
            artist: "",
            year: "",
            artwork: undefined,
        });

        useEffect(() => {
            if (!selectedSong) return;
            setInputFields({
                title: selectedSong.title,
                artist: selectedSong.artist,
                year: selectedSong.year,
                artwork: selectedSong.artwork,
            });
        }, [selectedSong]);

        if (!selectedSong) return;

        const handleSubmitForm = () => {
            if (!inputFields.title) inputFields.title = "Unnamed Song";
            if (!inputFields.title) inputFields.artist = "No artist";
            if (!inputFields.title) inputFields.year = "No year";
            editSong(selectedSong.id, inputFields);
            props.dismiss?.();
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Edit ${selectedSong.title}`}
                snapPoints={[SnapPoints.lg]}
            >
                <BottomSheetView
                    style={{
                        rowGap: Spacing.sm,
                        flex: 1,
                        marginHorizontal: Spacing.appPadding,
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
                        placeholder="title"
                        value={inputFields.title}
                        setValue={(value) =>
                            setInputFields({ ...inputFields, title: value })
                        }
                    />
                    <View
                        style={{ flexDirection: "row", columnGap: Spacing.sm }}
                    >
                        <SubmitButton
                            handleSubmitForm={handleSubmitForm}
                            text="Update"
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

export default EditSong;
