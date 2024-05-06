import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import { Playlist } from "../../types/song";
import { BottomSheetProps } from "../../types/other";
import { SheetModalLayout } from "./SheetModalLayout";
import { SnapPoints, Spacing } from "../../styles/constants";

const EditPlaylist = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedPlaylist, editPlaylist } = useSongsStore();
        const [inputFields, setInputFields] = useState<Partial<Playlist>>({
            title: "",
            description: undefined,
            artwork: undefined,
        });

        useEffect(() => {
            if (!selectedPlaylist) return;
            setInputFields({
                title: selectedPlaylist.title,
                description: selectedPlaylist.description,
                artwork: selectedPlaylist.artwork,
            });
        }, [selectedPlaylist]);

        if (!selectedPlaylist) return;

        const handleSubmitForm = () => {
            if (!inputFields.title) inputFields.title = "Unnamed playlist";
            editPlaylist(selectedPlaylist.id, inputFields);
            props.dismiss?.();
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Edit ${selectedPlaylist.title}`}
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
                        placeholder="title"
                        value={inputFields.title}
                        setValue={(value) =>
                            setInputFields({ ...inputFields, title: value })
                        }
                    />
                    <TextInput
                        bottomSheet={true}
                        placeholder="Description"
                        value={inputFields.description}
                        setValue={(value) =>
                            setInputFields({
                                ...inputFields,
                                description: value,
                            })
                        }
                    />

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

export default EditPlaylist;
