import "./styles.css";

let x = 0;

document.getElementById("combineMe1").addEventListener("click", combineImages1);
document.getElementById("combineMe2").addEventListener("click", combineImages2);

function combineImages1() {
    draw(data1, function() {
        document.getElementById("imgBox1").innerHTML =
            '<p style="padding:10px 0">success！</p><img src="' +
            base64[x] +
            '">';
        x++;
    });
}
function combineImages2() {
    draw(data2, function() {
        document.getElementById("imgBox2").innerHTML =
            '<p style="padding:10px 0">success！</p><img src="' +
            base64[x] +
            '">';
        x++;
    });
}

var data1 = [
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/1-1.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/1-2.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/1-3.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/1-4.png"
    ],
    data2 = [
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/2-1.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/2-2.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/2-3.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/2-4.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/2-5.png",
        "https://partical777.github.io/Comine-Picture-Only-Html-Js/img/2-6.png"
    ],
    base64 = [];
function draw(data, fn) {
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
