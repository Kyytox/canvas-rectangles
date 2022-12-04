// on récupère la position du click
var canvasOffset = canvas.getBoundingClientRect();

// variale pour savoir si l'user desine
var topDraw = false;

// variables contenant la position de la souris et cote du rectangle
var startX;
var startY;
var width = 0;
var height = 0;

// couleur du rectangle
var colorRand;

function mouseDown(e) {
    e.preventDefault();

    // sauvegarde des point de départ x/y du rectangle
    startX = parseInt((e.clientX - canvasOffset.left) * (canvas.width / canvasOffset.width));
    startY = parseInt((e.clientY - canvasOffset.top) * (canvas.height / canvasOffset.height));

    // Detection du rectangle
    var indexRect = detectRect(startX, startY);

    // On se trouve pas sur un rectangle donc on peux dessiner
    if (indexRect == undefined) {
        colorRand = "#" + RandomColor();
        // On dessine
        topDraw = true;
    }
}

function mouseMove(e) {
    e.preventDefault();
    // Si on ne dessine pas , on return juste
    if (!topDraw) {
        return;
    }

    // récupérer la position de la souris
    mouseX = parseInt((e.clientX - canvasOffset.left) * (canvas.width / canvasOffset.width));
    mouseY = parseInt((e.clientY - canvasOffset.top) * (canvas.height / canvasOffset.height));

    // supprimer le rectangle tracer a chaque mouvement
    ctx.clearRect(startX, startY, width, height);

    // calculer la largeur et hauteur du rectangle
    width = mouseX - startX;
    height = mouseY - startY;

    // créer le rectangle sur le canvas avec la couleur aléatoire
    ctx.fillStyle = colorRand;
    ctx.fillRect(startX, startY, width, height);
    ctx.fill();
}

function mouseUp(e) {
    e.preventDefault();
    // le rectangle est fini
    topDraw = false;

    // création du rectangle si ces coté sont > 2
    if (width > 2 && height > 2) {
        arrRects.push(new Rect(startX, startY, width, height, colorRand));
    }

    // réinistialiser les variable de position
    startX = 0;
    startY = 0;
    width = 0;
    height = 0;
}

// souris sorti du canvas
function mouseOut(e) {
    e.preventDefault();
    // on ne dessine plus
    topDraw = false;
}

// Evenements
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mouseout", mouseOut);
