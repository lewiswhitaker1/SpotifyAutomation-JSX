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

var widthInMm = 58.382;
var heightInMm = 9.73;

var widthInPt = widthInMm / 25.4 * 72;
var heightInPt = heightInMm / 25.4 * 72;

group.width = widthInPt;
group.height = heightInPt;
