import { render, fireEvent } from "@testing-library/react-native";
import CancelButton from "../../src/Components/UI/Buttons/CancelButton";

describe("CancelButton", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<CancelButton />);

        expect(toJSON()).toMatchSnapshot();
    });

    it("matches text with prop text", () => {
        const text = "Cancel";
        const { getByText } = render(<CancelButton text={text} />);

        expect(getByText(text)).toBeTruthy();
    });

    it("matches text with no prop text", () => {
        const { getByText } = render(<CancelButton />);

        expect(getByText("Cancel")).toBeTruthy();
    });

    it("fires onPress", () => {
        const handlePress = jest.fn();
        const { getByText } = render(
            <CancelButton handlePress={handlePress} />
        );

        fireEvent.press(getByText("Cancel"));    

        expect(handlePress).toHaveBeenCalledTimes(1);
    });
});
