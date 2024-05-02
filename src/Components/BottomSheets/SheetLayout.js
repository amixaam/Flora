import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Text } from "react-native";
import { colors, spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";

const SheetLayout = forwardRef(
    ({ props, title, index = 1, style, children }, ref) => {
        // sheet defaults
        const snapPoints = useMemo(() => ["25%", "55%", "70%", "90%"], []);
        const renderBackdrop = useCallback((props) => (
            <BottomSheetBackdrop
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                {...props}
            />
        ));

        return (
            <BottomSheetModal
                ref={ref}
                index={index}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={{ backgroundColor: colors.primary }}
                backgroundStyle={{ backgroundColor: colors.secondary }}
            >
                <BottomSheetView style={[{ height: "100%" }, style]}>
                    <Text
                        style={[
                            [textStyles.h5],
                            {
                                marginBottom: spacing.md,
                                marginHorizontal: spacing.appPadding,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {title ? title : "Bottom sheet"}
                    </Text>
                    {children}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

export default SheetLayout;
