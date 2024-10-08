import { AudioFile } from "expo-tag-reader/build/ExpoTagReader.types";
import * as MediaLibrary from "expo-media-library";
import { readNewAudioFiles } from "expo-tag-reader";
import { Album, Song } from "../types/song";
import { useSongsStore } from "../store/songs";

export const UpdateMetadata = async () => {
    useSongsStore.getState().setIsReadingSongs(true);
    await loadAllAudioFiles(useSongsStore.getState().songs.map((s) => s.id));
    useSongsStore.getState().setIsReadingSongs(false);
};

async function loadAllAudioFiles(songIds: string[]) {
    const pageSize = 5;
    let pageNumber = 1;
    let allAudioFiles: AudioFile[] = [];
    let currentPage: AudioFile[];

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        alert(
            "Permission to access media library was denied. To view songs, please allow access."
        );
        return;
    }

    const startTime = Date.now();
    console.log("start");

    do {
        currentPage = await readNewAudioFiles(songIds, pageSize, pageNumber);
        pageNumber++;

        allAudioFiles = allAudioFiles.concat(currentPage);
    } while (currentPage.length === pageSize);

    const endTime = Date.now();
    console.log(
        `METADATA // Read ${allAudioFiles.length} audio files in ${
            endTime - startTime
        }ms`
    );

    if (allAudioFiles.length === 0) {
        console.log("No audio files found");
        return;
    } else {
        saveAllAudioFiles(allAudioFiles);
    }
}

const saveAllAudioFiles = (audioFiles: AudioFile[]) => {
    const newSongs: Song[] = [];
    const albums: { [key: Album["title"]]: Song["id"][] } = {};
    const albumData: { [key: Album["title"]]: Partial<Album> } = {};

    console.log("length of songs: ", audioFiles.length);

    try {
        audioFiles.forEach((file) => {
            const tags = file.tags;
            const albumId =
                "A" +
                Date.now().toString(36) +
                Math.random().toString(36).substr(2, 5).toUpperCase();

            if (tags.album) {
                if (!albums[tags.album]) {
                    albums[tags.album] = [];
                    albumData[tags.album] = {};
                }
                albums[tags.album].push(file.internalId);

                albumData[tags.album] = {
                    artist: tags.artist,
                    year: tags.year,
                    artwork: tags.albumArt,
                    id: albumId,
                };
            }

            const song: Song = {
                id: file.internalId,
                albumIds: tags.album ? [albumId] : [],
                url: file.uri,
                title:
                    tags.title ||
                    file.fileName.split(".").slice(0, -1).join("."),
                artist: tags.artist || "No artist",
                year: tags.year || "No year",
                artwork: tags.albumArt,
                duration: parseInt(file.duration),
                isLiked: false,
                isHidden: false,
                statistics: {
                    creationDate: file.creationDate,
                    lastPlayed: undefined,
                    playCount: 0,
                    skipCount: 0,
                    lastModified: undefined,
                },
            };

            newSongs.push(song);
        });

        useSongsStore.getState().addSongs(newSongs);
        useSongsStore.getState().addAlbums(albumData, albums);
    } catch (error) {
        alert("Error: " + error);
    }
};
