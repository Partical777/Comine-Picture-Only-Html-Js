import "./styles.css";

document.getElementById("combineMe").addEventListener("click", combineImages);

function combineImages() {
    draw(function() {
        document.getElementById("imgBox").innerHTML =
            '<p style="padding:10px 0">success！</p><img src="' +
            base64[0] +
            '">';
    });
}
//'img1.png','img2.png','img3.png','img4.png'
var data = [
        // "https://images.unsplash.com/photo-1563714272638-882a6309ba7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        // "https://i.imgur.com/YwTuZEr.png",
        // "https://i.imgur.com/2Hci8GS.png",
        // "https://i.imgur.com/EkZpkXY.png",
        // "https://i.imgur.com/11G97T3.png"
        "./img/1-1.png",
        "./img/1-2.png",
        "./img/1-3.png",
        "./img/1-4.png"
    ],
    base64 = [];
function draw(fn) {
    var c = document.createElement("canvas"),
        ctx = c.getContext("2d"),
        len = data.length;
    // canvas必須設定確定的寬高
    c.width = 500;
    c.height = 500;
    ctx.rect(0, 0, c.width, c.height);
    ctx.fillStyle = "#fff";
    ctx.fill();

    function drawing(n) {
        if (n < len) {
            var img = new Image();
            img.setAttribute("crossOrigin", "anonymous"); //解决跨域
            img.src = data[n];
            img.onload = function() {
                ctx.drawImage(img, 0, 0, 500, 500);
                drawing(n + 1);
            };
        } else {
            base64.push(c.toDataURL("image/png"));
            //alert(JSON.stringify(base64));
            fn();
        }
    }
    drawing(0);
}
