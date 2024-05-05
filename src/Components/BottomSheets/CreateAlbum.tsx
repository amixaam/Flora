import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { View } from "react-native";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import { BottomSheetProps } from "../../types/other";
import { Album } from "../../types/song";
import CancelButton from "../UI/CancelButton";
import ImagePickerButton from "../UI/ImagePickerButton";
import SubmitButton from "../UI/SubmitButton";
import TextInput from "../UI/TextInput";
import { SheetModalLayout } from "./SheetModalLayout";

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
                snapPoints={["65%"]}
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
                            setInputFields({ ...inputFields, artwork })
                        }
                    />
                    <BottomSheetView style={{ rowGap: Spacing.sm, flex: 1 }}>
                        <TextInput
                            bottomSheet={true}
                            placeholder="Name"
                            value={inputFields.title}
                            setValue={(value) =>
                                setInputFields({ ...inputFields, title: value })
                            }
                        />
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                columnGap: Spacing.sm,
                            }}
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
                                    setInputFields({
                                        ...inputFields,
                                        year: value,
                                    })
                                }
                            />
                        </BottomSheetView>
                        <View
                            style={{
                                flexDirection: "row",
                                columnGap: Spacing.sm,
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
                        </View>
                    </BottomSheetView>
                </BottomSheetView>
            </SheetModalLayout>
        );
    }
);

export default CreateAlbum;
