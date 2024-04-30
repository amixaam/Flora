import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Text } from "react-native";
import { colors, spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";

const SheetLayout = forwardRef(({ props, title, children }, ref) => {
    // sheet defaults
    const snapPoints = useMemo(() => ["25%", "55%"], []);
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
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: colors.primary }}
            backgroundStyle={{ backgroundColor: colors.secondary }}
        >
            <BottomSheetView style={{ marginHorizontal: spacing.appPadding }}>
                <Text style={[[textStyles.h5], { marginBottom: spacing.sm }]}>
                    {title ? title : "Bottom sheet"}
                </Text>
                <BottomSheetView style={{ height: "100%" }}>
                    {children}
                </BottomSheetView>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default SheetLayout;
