#target "illustrator"

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
alert("Files deleted: " + parsedContents + ", pdfNames.json");
