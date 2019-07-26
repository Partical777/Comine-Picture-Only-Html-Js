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
let Background = new Konva.Rect({
    x: 0,
    y: 0,
    width: width,
    height: height
});
layer.add(Background);
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
        layer.add(ImageGroup);
        let tr = new Konva.Transformer(trStyle);
        ImageGroup.add(tr);
        detachAll();
        tr.attachTo(ImageGroup.children[ImageGroup.children.length - 2]);
        layer.draw();
        //Layer System
        CurrentSelected =
            ImageGroup.children[ImageGroup.children.length - 2].index;
        SortLayer();
        LayerDetach();
        LayerAttach(ImageGroup.children.length / 2 - 1);

        //=========LayerSystem
    });
});
//=====Drag & Drop Image
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
ImageGroup.on("click", function(evt) {
    let shape = evt.target;
    detachAll();
    attachNew(shape.index);
    layer.draw();
});
ImageGroup.on("dragmove", function(evt) {
    let shape = evt.target;
    detachAll();
    attachNew(shape.index);
    layer.draw();
});
Background.on("click", function(evt) {
    //click background to get blur
    let shape = evt.target;
    detachAll();
    layer.draw();
});
//=====Event

function detachAll() {
    //detach all others
    ImageGroup.children.forEach(function(el) {
        //Array in ImageGroup is like => [n, t, n, t...]
        el.index % 2 ? ImageGroup.children[el.index].detach() : 0;
    });
    LayerDetach();
    CurrentSelected = undefined;
}
function attachNew(tar) {
    ImageGroup.children[tar + 1].attachTo(ImageGroup.children[tar]);
    LayerAttach(tar / 2);
    CurrentSelected = tar;
}

// Layer System
document.getElementById("UpLayer").addEventListener("click", function() {
    if (CurrentSelected !== undefined) {
        UpLayer(CurrentSelected);
    }
});
document.getElementById("DownLayer").addEventListener("click", function() {
    if (CurrentSelected !== undefined) {
        DownLayer(CurrentSelected);
    }
});

function LayerAttach(index) {
    document.getElementById("LayersBlock").querySelectorAll("h3")[
        index
    ].style.border = "2px solid red";
}

function LayerDetach() {
    document
        .getElementById("LayersBlock")
        .querySelectorAll("h3")
        .forEach(function(el) {
            el.style.border = "2px solid blue";
        });
}

function SortLayer() {
    ImageGroup.children.forEach(function(el) {
        if (!(el.index % 2)) {
            document.getElementById("LayersBlock").querySelectorAll("h3")[
                el.index / 2
            ].outerHTML =
                "<h3 class='LayerEach' data-id='" +
                el.index +
                "'>ID : " +
                el._id +
                "</h3>";
        }
    });
}

function UpLayer(tar) {
    //tar => image index in ImageGroup
    let maxLength = ImageGroup.children.length;
    ImageGroup.children[tar].index =
        tar === maxLength - 2 ? maxLength - 2 : tar + 2; //0
    ImageGroup.children[tar + 1].index =
        tar + 1 === maxLength - 1 ? maxLength - 1 : tar + 1 + 2; //1
    if (tar !== maxLength - 2) {
        ImageGroup.children[tar + 2].index = tar + 2 - 2; //2
        ImageGroup.children[tar + 3].index = tar + 3 - 2; //3
        CurrentSelected += 2;
        ImageGroup.children.sort(function(a, b) {
            return a.index - b.index;
        });
        // console.log(ImageGroup.children);
        SortLayer();
        LayerAttach(tar / 2 + 1);
    }
    console.log(ImageGroup.children);

    layer.draw();
}

function DownLayer(tar) {
    //tar => image index in ImageGroup
    ImageGroup.children[tar].index = tar === 0 ? 0 : tar - 2; //2
    ImageGroup.children[tar + 1].index = tar + 1 === 1 ? 1 : tar + 1 - 2; //3
    if (tar !== 0) {
        ImageGroup.children[tar - 2].index = tar - 2 + 2; //0
        ImageGroup.children[tar - 1].index = tar - 1 + 2; //1
        CurrentSelected -= 2;
        ImageGroup.children.sort(function(a, b) {
            return a.index - b.index;
        });
        // console.log(ImageGroup.children);
        SortLayer();
        LayerAttach(tar / 2 - 1);
    }
    console.log(ImageGroup.children);

    layer.draw();
}
// ========= Layer System
stage.add(layer);
