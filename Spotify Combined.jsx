#target "illustrator"
#include 'json2.min.js'

var url;
var choice;

function partOne() {
    var codeMenu = new Window("dialog", "Code Type");

    var song = codeMenu.add("button", undefined, "Song");

    var album = codeMenu.add("button", undefined, "Album");

    var playlist = codeMenu.add("button", undefined, "Playlist");

    var podcast = codeMenu.add("button", undefined, "Podcast");

    var spotifyUrl;
    var codeUrl;

    song.onClick = function() {

        spotifyUrl = prompt("Enter spotify URL:", "");
        choice = "song";
        url = spotifyUrl;
        codeMenu.close();

    };

    album.onClick = function() {

        spotifyUrl = prompt("Enter spotify URL:", "");
        choice = "album";
        url = spotifyUrl;
        codeMenu.close();

    };

    playlist.onClick = function() {

        spotifyUrl = prompt("Enter spotify URL:", "");
        choice = "playlist";
        url = spotifyUrl;
        codeMenu.close();

    };

    podcast.onClick = function() {

        spotifyUrl = prompt("Enter spotify URL:", "");
        choice = "podcast";
        url = spotifyUrl;
        codeMenu.close();

    };

    codeMenu.show();

    var lastSlash = spotifyUrl.lastIndexOf("/");
    var parsedUrl = spotifyUrl.substring(lastSlash + 1);

    if (choice == "song") {
        codeUrl = "https://scannables.scdn.co/uri/plain/svg/FFFFFF/black/1000/spotify:track:" + parsedUrl;
    }
    if (choice == "playlist") {
        codeUrl = "https://scannables.scdn.co/uri/plain/svg/FFFFFF/black/1000/spotify:playlist:" + parsedUrl;
    }
    if (choice == "album") {
        codeUrl = "https://scannables.scdn.co/uri/plain/svg/FFFFFF/black/1000/spotify:album:" + parsedUrl;
    }
    if (choice == "podcast") {
        codeUrl = "https://scannables.scdn.co/uri/plain/svg/FFFFFF/black/1000/spotify:show:" + parsedUrl;
    }

    //var bt = new BridgeTalk();
    //bt.target = "photoshop";
    //bt.body = "app.system('wget -O %UserProfile%\\Desktop\\spotify.svg " + codeUrl + "')";
    //bt.onError = function(err) { alert(err.body); }
    //bt.send();

    var cmd = "wget -O %UserProfile%\\Desktop\\spotify.svg " + codeUrl;
    run(cmd);

    var file = new File(File.decode(Folder.desktop + "/spotify.svg"));

    while (!file.exists) {
        $.sleep(1000); // sleep for 1 second
    }
    app.open(file);
}

function partTwo() {

    var docRef = app.activeDocument;

    // Create CMYKColor
    var cmykColor = new CMYKColor();
    cmykColor.cyan = 100;
    cmykColor.magenta = 0;
    cmykColor.yellow = 0;
    cmykColor.black = 0;

    // Create Spot
    var spot = docRef.spots.add();
    spot.color = cmykColor;
    spot.colorType = ColorModel.SPOT;
    spot.name = "Spot1";
}

function partThree() {
    // Create a new window
    var win = new Window("dialog", "Size Selection");

    // Add a "Small" button to the window
    var smallButton = win.add("button", undefined, "Small");

    // Add a "Medium" button to the window
    var mediumButton = win.add("button", undefined, "Medium");

    // Add a "Large" button to the window
    var largeButton = win.add("button", undefined, "Large");

    // Set up a variable to store the selection
    var selection;

    var sourceDoc = app.activeDocument;
    var targetDoc = app.documents.getByName("Spotify.ai");

    // Add a click event listener to the "Small" button
    smallButton.onClick = function() {
        // Set the selection variable to "Small"
        selection = "Small";

        // Close the window
        win.close();
    };

    // Add a click event listener to the "Medium" button
    mediumButton.onClick = function() {
        // Set the selection variable to "Medium"
        selection = "Medium";

        // Close the window
        win.close();

        // Output the selection to the console
        $.writeln(selection);
    };

    // Add a click event listener to the "Large" button
    largeButton.onClick = function() {
        // Set the selection variable to "Large"
        selection = "Large";

        // Close the window
        win.close();

        // Output the selection to the console
        $.writeln(selection);
    };

    // Display the window
    win.show();

    // Get the active layer
    var activeLayer = app.activeDocument.activeLayer;

    // Get the path items in the layer
    var pathItems = activeLayer.pathItems;

    // Check if there are any path items in the layer
    if (pathItems.length > 0) {
        // Get the bottom path item
        var bottomPath = pathItems[pathItems.length - 1];

        // Remove the bottom path item
        bottomPath.remove();
    }

    var uuid = new Date()
        .getTime();

    app.doScript("Import (SHIFT + F3)", "Spotify");

    if (selection == "Small") {
        resizeCode(38.922, 6.487);
    } else if (selection == "Medium") {
        resizeCode(58.382, 9.73);
    } else if (selection == "Large") {
        resizeCode(77.843, 12.974);
    }

    app.copy();
    targetDoc.activate();
    app.paste();
    sourceDoc.close(SaveOptions.DONOTSAVECHANGES);

    var group = targetDoc.groupItems.getByName(selection);

    var copy = group.duplicate();

    copy.name = selection + uuid;

    app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
    var abIdx = targetDoc.artboards.getActiveArtboardIndex();
    var actAbBds = targetDoc.artboards[abIdx].artboardRect;

    copy.position = new Array((actAbBds[2] - actAbBds[0]) / 2 - copy.width / 2, (actAbBds[3] - actAbBds[1]) / 2 + copy.height / 2);

    var templateCode = copy.groupItems.getByName(selection + " Code");

    var newCode = targetDoc.selection[0];

    templateCodePos = templateCode.position;

    newCode.position = templateCodePos;

    newCode.move(copy, ElementPlacement.PLACEATEND);

    templateCode.remove();

    var choiceTwo;

    var ps = new Window("dialog", "Photo Select");

    var but1 = ps.add("button", undefined, "Album Cover");

    var but2 = ps.add("button", undefined, "Personalised Photo");

    but1.onClick = function() {
        choiceTwo = "album";
        ps.close();
    };

    but2.onClick = function() {
        choiceTwo = "perso";
        var photoFile = File.openDialog("Select a personalised photo to open", "*.*");
        var placedPhoto = targetDoc.placedItems.add();
        placedPhoto.file = photoFile;

        var templatePhoto = copy.pathItems.getByName(selection + " Picture");
        var templatePhotoPos = templatePhoto.position;

        var bounds = templatePhoto.geometricBounds;

        placedPhoto.position = templatePhotoPos;
        placedPhoto.zOrder(ZOrderMethod.SENDTOBACK);
        placedPhoto.move(copy, ElementPlacement.PLACEATEND);
        ps.close();
    };

    ps.show();

    if (choiceTwo == "album") {
        var spotifyUrl = url;
        var jsonUrl = "https://open.spotify.com/oembed?url=" + spotifyUrl;

        //var bt = new BridgeTalk();
        //bt.target = "photoshop";
        //bt.body = "app.system('wget -O %UserProfile%\\Desktop\\spotify.json " + jsonUrl + "')";
        //bt.onError = function(err) { alert(err.body); }
        //bt.send();
        var cmd = "wget -O %UserProfile%\\Desktop\\spotify.json " + jsonUrl;
        run(cmd);

        var file = new File(File.decode(Folder.desktop + "/spotify.json"));
        while (!file.exists) {
            $.sleep(1000); // sleep for 1 second
        }
        file.open("r");
        var jsonString = file.read();
        file.close();
        var jsonData = JSON.parse(jsonString);
        var thumbnailUrl = jsonData.thumbnail_url;
        uuid = create_UUID();

        //var bt = new BridgeTalk();
        //bt.target = "photoshop";
        //bt.body = "app.system('wget -O %UserProfile%\\Desktop\\" + uuid + ".pdf " + thumbnailUrl + "')";
        //bt.onError = function(err) { alert(err.body); }
        //bt.send();
        var cmd = "wget -O %UserProfile%\\Desktop\\" + uuid + ".pdf " + thumbnailUrl;
        run(cmd);

        var uuidList = [];

        try {
            var photoNameList = new File(Folder.desktop + "/pdfNames.json");
            photoNameList.open("r");
            var fileContents = photoNameList.read();
            photoNameList.close();
        } catch (e) {
            alert("An error occurred while opening the file: " + e);
        }

        try {
            uuidList = JSON.parse(fileContents);
        } catch (e) {
            // fileContents is not valid JSON, so start with an empty array
            uuidList = [];
        }

        uuidList.push(uuid + ".pdf");

        try {
            photoNameList.open("w");
            photoNameList.write(JSON.stringify(uuidList));
            photoNameList.close();
        } catch (e) {
            alert("An error occurred while writing to the file: " + e);
        }

        var photoFile = new File(File.decode(Folder.desktop + "/" + uuid + ".pdf"));

        while (!photoFile.exists) {
            $.sleep(1000); // sleep for 1 second
        }

        var placedPhoto = targetDoc.placedItems.add();
        placedPhoto.file = photoFile;

        var templatePhoto = copy.pathItems.getByName(selection + " Picture");
        var templatePhotoPos = templatePhoto.position;

        var bounds = templatePhoto.geometricBounds;

        placedPhoto.width = bounds[2] - bounds[0];
        placedPhoto.height = bounds[2] - bounds[0];

        placedPhoto.position = templatePhotoPos;
        placedPhoto.zOrder(ZOrderMethod.SENDTOBACK);
        placedPhoto.move(copy, ElementPlacement.PLACEATEND);

        file.remove();
    }

    var songName;
    var artistName;

    if (choiceTwo == "album") {
        if (choice == "song") {
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

            var trackId = getTrackIdFromSpotifyUrl(spotifyUrl);

            var trackJsonBat = new File(Folder.desktop + "/TRACK_JSON.bat");
            trackJsonBat.open("w");
            trackJsonBat.write("set TRACKID=" + trackId + "\n");
            trackJsonBat.write("set AUTHTOKEN=" + authToken + "\n");
            trackJsonBat.write('curl.exe -X "GET" "https://api.spotify.com/v1/tracks/%TRACKID%\" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer %AUTHTOKEN%" > %userprofile%\\Desktop\\track.json\n');
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

            var jsonData = JSON.parse(jsonContent);
            artistName = jsonData.album.artists[0].name;
            songName = jsonData.name;

            trackJson.remove();
        }
        if (choice == "playlist") {
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

            var trackId = getTrackIdFromSpotifyUrl(spotifyUrl);

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

            var jsonData = JSON.parse(jsonContent);
            artistName = jsonData.owner.display_name;
            songName = jsonData.name;

            trackJson.remove();
        }
        if (choice == "album") {
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

            var trackId = getTrackIdFromSpotifyUrl(spotifyUrl);

            var trackJsonBat = new File(Folder.desktop + "/TRACK_JSON.bat");
            trackJsonBat.open("w");
            trackJsonBat.write("set TRACKID=" + trackId + "\n");
            trackJsonBat.write("set AUTHTOKEN=" + authToken + "\n");
            trackJsonBat.write('curl.exe -X "GET" "https://api.spotify.com/v1/albums/%TRACKID%\" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer %AUTHTOKEN%" > %userprofile%\\Desktop\\track.json\n');
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

            var jsonData = JSON.parse(jsonContent);
            artistName = jsonData.artists[0].name;
            songName = jsonData.name;

            trackJson.remove();
        }
        if (choice == "podcast") {
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

            var trackId = getTrackIdFromSpotifyUrl(spotifyUrl);

            var trackJsonBat = new File(Folder.desktop + "/TRACK_JSON.bat");
            trackJsonBat.open("w");
            trackJsonBat.write("set TRACKID=" + trackId + "\n");
            trackJsonBat.write("set AUTHTOKEN=" + authToken + "\n");
            trackJsonBat.write('curl.exe -X "GET" "https://api.spotify.com/v1/shows/%TRACKID%\?market=GB" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer %AUTHTOKEN%" > %userprofile%\\Desktop\\track.json\n');
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

            var jsonData = JSON.parse(jsonContent);
            artistName = "";
            songName = jsonData.name;

            trackJson.remove();
        }

        var copyName = copy.name;

        // Get the active document
        var doc = app.activeDocument;

        // Loop through all the artboards in the document
        for (var i = 0; i < doc.artboards.length; i++) {
            // Set the current artboard as the active artboard
            doc.artboards.setActiveArtboardIndex(i);

            // Loop through all the groups in the active artboard
            for (var j = 0; j < doc.groupItems.length; j++) {
                var group = doc.groupItems[j];

                // Check if the group has the name "Small123"
                if (group.name === copyName) {
                    // Loop through all the text layers in the group
                    for (var k = 0; k < group.textFrames.length; k++) {
                        var textLayer = group.textFrames[k];
                        if (textLayer.contents.indexOf("Song Name") !== -1) {
                            // Set the text of the text layer to the new text
                            textLayer.contents = songName;
                        }
                    }
                }
            }
        }

        // Loop through all the artboards in the document
        for (var i = 0; i < doc.artboards.length; i++) {
            // Set the current artboard as the active artboard
            doc.artboards.setActiveArtboardIndex(i);

            // Loop through all the groups in the active artboard
            for (var j = 0; j < doc.groupItems.length; j++) {
                var group = doc.groupItems[j];

                // Check if the group has the name "Small123"
                if (group.name === copyName) {
                    // Loop through all the text layers in the group
                    for (var k = 0; k < group.textFrames.length; k++) {
                        var textLayer = group.textFrames[k];
                        if (textLayer.contents.indexOf("Artist Name") !== -1) {
                            // Set the text of the text layer to the new text
                            textLayer.contents = artistName;
                        }
                    }
                }
            }
        }
        copy.transform(app.getScaleMatrix(-100, 100));

        var layerExists = false;

        for (var i = 0; i < doc.layers.length; i++) {
            if (doc.layers[i].name == "Artwork") {
                layerExists = true;
                break;
            }
        }

        if (!layerExists) {
            var layer = doc.layers.add();
            layer.name = "Artwork";
            copy.move(layer, ElementPlacement.PLACEATEND);

            var distance = 5;
            var distanceInPoints = distance * 2.8346;
            var artboard = doc.artboards[0];
            var artboardRect = artboard.artboardRect;


            var newX = artboardRect[0] + distanceInPoints;
            var newY = artboardRect[1] - distanceInPoints;
            copy.position = [newX, newY];
        }

        if (layerExists) {
            var layer = doc.layers.getByName("Artwork");
            var bottomGroup;

            for (var i = 0; i < layer.groupItems.length; i++) {
                var group = layer.groupItems[i];

                // Check if this is the bottom group
                if (!bottomGroup || group.position[1] > bottomGroup.position[1]) {
                    bottomGroup = group;
                }
            }

            copy.move(layer, ElementPlacement.PLACEATEND);

            var offset = bottomGroup.top - copy.top;
            copy.top += offset;

            var distance = 10;
            var distanceInPoints = distance * 2.8346;


            // Get the artboard and the groups on the artboard
            var artboard = doc.artboards[0];
            var groups = layer.groupItems;

            // Set the distance between groups
            var distance = 10;
            var distanceInPoints = distance * 2.8346;

            // Set the starting position for the first group
            var x = artboard.artboardRect[0] + distanceInPoints;
            var y = artboard.artboardRect[1] - distanceInPoints;

            // Loop through the groups
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];

                // Check if the group fits on the current row
                if (x + group.width > artboard.artboardRect[2]) {
                    // Move the group to the next row
                    x = artboard.artboardRect[0] + distanceInPoints;
                    y += (group.height - (group.height * 2)) - distanceInPoints;
                }

                // Move the group to the current position
                group.left = x;
                group.top = y;

                // Update the current position for the next group
                x += group.width + distanceInPoints;
            }
        }
        var file = new File(File.decode(Folder.desktop + "/spotify.svg"));
        file.remove();
    }
}

partOne();

$.sleep(1000);

partTwo();

$.sleep(1000);

partThree();

function create_UUID() {
    var dt = new Date()
        .getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8))
            .toString(16);
    });
    return uuid;
}

function getTrackIdFromSpotifyUrl(url) {
    return url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
}

function run(cmd) {
    var f = new File(Folder.temp.fsName + "/temp.bat");
    f.open("w");
    f.writeln(cmd);
    f.close();
    f.execute();
}

function resizeCode(widthInMm, heightInMm) {
    var doc = app.activeDocument;

    // Get the active layer
    var activeLayer = app.activeDocument.activeLayer;

    // Get the path items in the layer
    var pathItems = activeLayer.pathItems;

    // Check if there are any path items in the layer
    if (pathItems.length > 0) {
        // Get the bottom path item
        var bottomPath = pathItems[pathItems.length - 1];

        // Remove the bottom path item
        bottomPath.remove();
    }

    var myLayer = doc.layers.getByName("Layer 1");

    var paths = [];
    var compounds = [];

    // Recursively find all paths and compound paths in the layer
    function collectPaths(item) {
        if (item.typename == "PathItem") {
            paths.push(item);
        } else if (item.typename == "CompoundPathItem") {
            compounds.push(item);
        } else if (item.typename == "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectPaths(item.pageItems[i]);
            }
        }
    }

    // Get all paths and compound paths in the layer
    for (var i = 0; i < myLayer.pageItems.length; i++) {
        collectPaths(myLayer.pageItems[i]);
    }

    var group = myLayer.groupItems.add();
    for (var i = 0; i < paths.length; i++) {
        paths[i].moveToBeginning(group);
    }
    for (var i = 0; i < compounds.length; i++) {
        compounds[i].moveToBeginning(group);
    }

    var widthInPt = widthInMm / 25.4 * 72;
    var heightInPt = heightInMm / 25.4 * 72;

    group.width = widthInPt;
    group.height = heightInPt;

}
