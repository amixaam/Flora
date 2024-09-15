import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import { Album } from "../../../types/song";
import CancelButton from "../../UI/CancelButton";
import ImagePickerButton from "../../UI/ImagePickerButton";
import SubmitButton from "../../UI/SubmitButton";
import TextInput from "../../UI/TextInput";
import { SheetModalLayout } from "../SheetModalLayout";

const CreateAlbum = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { createAlbum } = useSongsStore();
        const [inputFields, setInputFields] = useState<Partial<Album>>({
            title: "",
            artist: "",
            year: "",
            artwork: undefined,
        });

        const handleSubmit = () => {
            props.dismiss?.();
            createAlbum(inputFields);
            setInputFields({
                title: "",
                artist: "",
                year: "",
                artwork: undefined,
            });
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
                    <ImagePickerButton
                        image={inputFields.artwork}
                        setImage={(artwork: string) =>
                            setInputFields({ ...inputFields, artwork })
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
                                value={inputFields.year?.toString()}
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
                                handleSubmitForm={handleSubmit}
                                text="Create"
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
        );
    }
);

export default CreateAlbum;
