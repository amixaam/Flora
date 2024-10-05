import { Buffer } from "buffer";
import RNFS from "react-native-fs";
import { parseID3Tags, parseOpusMetadata } from "./id3-tag-parser";

// SUPPORTS OPUS AND MP3 SO FAR
export const MetadataReader = async (uri: string) => {
    let fileType = "unknown";
    let error = null;
    let tags = null;

    try {
        // Read file using react-native-fs and convert to Buffer
        const fileContent = await RNFS.readFile(uri, "base64");
        // Convert file content to Buffer
        const buffer = Buffer.from(fileContent, "base64");

        // Check file type
        let detectedFileType = "unknown";
        if (buffer.toString("ascii", 0, 3) === "ID3") {
            detectedFileType = "mp3";
        } else if (
            buffer.toString("ascii", 0, 4) === "OggS" &&
            buffer.toString("ascii", 28, 32) === "Opus"
        ) {
            detectedFileType = "opus";
        }
        // else if (buffer.toString("ascii", 0, 4) === "fLaC") {
        //     detectedFileType = "flac";
        // } else if (buffer.toString("ascii", 4, 8) === "ftyp") {
        //     detectedFileType = "m4a";
        // }

        fileType = detectedFileType;

        switch (detectedFileType) {
            case "mp3":
                // Parse ID3 tags
                try {
                    tags = parseID3Tags(buffer);
                } catch (err) {
                    console.log(err);
                    error = err;
                }
                break;
            // case "m4a":
            //     // Parse iTunes-style metadata
            //     break;
            case "opus":
                // Parse Ogg container and Opus comments
                try {
                    tags = parseOpusMetadata(buffer);
                } catch (err) {
                    console.log(err);
                    error = err;
                }
                break;
            // case "flac":
            //     // Parse FLAC metadata blocks
            //     try {
            //         tags = parseFlacMetadata(buffer);
            //     } catch (err) {
            //         console.log(err);
            //         error = err;
            //     }
            //     break;
            default:
                throw new Error("Unsupported file type");
        }
    } catch (err) {
        error = err;
    }

    if (fileType === "mp3") {
        const metadata: MetadataProps = {
            fileType,
            ...Object.fromEntries(
                Object.entries(tags ?? {}).map(([key, value]) => {
                    switch (key) {
                        case "TIT2":
                            return ["title", value];
                        case "TPE1":
                            return ["artist", value];
                        case "TALB":
                            return ["album", value];
                        case "TYER":
                            return ["year", value];
                        case "APIC":
                            return ["artwork", value];
                        case "TRCK":
                            return ["track", value];
                        default:
                            return [key, value];
                    }
                })
            ),
        };
        return metadata;
    } else if (fileType === "opus") {
        const metadata: MetadataProps = {
            fileType,
            ...Object.fromEntries(
                Object.entries(tags ?? {}).map(([key, value]) => {
                    switch (key) {
                        case "TITLE":
                            return ["title", value];
                        case "ARTIST":
                            return ["artist", value];
                        case "ALBUM":
                            return ["album", value];
                        case "DATE":
                            return ["year", value];
                        case "TRACKNUMBER":
                            return ["track", value];
                        case "METADATA_BLOCK_PICTURE":
                            return ["artwork", value];
                        default:
                            return [key, value];
                    }
                })
            ),
        };
        return metadata;
    } else {
        const error: MetadataProps = {
            fileType,
            error: "Unsupported file type",
        };
        return error;
    }
};

export interface MetadataProps {
    fileType: string;
    title?: string;
    artist?: string;
    album?: string;
    year?: string;
    artwork?: string;
    track?: string;
    error?: string;
}
