import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Text } from "react-native";
import { Colors, SnapPoints, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";

interface Props {
    title?: string;
    snapPoints?: string[];
    children: React.ReactNode;
}
export const SheetModalLayout = forwardRef<BottomSheetModal, Props>(
    (props, ref) => {
        const snapPoints = useMemo(
            () =>
                props.snapPoints
                    ? props.snapPoints
                    : [SnapPoints.md, SnapPoints.lg],
            [props.snapPoints]
        );
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
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                index={0}
                handleIndicatorStyle={{ backgroundColor: Colors.primary }}
                backgroundStyle={{ backgroundColor: Colors.secondary }}
            >
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
                    {props.title ? props.title : "Default sheet title"}
                </Text>
                <BottomSheetView style={[{ flex: 1 }]}>
                    {props.children}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);
