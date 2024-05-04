import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import SheetLayout from "./SheetLayout";
import { Playlist } from "../../types/song";

interface DismissProps {
    dismiss: () => void;
}

const EditPlaylistBottomSheet = forwardRef<BottomSheetModal, DismissProps>(
    (props, ref) => {
        const { selectedPlaylist, editPlaylist } = useSongsStore();
        const [inputFields, setInputFields] = useState<Partial<Playlist>>({
            title: "",
            description: "",
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
            editPlaylist(selectedPlaylist.id, inputFields);
            props.dismiss();
        };

        return (
            <SheetLayout
                ref={ref}
                title={"Edit " + selectedPlaylist.title}
                index={2}
            >
                <BottomSheetView
                    style={{
                        rowGap: 8,
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

                    <View style={{ flexDirection: "row", columnGap: 8 }}>
                        <SubmitButton
                            handleSubmitForm={handleSubmitForm}
                            text="Edit"
                        />
                        <CancelButton
                            handlePress={() => {
                                props.dismiss();
                            }}
                        />
                    </View>
                </BottomSheetView>
            </SheetLayout>
        );
    }
);

export default EditPlaylistBottomSheet;
