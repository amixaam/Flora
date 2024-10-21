const MinimiseText = (
    string: string = "string here",
    length: number = 16,
    removeFileExt: boolean = false
) => {
    if (removeFileExt) {
        // remove extension
        string = string.split(".")[0];
    }
    return string.length > length ? string.slice(0, length) + "..." : string;
};

export default MinimiseText;
