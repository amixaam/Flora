import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { useSongsStore } from "../../../store/songsStore";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import ImagePickerButton from "../../UI/Buttons/ImagePickerButton";
import TextInput from "../../UI/Inputs/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";
import MainButton from "../../UI/Buttons/MainButton";

const CreateAlbum = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { createAlbum } = useSongsStore();
        const [title, setTitle] = useState("");
        const [artist, setArtist] = useState("");
        const [year, setYear] = useState("");
        const [image, setImage] = useState("");

        const handleSubmit = () => {
            props.dismiss?.();
            createAlbum({
                title: title,
                artist: artist,
                year: year,
                artwork: image,
            });

            setTitle("");
            setArtist("");
            setYear("");
            setImage("");
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={"Create album"}
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
                                placeholder="Album name..."
                                onChangeText={setTitle}
                                defaultValue={title}
                            />
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
                        </BottomSheetView>

                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                gap: Spacing.sm,
                            }}
                        >
                            <MainButton onPress={handleSubmit} text="Create" />
                            <MainButton
                                onPress={props.dismiss}
                                text="Cancel"
                                type="secondary"
                            />
                        </BottomSheetView>
                    </BottomSheetView>
                </BottomSheetView>
            </SheetModalLayout>
        );
    }
);

export default CreateAlbum;
