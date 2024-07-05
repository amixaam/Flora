#!/bin/bash

# Get the project name from the directory name
project_name=$(basename $(pwd))

# Move to android directory (assuming standard structure)
cd android

# Run gradle assembleRelease task
./gradlew assembleRelease

# Check if build is successful (optional)
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed! Check for errors."
  exit 1
fi

# Get today's date in dd.mm format
today=$(date +%m.%d)

# Define source and target paths
source_file="app/build/outputs/apk/release/app-release.apk"
target_file="${today}-$project_name.apk"
target_dir=~/Documents/Expo-Builds/$project_name/ 
mtp_target="mtp://Google_Pixel_7_28251FDH2006FH/Internal%20shared%storage/Download/$project_name-releases"

# Create target directory if it doesn't exist
mkdir -p "$target_dir"

# Move and rename the APK file
mv "$source_file" "$target_dir/$target_file"

echo "APK renamed and moved to $target_dir"
