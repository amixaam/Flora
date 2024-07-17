// Music container, as in, playlist & album sheet

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { BottomSheetProps } from "../../types/other";
import { SheetModalLayout } from "./SheetModalLayout";
import { Text } from "react-native";

const MusicContainer = forwardRef<BottomSheetModal, BottomSheetProps>(
  (props, ref) => {
    return (
      <SheetModalLayout ref={ref} title="HI!!!! title">
        <BottomSheetView>
          <Text>HI!</Text>
        </BottomSheetView>
      </SheetModalLayout>
    );
  },
);

export default MusicContainer;
