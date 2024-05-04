import React, { forwardRef, useEffect, useState } from "react";
import { useSongsStore } from "../../store/songs";
import SheetLayout from "./SheetLayout";
import TextInput from "../UI/TextInput";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";
import { Spacing } from "../../styles/constants";
import ImagePickerButton from "../UI/ImagePickerButton";

const EditAlbum = forwardRef(({ props }, ref) => {
    const { selectedAlbum, editAlbum } = useSongsStore();

    const blankInputs = {
        title: selectedAlbum.title,
        artist: selectedAlbum.artist,
        year: selectedAlbum.year,
        artwork: selectedAlbum.artwork,
    };

    const [formInputs, setFormInputs] = useState(blankInputs);

    const handleSubmit = () => {
        editAlbum(selectedAlbum.id, formInputs);
        ref.current.dismiss();

        setFormInputs(blankInputs);
    };

    const handleCancel = () => {
        ref.current.dismiss();

        setFormInputs(blankInputs);
    };

    useEffect(() => {
        setFormInputs(blankInputs);
    }, [selectedAlbum]);

    return (
        <SheetLayout ref={ref} title={"Edit " + selectedAlbum.title} index={2}>
            <BottomSheetView
                style={{
                    rowGap: Spacing.sm,
                    flex: 1,
                    marginHorizontal: Spacing.appPadding,
                }}
            >
                <ImagePickerButton
                    image={formInputs.artwork}
                    setImage={(artwork) =>
                        setFormInputs({ ...formInputs, artwork })
                    }
                />
                <TextInput
                    bottomSheet={true}
                    placeholder="Title"
                    value={formInputs.title}
                    setValue={(text) =>
                        setFormInputs({ ...formInputs, title: text })
                    }
                />
                <BottomSheetView
                    style={{
                        columnGap: Spacing.sm,
                        flexDirection: "row",
                    }}
                >
                    <TextInput
                        bottomSheet={true}
                        placeholder="Artist"
                        value={formInputs.artist}
                        setValue={(text) =>
                            setFormInputs({ ...formInputs, artist: text })
                        }
                    />
                    <TextInput
                        bottomSheet={true}
                        placeholder="Year"
                        value={formInputs.year}
                        setValue={(text) =>
                            setFormInputs({ ...formInputs, year: text })
                        }
                    />
                </BottomSheetView>
                <BottomSheetView
                    style={{
                        columnGap: Spacing.sm,
                        flexDirection: "row",
                    }}
                >
                    <SubmitButton handleSubmitForm={handleSubmit} text="Edit" />
                    <CancelButton handlePress={handleCancel} />
                </BottomSheetView>
            </BottomSheetView>
        </SheetLayout>
    );
});

export default EditAlbum;
