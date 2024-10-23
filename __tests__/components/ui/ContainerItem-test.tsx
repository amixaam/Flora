import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

import ContainerItem from "../../../src/Components/UI/UI chunks/ContainerItem";
import { useSongsStore } from "../../../src/store/songsStore";
import { testAlbumObject } from "../../../src/utils/TestData";

jest.mock("../../../src/store/songsStore", () => ({
    useSongsStore: jest.fn(),
}));

describe("ContainerItem", () => {
    const album = testAlbumObject;

    beforeEach(() => {
        // @ts-ignore
        (useSongsStore as jest.Mock).mockReturnValue({});
    });

    it("renders correctly with minimal props", () => {
        const { toJSON } = render(<ContainerItem item={album} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("press event", () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <ContainerItem item={album} onPress={onPress} />
        );

        const touchableRipple = getByText(album.title).parent;

        fireEvent.press(touchableRipple);
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
