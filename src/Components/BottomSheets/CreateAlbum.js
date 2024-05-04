import React, { forwardRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import SheetLayout from "./SheetLayout";
import ImagePickerButton from "../UI/ImagePickerButton";
import TextInput from "../UI/TextInput";
import { Spacing } from "../../styles/constants";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import SubmitButton from "../UI/SubmitButton";
import CancelButton from "../UI/CancelButton";

const CreateAlbum = forwardRef(({ props }, ref) => {
    const { createAlbum } = useSongsStore();

    const blankInputs = {
        title: "",
        artist: "",
        year: "",
        artwork: null,
    };

    const [formInputs, setFormInputs] = useState(blankInputs);

    const handleSubmit = () => {
        createAlbum(formInputs);
        ref.current.dismiss();

        setFormInputs(blankInputs);
    };

    const handleCancel = () => {
        ref.current.dismiss();

        setFormInputs(blankInputs);
    };

    return (
        <SheetLayout ref={ref} title={"Create album"} index={2}>
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
                    <SubmitButton
                        handleSubmitForm={handleSubmit}
                        text="Create"
                    />
                    <CancelButton handlePress={handleCancel} />
                </BottomSheetView>
            </BottomSheetView>
        </SheetLayout>
    );
});

export default CreateAlbum;
