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

var paths = myLayer.pathItems;
var compounds = myLayer.compoundPathItems;

var group = myLayer.groupItems.add();
for (var i = 0; i < paths.length; i++) {
    paths[i].moveToBeginning(group);
}
for (var i = 0; i < compounds.length; i++) {
    compounds[i].moveToBeginning(group);
}

group.width = 165.49;
group.height = 78.185;
