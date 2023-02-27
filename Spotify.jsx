#target "illustrator"
#include 'json2.min.js'

var spotifyUrl;
var track_id;
var codeUUID;
var songName;
var artistName;
var uuidList = [];

function main() {
    spotifyUrl = prompt("Enter spotify URL:", "");
    track_id = getTrackIdFromSpotifyUrl(spotifyUrl);
    var jar = new File(Folder.desktop + "/spotify.jar");
    if (!jar.exists) {
        run("wget -O %UserProfile%\\Desktop\\spotify.jar https://github.com/lewiswhitaker1/SpotifyAutomation-JSX/raw/main/jar/spotify.jar", false);

        while (!jar.exists) {
            $.sleep(1000);
        }
    }
    run("java -jar %userprofile%\\Desktop\\spotify.jar " + spotifyUrl, false);
}

function spotifyCode() {
    var scannable = new File(Folder.desktop + "/spotify/" + track_id + "/scannable.svg");
    while (!scannable.exists) {
        $.sleep(1000); // sleep for 1 second
    }
    app.open(scannable);
}

function createSpotColor() {
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

function spotifyCodeSize() {
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

    var uuid = new Date()
        .getTime();

    if (selection == "Small") {
        resizeCode(38.922, 6.487);
    } else if (selection == "Medium") {
        resizeCode(58.382, 9.73);
    } else if (selection == "Large") {
        resizeCode(77.843, 12.974);
    }

    findGroup(codeUUID);
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

    spotifyInfo(copy, selection);
}

function spotifyInfo(copy, selection) {

    fillInfo(track_id);

    var ps = new Window("dialog", "Photo Select");

    var but1 = ps.add("button", undefined, "Album Cover");

    var but2 = ps.add("button", undefined, "Personalised Photo");

    but1.onClick = function() {
        choiceTwo = "album";
        ps.close();
    };

    but2.onClick = function() {
        choiceTwo = "perso";
        var jar = new File(Folder.desktop + "/cropper.jar");
        if (!jar.exists) {
            run("wget -O %UserProfile%\\Desktop\\cropper.jar https://github.com/lewiswhitaker1/SpotifyAutomation-JSX/raw/main/jar/cropper.jar", false);

            while (!jar.exists) {
                $.sleep(1000);
            }
        }
        ps.close();
    };

    ps.show();

    if (choiceTwo == "perso") {
        var targetDoc = app.documents.getByName("Spotify.ai");
        var chosenPhotoFile = File.openDialog("Select a personalised photo to open", "*.*");
        var path = chosenPhotoFile.fsName;
        var cmd = "java -jar %UserProfile%\\Desktop\\cropper.jar " + "\"" + path + "\"";
        run(cmd, false);
        var photoFile = new File(File.decode(Folder.desktop + "/cropped.png"));

        while (!photoFile.exists) {
            $.sleep(1000); // sleep for 1 second
        }

        var fileName = create_UUID();
        pushToList(fileName);
        photoFile.rename(Folder.desktop.absoluteURI + "/" + fileName + ".png");
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
    }
    if (choiceTwo == "album") {
        var targetDoc = app.documents.getByName("Spotify.ai");
        var photoFile = new File(Folder.desktop + "/spotify/" + track_id + "/image.png");
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
    }
    setNamesAndMove(copy, selection);
}

main();
spotifyCode();
createSpotColor();
spotifyCodeSize();

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

function run(cmd, persistent) {
    var f = new File(Folder.temp.fsName + "/temp.bat");
    f.open("w");
    if (persistent) {
        f.writeln("@echo off");
        f.writeln(cmd);
        f.writeln("@pause");
    } else {
        f.writeln(cmd);
    }
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

    // Iterate through each item in the group and set its fill and stroke colors to Spot1
    for (var i = 0; i < group.pageItems.length; i++) {
        var item = group.pageItems[i];
        if (item.typename == "PathItem") {
            var spot1 = new SpotColor();
            spot1.spot = app.activeDocument.spots.getByName("Spot1");
            item.fillColor = spot1;
        } else if (item.typename == "CompoundPathItem") {
            for (var j = 0; j < item.pathItems.length; j++) {
                var subItem = item.pathItems[j];
                var spot1 = new SpotColor();
                spot1.spot = app.activeDocument.spots.getByName("Spot1");
                subItem.fillColor = spot1;
            }
        }
    }

    codeUUID = create_UUID();

    group.name = codeUUID;
}

function findGroup(name) {
    var doc = app.activeDocument;

    // Get all the groups in the document
    var groups = doc.groupItems;

    // Loop through all the groups
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];

        // Check if the group has the name "uuid"
        if (group.name == name) {
            // Select the group
            group.selected = true;
            break;
        }
    }
}

function fillInfo(track_id) {
    var jsonFilePath = Folder.desktop + "/spotify/" + track_id + "/data.json";

    // Read the contents of the JSON file
    var trackJson = new File(jsonFilePath);
    trackJson.open("r");
    var jsonContent = trackJson.read();
    trackJson.close();

    var jsonData = JSON.parse(jsonContent);
    artistName = jsonData.creator;
    songName = jsonData.title;
}

function setNamesAndMove(copy, selection) {
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

        var distance = 10;
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
}

function pushToList(name) {
    try {
        var photoNameList = new File(Folder.desktop + "/photoNames.json");
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

    uuidList.push(name + ".png");

    try {
        photoNameList.open("w");
        photoNameList.write(JSON.stringify(uuidList));
        photoNameList.close();
    } catch (e) {
        alert("An error occurred while writing to the file: " + e);
    }
}