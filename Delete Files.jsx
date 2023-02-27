#target "illustrator"

var uuidList = [];

try {
    var photoNameList = new File(Folder.desktop + "/photoNames.json");
    photoNameList.open("r");
    var fileContents = photoNameList.read();
    photoNameList.close();
} catch (e) {
    alert("An error occurred while opening the file: " + e);
}

try {
    uuidList = eval(fileContents);
} catch (e) {
    // fileContents is not valid JSON, so start with an empty array
    uuidList = [];
}

try {
    for (var i = 0; i < uuidList.length; i++) {
        var fileToDelete = new File(Folder.desktop + "/" + uuidList[i]);
        if (fileToDelete.exists) {
            fileToDelete.remove();
        }
    }
} catch (e) {
    alert("An error occurred while deleting the file: " + e);
}

photoNameList.remove();
parsedContents = fileContents.replace(/[\[\]"]/g, '');

var desktopPath = Folder.desktop.absoluteURI;

// Construct the path of the Spotify folder
var spotifyPath = desktopPath + "/spotify";

// Create a folder object
var spotifyFolder = new Folder(spotifyPath);

if (spotifyFolder.exists) {
  // Delete the folder and everything inside of it
  run("rm -rf %UserProfile%\\Desktop\\spotify", false);
} else {
  alert("The Spotify folder doesn't exist.");
}

alert("Files deleted: " + parsedContents + ", photoNames.json & /spotify");

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
