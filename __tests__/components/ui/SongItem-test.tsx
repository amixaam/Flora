import React from "react";
import { Text } from "react-native";

import { fireEvent, render } from "@testing-library/react-native";

import { testSongObject } from "../../../src/utils/TestData";
import SongItem from "../../../src/Components/UI/UI chunks/SongItem";
import { useSongsStore } from "../../../src/store/songsStore";

jest.mock("../../../src/store/songsStore", () => ({
    useSongsStore: jest.fn(),
}));

describe("SongItem", () => {
    const song = testSongObject;

    beforeEach(() => {
        // @ts-ignore
        (useSongsStore as jest.Mock).mockReturnValue({
            activeSong: song,
        });
    });

    it("renders correctly with minimal props", () => {
        const { toJSON } = render(<SongItem song={song} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with optional props", () => {
        const controls = <Text>Custom Controls</Text>;
        const { getByText } = render(
            <SongItem song={song} controls={controls} />
        );

        expect(getByText(song.title)).toBeTruthy();
        expect(getByText("Custom Controls")).toBeTruthy();
    });

    it("renders correctly as active song", () => {
        const { getByTestId } = render(<SongItem song={song} />);

        expect(getByTestId("volume-high")).toBeTruthy();
        expect(getByTestId("album-art")).toBeTruthy();
    });

    it("renders correctly as inactive song", () => {
        const { getByTestId } = render(
            <SongItem
                song={{
                    ...song,
                    id: "456", // different id from activeSong
                }}
            />
        );

        expect(() => getByTestId("volume-high")).toThrow();
        expect(getByTestId("album-art")).toBeTruthy();
    });

    it("renders correctly with count", () => {
        const count = 101;
        const { getByText, getByTestId } = render(
            <SongItem
                song={{
                    ...song,
                    id: "456", // different id from activeSong
                }}
                rightSideProps={{ count: count }}
            />
        );

        expect(() => getByTestId("volume-high")).toThrow();
        expect(getByText(count.toString())).toBeTruthy();
    });

    it("press event", () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <SongItem song={song} onPress={onPress} />
        );

        const touchableRipple = getByText(song.title).parent;

        fireEvent.press(touchableRipple);
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
