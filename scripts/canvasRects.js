// Objet Rectangle
class Rect {
    constructor(x, y, w, h, c, rot, topRot, topSupp, inter) {
        this.id = arrRects.length;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = c;
        this.rot = rot || 0;
        this.topRot = topRot || 0; //top rotation en cours
        this.topSupp = topSupp || 0; //top rectangle a supprimer
        this.aire = w * h;
        this.inter = inter || 0; //interval
        this.draw();
        addInPage(this.id, this.color, this.aire);
    }
    rotation() {
        /*
        // avec cette solution les animation sont sacadés si ont lancent plusieurs animations 
        // clear le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // on redessine les tous les retangles
        // mais si on lance plusieurs rotation alors l'animation sera lancé plusieurs fois et on aura des animations sacadées
        for (let x = 0; x < arrRects.length; x++) {
            if (arrRects[x].topRot == 1) {
                ctx.save();
                ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
                ctx.rotate((this.rot * Math.PI) / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
                ctx.fill();
                ctx.restore();
            } else {
                arrRects[x].draw();
            }
        } 
        */

        // on supprimer et on dessine que le rectangle
        // mais il peux y avoir des problèmes de suppression si les rectangles sont trop proche les uns des autres
        if (this.w > this.h) {
            ctx.clearRect(this.x - this.h / 2, this.y - this.w / 2, this.w + this.w / 2, this.w + this.h / 2);
        } else {
            ctx.clearRect(this.x - this.h / 2, this.y - this.w / 2, this.w + this.h * 2, this.h + this.w * 2);
        }
        ctx.save();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate((this.rot * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.fill();
        ctx.restore();

        // On redessine les rectangles car certains on pu être effacer a cause la rotation d'autres rectangles
        for (let x = 0; x < arrRects.length; x++) {
            if (arrRects[x].topRot == 0) {
                arrRects[x].draw();
            }
        }
    }
    color(newColor) {
        ctx.fillStyle = newColor;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
    delete() {
        ctx.clearRect(this.x, this.y, this.w, this.h);
        DelRectInPage(this.id);
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
}

var button = document.getElementById("button");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var arrRectDelet = [];
var arrRects = [];

// génération couleur aléatoire
function RandomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

// Detecte si on a cliqué sur un rectangle
function detectRect(x, y) {
    for (let rect of arrRects) {
        if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
            return arrRects.indexOf(rect);
        }
    }
}

// acive rotation
function RotationRect(e) {
    // initialise position du click de l'user
    const container = canvas.getBoundingClientRect();
    const x = (e.clientX - container.left) * (canvas.width / container.width);
    const y = (e.clientY - container.top) * (canvas.height / container.height);

    // Detection du rectangle
    var indexRect = detectRect(x, y);

    // Rectangle trouvé on active la rotation si le rectangle n'est pas déjà en rootation
    if (indexRect != undefined) {
        if (arrRects[indexRect].topRot == 0) {
            // activer rotation en cours
            arrRects[indexRect].topRot = 1;

            // lancement de la rotation toutes les 100ms
            arrRects[indexRect].inter = setInterval(function () {
                // rotation du rectangle tant que la rotation < 360
                if (arrRects[indexRect].rot <= 360) {
                    arrRects[indexRect].rotation();
                    arrRects[indexRect].rot += 0.5;
                } else {
                    // le rectangle a fait un 360 => rotation fini, rect a supprimer, réinitialiser setInterval, delete rectangle
                    arrRects[indexRect].topRot = 0;
                    arrRects[indexRect].topSupp = 1;
                    clearInterval(arrRects[indexRect].inter);
                    deleteRect();
                }
            }, 1);
        }
    }
}

function deleteRect() {
    var arrTopRot = arrRects.filter(function (rect) {
        return rect.topRot == 1;
    });

    // Si arrTopRot.length == 0 => il n'y a pas de rotation en cours
    // on va récup tous les rectangle avec le topSupp = 1 => Delete rectangle
    if (arrTopRot.length == 0) {
        var rectDels = arrRects.filter(function (rect) {
            return rect.topSupp == 1;
        });
        for (let x of rectDels) {
            // delete reactengle on canvas
            arrRects[arrRects.indexOf(x)].delete();

            // delete rectangle in arrRects
            arrRects = arrRects.filter(function (rect) {
                return rect.id != x.id;
            });
        }
    }
}

// Au click du button "changer couleur" => changer les couleurs des 2 rectangles avec la plus petite diff d'aire
function chnageColor() {
    // création d'un array avec la différences d'aire entre 2 rectangles
    var rectsChangeColor = [];
    if (arrRects.length > 0) {
        for (let x of arrRects) {
            for (let i of arrRects) {
                if (x.id != i.id) {
                    if (x.aire >= i.aire) {
                        rectsChangeColor.push({ couple: [x.id, i.id], diffAire: x.aire - i.aire });
                    }
                }
            }
        }

        // On récupère la plus petite diffAire
        var diffAireMin = rectsChangeColor.reduce((min, p) => (p.diffAire < min ? p.diffAire : min), rectsChangeColor[0].diffAire);

        // On récupère le couple avec la plus petite diffAire
        var coupleRect = rectsChangeColor.filter(function (rect) {
            return rect.diffAire == diffAireMin;
        });

        // Générer une nouvelle couleur alétoire
        var newColor = "#" + RandomColor();

        // update color des rectangles
        arrRects[coupleRect[0].couple[0]].color = newColor;
        arrRects[coupleRect[0].couple[0]].draw();
        chgColorRectInPage(coupleRect[0].couple[0], newColor);
        arrRects[coupleRect[0].couple[1]].color = newColor;
        arrRects[coupleRect[0].couple[1]].draw();
        chgColorRectInPage(coupleRect[0].couple[1], newColor);
    }
}

// Evenements
canvas.addEventListener("dblclick", RotationRect);
button.addEventListener("click", chnageColor);
