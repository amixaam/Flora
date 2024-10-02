import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import { Playlist } from "../../../types/song";
import { SheetModalLayout } from "../SheetModalLayout";
import ImagePickerButton from "../../UI/Buttons/ImagePickerButton";
import TextInput from "../../UI/Inputs/TextInput";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import CancelButton from "../../UI/Buttons/CancelButton";

const CreatePlaylist = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { createPlaylist } = useSongsStore();
        const [inputFields, setInputFields] = useState<Partial<Playlist>>({
            title: "",
            description: undefined,
            artwork: undefined,
        });

        const handleSubmit = () => {
            props.dismiss?.();
            createPlaylist(inputFields);
            setInputFields({
                title: "",
                description: undefined,
                artwork: undefined,
            });
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
                                placeholder="Playlist name..."
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
                                placeholder="Description..."
                                value={inputFields.description}
                                setValue={(value) =>
                                    setInputFields({
                                        ...inputFields,
                                        description: value,
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

export default CreatePlaylist;
