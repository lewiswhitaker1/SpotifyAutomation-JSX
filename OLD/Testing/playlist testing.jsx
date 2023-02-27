var authBat = new File(Folder.desktop + "/AUTH.bat");
authBat.open("w");
authBat.write("@echo off" + "\n");
authBat.write('powershell -Command "$encoded=[convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(\\"630362daba20469cb86bd75228f7e237:aeef6fa8de86452fa82b543f034d4858\\"));$response=curl.exe -X \\"POST\\" -H \\"Authorization: Basic $encoded\\" -d grant_type=client_credentials https://accounts.spotify.com/api/token;$key=($response | ConvertFrom-Json).access_token;$key" > %userprofile%\\Desktop\\key.txt');
authBat.close();
authBat.execute();

var authTokenFile = new File(Folder.desktop + "/key.txt");
$.sleep(1000);
authTokenFile.open("r");
var authToken = authTokenFile.read();
authTokenFile.close();

//var trackId = getTrackIdFromSpotifyUrl(spotifyUrl);
var trackId = "2nlcDXIVAUjumH28Eo7cSr";

var trackJsonBat = new File(Folder.desktop + "/TRACK_JSON.bat");
trackJsonBat.open("w");
trackJsonBat.write("set TRACKID=" + trackId + "\n");
trackJsonBat.write("set AUTHTOKEN=" + authToken + "\n");
trackJsonBat.write('curl.exe -X "GET" "https://api.spotify.com/v1/playlists/%TRACKID%\" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer %AUTHTOKEN%" > %userprofile%\\Desktop\\track.json\n');
trackJsonBat.close();

trackJsonBat.execute();

$.sleep(5000);
authBat.remove();
authTokenFile.remove();
trackJsonBat.remove();

var artistName;
var songName;

var trackJson = File("~/Desktop/track.json");
trackJson.open("r");
var jsonContent = trackJson.read();
trackJson.close();

#include 'json2.min.js'

var jsonData = JSON.parse(jsonContent);
artistName = jsonData.owner.display_name;
songName = jsonData.name;

trackJson.remove();
