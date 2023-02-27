var deleteLayer = app.activeDocument.layers.getByName("Layer 1");

deleteLayer.remove();

var items = app.activeDocument.pageItems;
// or if you want only selection use app.activeDocument.selection
traverseSceneObjects(items);

var outlineGroup = app.activeDocument.groupItems.add();

for (var i = 0; i < items.length; i++) {
    if (items[i].stroked) {
        items[i].moveToBeginning(outlineGroup);
    }
}

outlineGroup.name = "Outline";

outlineGroup.hidden = true;

var all = app.activeDocument.selectObjectsOnActiveArtboard();

app.executeMenuCommand("group");

var artworkGroup = app.activeDocument.selection[0];
artworkGroup.name = "Artwork";

outlineGroup.hidden = false;

function traverseSceneObjects(pageItems) {

    for (var iter = 0; iter < pageItems.length; iter++) {
        var item = pageItems[iter];
        var typename = item.typename;

        // apply action or get the subitems of object
        if (typename === "PathItem") {
            item.clipping = false;

        } else if (typename === "GroupItem") {
            traverseSceneObjects(item.pageItems);
            release(item, "pageItems");

        }

    }

}


function release(obj, action) {

    for (var i = obj[action].length - 1; i >= 0; i--) {
        obj[action][i].move(obj, ElementPlacement.PLACEAFTER);

    }

}
