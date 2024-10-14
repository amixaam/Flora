import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import ImagePickerButton from "../../UI/Buttons/ImagePickerButton";
import TextInput from "../../UI/Inputs/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";
import MainButton from "../../UI/Buttons/MainButton";

const CreatePlaylist = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { createPlaylist } = useSongsStore();

        const [image, setImage] = useState("");
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");

        const handleSubmit = () => {
            createPlaylist({
                title: title,
                description: description,
                artwork: image,
            });

            setTitle("");
            setDescription("");
            setImage("");

            props.dismiss?.();
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={"Create playlist"}
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
                        setImage={(artwork: string) => setImage(artwork)}
                    />

                    <BottomSheetView style={{ flex: 1, gap: Spacing.md }}>
                        <BottomSheetView style={{ gap: Spacing.sm }}>
                            <TextInput
                                bottomSheet
                                onChangeText={setTitle}
                                placeholder="Title..."
                            />
                            <TextInput
                                bottomSheet
                                onChangeText={setDescription}
                                placeholder="Description..."
                            />
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

export default CreatePlaylist;
