## Testers feature requests (from v0.2.0)

-   Add new playlist button on add song to playlist bottom sheet

## Tester bugs (from v0.2.0)

-   When playlist ends, playback controlls do nothing
-   Image edit crash??
-   Undefined variable when clicking on edit button (when you havent long-pressed a song list item first)
-   Song list shenanigens

# v0.3.0 Roadmap

## New features

-   [x] Playing queue (Add songs, playlists, albums to playing queue)
-   [x] Background music playback
-   [x] Albums and Singles (Album tab)
-   [ ] Last played history
-   [x] Read audio file metadata from downloads
-   [ ] Edit specific song metadata
-   [ ] Song title (if too long) in mini player, will loop horizontally
-   [ ] Dismiss player by swiping down
-   [x] Shuffle and play buttons on main screens

-   [ ] Playlist, Song and Album sorting
-   [ ] Go to Album in song bottom sheet
-   [x] View song statistics
-   [x] Refresh song list function
-   [x] Ask to update song tags from album when finshed editing an album
-   [ ] Dynamic top bar

-   [x] TESTER REQ: Add new playlist option to add song to playlist bottom sheet
-   [x] (backend) Variable bottom sheet sizes
-   [x] (backend) Move to typescript
-   [x] (backend) Move to React Native Track Player

## Bug fixes

-   [x] Playback from song screen fully working
-   [ ] Make bottom sheets dissapear on universal back button
-   [x] Remove date picker, in favor of a regular text input
-   [x] TESTER REQ: Playback controls not working when playlist ends
-   [x] TESTER REQ: state timing, shows error for undefined or null items

## Teaks

-   [x] Glow bg on of main screens, just like in the figma design
-   [x] Removed "Remove from playlist" in favour of adding checkboxes to "Add to playlist"
-   [x] Aligned playlist list correctly to the app's margin
-   [x] Playback scrollbar aligns with content horizontally
-   [x] "Add to queue", "Edit playlist" and "Add songs" options are box shaped and at the top
-   [x] "Add to queue", "Add to playlist" and "(Un)like song" options are box shaped and at the top
-   [x] "Update songs with playlist metadata" option only shows up for albums
-   [x] "Delete playlist" option icon is a trash can
-   [ ] Liked songs playlist has a special cover
-   [ ] Proper item seperator in lists
-   [x] Flip list order in playlists (descending)
-   [x] Font styling
-   [x] Margin error fix on tab bar when mini player is not shown
-   [x] "Select artwork" text on image picker

## for v0.4.0

-   [ ] (backend) Move from asyncStorage to Sqlite
-   [ ] More statistics
-   [ ] Select multiple in song lists
-   [ ] Delete song from device option
-   [ ] Display album/playlist name in player, instead of "placeholder text"
