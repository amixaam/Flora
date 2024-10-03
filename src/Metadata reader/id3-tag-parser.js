import { Buffer } from "buffer";

export const parseID3Tags = (buffer) => {
    const tags = {};

    // Check if buffer starts with "ID3"
    if (buffer.toString("ascii", 0, 3) !== "ID3") {
        throw new Error("Not a valid ID3 tag");
    }

    // Read ID3 version
    const version = buffer.readUInt8(3);
    const revision = buffer.readUInt8(4);

    // console.log("ID3 version: " + version + "." + revision);

    // Read flags
    const flags = buffer.readUInt8(5);

    // Read size
    const size =
        (buffer[6] & 0x7f) * 0x200000 +
        (buffer[7] & 0x7f) * 0x4000 +
        (buffer[8] & 0x7f) * 0x80 +
        (buffer[9] & 0x7f);

    let offset = 10; // Start of the first frame

    while (offset < size) {
        // Read frame ID
        const frameID = buffer.toString("ascii", offset, offset + 4);
        if (frameID === "\0\0\0\0") break; // End of frames

        // Read frame size
        const frameSize = buffer.readUInt32BE(offset + 4);

        // Read frame flags
        const frameFlags = buffer.readUInt16BE(offset + 8);

        // Read frame data
        const frameDataOffset = offset + 10;
        const frameData = buffer.slice(
            frameDataOffset,
            frameDataOffset + frameSize
        );

        // Parse frame data based on frame ID
        switch (frameID) {
            case "TIT2": // Title
            case "TPE1": // Artist
            case "TALB": // Album
            case "TDA": // Date
            case "TYER": // Year
            case "TRCK": // Track number
                // case "APIC": // picture
                // Text information frames
                const encoding = frameData[0];
                let value;
                if (encoding === 0) {
                    // ISO-8859-1
                    value = frameData.toString("ascii", 1);
                } else if (encoding === 1) {
                    // UTF-16 with BOM
                    value = frameData.toString("utf16le", 3);
                } else if (encoding === 3) {
                    // UTF-8
                    value = frameData.toString("utf8", 1);
                }
                tags[frameID] = value.replace(/\0/g, ""); // Remove null terminators
                break;
            default:
                // Unknown frame
                // console.log(`Unknown frame ID: ${frameID}`);
                break;
        }

        offset += 10 + frameSize;
    }

    return tags;
};

export const parseOpusMetadata = (buffer) => {
    const tags = {};

    // Check if buffer starts with "OggS" and contains "Opus"
    if (
        buffer.toString("ascii", 0, 4) !== "OggS" ||
        buffer.toString("ascii", 28, 32) !== "Opus"
    ) {
        throw new Error("Not a valid Opus file");
    }

    // Find the start of the 'OpusTags' packet
    let offset = 0;
    while (offset < buffer.length) {
        if (buffer.toString("ascii", offset, offset + 8) === "OpusTags") {
            break;
        }
        offset++;
    }

    if (offset >= buffer.length) {
        throw new Error("OpusTags packet not found");
    }

    offset += 8; // Skip "OpusTags"

    // Read vendor string length
    const vendorLength = buffer.readUInt32LE(offset);
    offset += 4 + vendorLength; // Skip vendor string

    // Read number of tags
    const tagCount = buffer.readUInt32LE(offset);
    offset += 4;

    // Read tags
    for (let i = 0; i < tagCount; i++) {
        const tagLength = buffer.readUInt32LE(offset);
        offset += 4;
        const tagString = buffer.toString("utf8", offset, offset + tagLength);
        offset += tagLength;

        const [key, value] = tagString.split("=");
        tags[key.toUpperCase()] = value;
    }

    return tags;
};

export const parseFlacMetadata = (buffer) => {
    const tags = {};

    // Check if buffer starts with "fLaC"
    if (buffer.toString("ascii", 0, 4) !== "fLaC") {
        throw new Error("Not a valid FLAC file");
    }

    let offset = 4; // Skip "fLaC"

    while (offset < buffer.length) {
        const headerByte = buffer.readUInt8(offset);
        const isLast = (headerByte & 0x80) !== 0;
        const blockType = headerByte & 0x7f;
        const blockLength = buffer.readUInt32BE(offset + 1);

        console.log(`FLAC header byte: ${headerByte}`);
        console.log(`Is last: ${isLast}`);
        console.log(`Block type: ${blockType}`);
        console.log(`Block length: ${blockLength}`);

        offset += 4;

        if (blockType === 4) {
            // VORBIS_COMMENT block
            const vendorLength = buffer.readUInt32LE(offset);
            offset += 4 + vendorLength; // Skip vendor string

            const commentListLength = buffer.readUInt32LE(offset);
            offset += 4;

            console.log(`Vendor length: ${vendorLength}`);
            console.log(`Comment list length: ${commentListLength}`);

            for (let i = 0; i < commentListLength; i++) {
                const commentLength = buffer.readUInt32LE(offset);
                offset += 4;
                const comment = buffer.toString(
                    "utf8",
                    offset,
                    offset + commentLength
                );
                offset += commentLength;

                console.log(`Comment length: ${commentLength}`);
                console.log(`Comment: ${comment}`);

                const separatorIndex = comment.indexOf("=");
                if (separatorIndex !== -1) {
                    const key = comment.slice(0, separatorIndex).toUpperCase();
                    const value = comment.slice(separatorIndex + 1);
                    tags[key] = value;
                }
            }

            break;
        }

        offset += blockLength;

        if (isLast) break;
    }

    return tags;
};
