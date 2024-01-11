# -*- coding: utf-8 -*-
import sys
from syrics.api import Spotify
import json
import re
import os
import subprocess
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests

def get_spotify_info(track_url):
    client_id = '630362daba20469cb86bd75228f7e237'
    client_secret = 'aeef6fa8de86452fa82b543f034d4858'
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    track_id = track_url.split('/')[-1].split('?')[0]
    track_info = sp.track(track_id)

    title = track_info['name']
    artist = track_info['artists'][0]['name']
    cover_art_url = track_info['album']['images'][0]['url']

    return title, artist, cover_art_url

def run_lyrics_extraction(link):
    sp = Spotify("AQABLq--vfInuHUaUCS4wh5Sh55gTfGGwHfGtCSW-3Z7TnHCNCOQB-irSKjok2qVGgXtAhBMSfiG32IJKA6jQGMsXXbqVT6dD-7awhQJHyfBmRAzNwkgBJXQV9PoOn67njD1IybnQhZn8uMGtTAIWESKiaWChz05")

    pattern = r'\/track\/(\w+)\?'
    match = re.search(pattern, link)
    track_id = match.group(1)

    lyrics = sp.get_lyrics(track_id)

    json_filename = "lyrics.json"

    lyrics_data = {"spotify": lyrics}

    with open(json_filename, "w") as json_file:
        json.dump(lyrics_data, json_file)

    with open(json_filename, 'r') as file:
        json_data = file.read()

    data = json.loads(json_data)

    if data is None or data.get("spotify") is None or data["spotify"].get("lyrics") is None:
        lines = [{"words": "no lyrics available"}]
    else:
        lines = data["spotify"]["lyrics"].get("lines", [{"words": "no lyrics available"}])

    processed_words = [line["words"] + " " for line in lines]

    collated_lyrics = "".join(processed_words).capitalize().replace("♪", "")

    desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    spotify_folder_path = os.path.join(desktop_path, "spotify")
    os.makedirs(spotify_folder_path, exist_ok=True)
    track_folder_path = os.path.join(spotify_folder_path, track_id)
    os.makedirs(track_folder_path, exist_ok=True)

    text_filename = os.path.join(track_folder_path, "lyrics.txt")
    with open(text_filename, "w", encoding="utf-8") as text_file:
        text_file.write(collated_lyrics)

    title, artist, cover_art_url = get_spotify_info(link)

    spotify_info = {
    "title": title,
    "creator": artist
    }

    json_filename = os.path.join(track_folder_path, "spotify_info.json")

    # Write the information to the JSON file
    with open(json_filename, "w") as json_file:
        json.dump(spotify_info, json_file, indent=2)

    img_data = requests.get(cover_art_url).content
    img_filename = os.path.join(track_folder_path, "album cover.png")
    with open(img_filename, 'wb') as handler:
        handler.write(img_data)

    scannable_link = "https://scannables.scdn.co/uri/plain/svg/FFFFF/black/1000/spotify:track:" + track_id
    svg_data = requests.get(scannable_link).content
    svg_filename = os.path.join(track_folder_path, "scannable.svg")
    with open(svg_filename, 'wb') as handler:
        handler.write(svg_data)
    print("Data for: " + title + " saved to " + track_folder_path)


def main():
    if len(sys.argv) != 2:
        print("Usage: python spotify.py {spotify_link}")
        sys.exit(1)

    link = sys.argv[1]
    run_lyrics_extraction(link)

if __name__ == "__main__":
    main()
