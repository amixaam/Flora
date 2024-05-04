import { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import BottomSheetModal from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleProp, Text, ViewStyle } from "react-native";
import { Colors, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";

interface Props {
    title?: string;
    index?: number;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}

const SheetLayout = forwardRef<BottomSheetModal, Props>((props, ref) => {
    // sheet defaults
    const snapPoints = useMemo(() => ["25%", "55%", "70%", "90%"], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
            />
        ),
        [ref]
    );

    return (
        <BottomSheetModal
            ref={ref}
            index={props.index}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: Colors.primary }}
            backgroundStyle={{ backgroundColor: Colors.secondary }}
        >
            <BottomSheetView style={[{ height: "100%" }, props.style]}>
                <Text
                    style={[
                        [textStyles.h5],
                        {
                            marginBottom: Spacing.md,
                            marginHorizontal: Spacing.appPadding,
                        },
                    ]}
                    numberOfLines={1}
                >
                    {props?.title}
                </Text>
                {props.children}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default SheetLayout;
