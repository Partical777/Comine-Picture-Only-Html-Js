/*                          Tree Diagram Route

stage => layer => Background(Rect)
               => ImageGroup(Group) => ImageTrLayer(Group)  => image
                                            ...             => tr(Transformer)
                                            ...
*/
/* ======================================================================
===============================Konva=====================================
=======================================================================*/

let width = 750;
let height = 750;
let imagewh = 210; //half 420
let trStyle = {
    //transform Style
    anchorStroke: "#fc766a",
    anchorSize: 25,
    borderStroke: "#fc766a",
    borderStrokeWidth: 5,
    anchorCornerRadius: 50
};

let CurrentSelected; //index in ImageGroup

let stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height
});
let layer = new Konva.Layer();

let ImageGroup = new Konva.Group();
//     Drag & Drop Image
// what is url of dragging element?
let itemURL = "";
document
    .getElementById("drag-items")
    .addEventListener("dragstart", function(e) {
        itemURL = e.target.src;
    });
let con = stage.container();
con.addEventListener("dragover", function(e) {
    e.preventDefault(); // !important
});
con.addEventListener("drop", function(e) {
    e.preventDefault();
    // now we need to find pointer position
    // we can't use stage.getPointerPosition() here, because that event
    // is not registered by Konva.Stage
    // we can register it manually:
    stage.setPointersPositions(e);
    Konva.Image.fromURL(itemURL, function(image) {
        ImageGroup.add(image);
        stage.getPointerPosition().x -= imagewh;
        stage.getPointerPosition().y -= imagewh;
        image.position(stage.getPointerPosition());
        image.draggable(true);
        image.name("image");
        layer.add(ImageGroup);
        attachNew(ImageGroup.children[ImageGroup.children.length - 1]);

        layer.draw();
        // //Layer System
        AddNewLayerInHtml();
        CurrentSelected =
            ImageGroup.children[ImageGroup.children.length - 2].index;
        SortLayerHtml();
        LayerDetachStyle();
        LayerAttachStyle(ImageGroup.children.length - 2);

        // //=========LayerSystem
    });
});
//=====Drag & Drop Image
//Double Click Image
document.getElementById("drag-items").addEventListener("dblclick", function(e) {
    itemURL = e.target.src;
    e.preventDefault();
    // now we need to find pointer position
    // we can't use stage.getPointerPosition() here, because that event
    // is not registered by Konva.Stage
    // we can register it manually:
    stage.setPointersPositions(e);
    Konva.Image.fromURL(itemURL, function(image) {
        ImageGroup.add(image);
        stage.getPointerPosition().x = width / 2 - imagewh;
        stage.getPointerPosition().y = height / 2 - imagewh;
        image.position(stage.getPointerPosition());
        image.draggable(true);
        layer.add(ImageGroup);
        layer.add(ImageGroup);
        attachNew(ImageGroup.children[ImageGroup.children.length - 1]);

        layer.draw();
        // //Layer System
        AddNewLayerInHtml();
        CurrentSelected =
            ImageGroup.children[ImageGroup.children.length - 2].index;
        SortLayerHtml();
        LayerDetachStyle();
        LayerAttachStyle(ImageGroup.children.length - 2);

        // //=========LayerSystem
    });
});
//=====Double Click Image

stage.on("click tap", function(e) {
    // if click on empty area - remove all transformers
    if (e.target === stage) {
        detachAll();
        layer.draw();

        CurrentSelected = undefined;
        return;
    }
    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName("image")) {
        return;
    }
    // remove old transformers
    // TODO: we can skip it if current rect is already selected
    detachAll();

    // create new transformer
    let tr = new Konva.Transformer(trStyle);
    ImageGroup.add(tr);
    tr.attachTo(e.target);
    LayerAttachStyle(e.target.index);

    CurrentSelected = e.target.index;
    layer.draw();
});

//Event
ImageGroup.on("mouseover", function(evt) {
    let shape = evt.target;
    document.body.style.cursor = "move";
    shape.stroke("#fc766a");
    layer.draw();
});
ImageGroup.on("mouseout", function(evt) {
    let shape = evt.target;
    document.body.style.cursor = "default";
    shape.stroke("");
    layer.draw();
});
ImageGroup.on("dragstart", function(evt) {
    let shape = evt.target;
    detachAll();
    attachNew(shape);
    LayerAttachStyle(shape.index);
    layer.draw();
});
//=====Event

function detachAll() {
    ImageGroup.find("Transformer").destroy();
    LayerDetachStyle();
    layer.draw();

    CurrentSelected = undefined;
}

function attachNew(tar) {
    detachAll();
    // create new transformer
    let tr = new Konva.Transformer(trStyle);
    ImageGroup.add(tr);
    tr.attachTo(tar);
    layer.draw();

    CurrentSelected = tar;
}

// Layer System
function AddNewLayerInHtml() {
    let layerBox = document.createElement("h3");
    layerBox.className = "LayerEach";
    document.getElementById("LayersBlock").appendChild(layerBox);
}

function LayerAttachStyle(index) {
    document.getElementById("LayersBlock").querySelectorAll("h3")[
        index
    ].style.border = "2px solid red";
}

function LayerDetachStyle() {
    document
        .getElementById("LayersBlock")
        .querySelectorAll("h3")
        .forEach(function(el) {
            el.style.border = "2px solid blue";
        });
}

function SortLayerHtml() {
    ImageGroup.children.forEach(function(el) {
        if (el.index !== ImageGroup.children.length - 1) {
            document.getElementById("LayersBlock").querySelectorAll("h3")[
                el.index
            ].outerHTML =
                "<h3 class='LayerEach' data-id='" +
                el.index +
                "'>ID : " +
                el._id +
                "</h3>";
        }
    });
}

function DeleteLayerHtml(tar) {
    var element = document.getElementById("LayersBlock").querySelectorAll("h3")[
        tar
    ];
    element.parentNode.removeChild(element);
}

function UpLayer(tar) {
    console.log(tar);
    console.log(ImageGroup.children);
    if (tar !== ImageGroup.children.length - 2) {
        //tar => ImageTrLayer index in ImageGroup
        let moveDone = ImageGroup.children[tar].moveUp();
        if (moveDone) {
            SortLayerHtml();
            CurrentSelected = tar + 1;
            LayerAttachStyle(CurrentSelected);
        }
    }
    console.log(ImageGroup.children);

    layer.draw();
}

function DownLayer(tar) {
    console.log(tar);
    console.log(ImageGroup.children);
    //tar => ImageTrLayer index in ImageGroup
    let moveDone = ImageGroup.children[tar].moveDown();
    if (moveDone) {
        SortLayerHtml();
        CurrentSelected = tar - 1;
        LayerAttachStyle(CurrentSelected);
    }
    console.log(ImageGroup.children);

    layer.draw();
}

function toTopLayer(tar) {
    //tar => ImageTrLayer index in ImageGroup
    let moveDone = ImageGroup.children[tar].setZIndex(
        ImageGroup.children.length - 2
    );
    if (moveDone) {
        SortLayerHtml();
        CurrentSelected = ImageGroup.children.length - 2;
        LayerAttachStyle(CurrentSelected);
    }
    console.log(ImageGroup.children);

    layer.draw();
}

function toBottomLayer(tar) {
    //tar => ImageTrLayer index in ImageGroup
    let moveDone = ImageGroup.children[tar].moveToBottom();
    if (moveDone) {
        SortLayerHtml();
        CurrentSelected = 0;
        LayerAttachStyle(CurrentSelected);
    }
    console.log(ImageGroup.children);

    layer.draw();
}

function DeleteLayer(tar) {
    ImageGroup.children[tar].destroy();
    DeleteLayerHtml(tar);
    layer.draw();
}

// ========= Layer System
stage.add(layer);

/* ======================================================================
=============================== Right Click=====================================
=======================================================================*/
// Right Click
$(document).bind("contextmenu", function(e) {
    //If select sth. ,showing the Move Up & Down
    $(".MoveLayer").show();
    if (CurrentSelected == undefined) {
        $(".MoveLayer").hide();
    }
    // console.log($("#cntnr").height() + " " + $("#cntnr").width());
    // console.log(e.pageX + " " + $(window).width());
    // console.log(e.pageY + " " + $(window).height());

    e.preventDefault();
    $("#cntnr").css("left", function() {
        //prevent the RightClickMenu over the window
        return e.pageX + $("#cntnr").width() < $(window).width()
            ? e.pageX
            : e.pageX - $("#cntnr").width();
    });
    $("#cntnr").css("top", function() {
        //prevent the RightClickMenu over the window
        return e.pageY + $("#cntnr").height() < $(window).height()
            ? e.pageY
            : e.pageY - $("#cntnr").height();
    });
    $("#cntnr").fadeIn(200, startFocusOut());
});

function startFocusOut() {
    $(document).on("click", function() {
        $("#cntnr").hide();
        $(document).off("click");
    });
}

$("#RightClickItems > li").click(function() {
    $("#op").text("You have selected " + $(this).text());
    if (CurrentSelected !== undefined) {
        switch ($(this).text()) {
            case "Move Up":
                UpLayer(CurrentSelected);
                break;
            case "Move Down":
                DownLayer(CurrentSelected);
                break;
            case "to Top":
                toTopLayer(CurrentSelected);
                break;
            case "to Bottom":
                toBottomLayer(CurrentSelected);
                break;
            case "Delete":
                DeleteLayer(CurrentSelected);
                break;
            default:
        }
    }
});

/* ======================================================================
==============================Output Image===============================
=======================================================================*/
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById("save").addEventListener(
    "click",
    function() {
        detachAll();
        var dataURL = stage.toDataURL();
        // Get High Quality Image
        // var dataURL = stage.toDataURL({ pixelRatio: 3 });
        downloadURI(dataURL, "stage.png");
    },
    false
);

/* ======================================================================
==============================Draggable Element==========================
=======================================================================*/
// Make the DIV element draggable:
dragElement(document.getElementById("LayersBlock"));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById("mydivheader")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("mydivheader").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
