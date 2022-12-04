// ajout du rectangle (couleur, aire) sur la page
function addInPage(id, color, aire) {
    var div = document.getElementById("infos-rects");
    var span = document.createElement("span");
    var pColor = document.createElement("p");
    var pValeur = document.createElement("p");

    // création d'un id avec l'id du rectangle
    span.setAttribute("id", "rect-" + id);
    div.appendChild(span);

    pColor.setAttribute("id", "p-color");
    pColor.style.cssText = "background-color:" + color;

    pValeur.setAttribute("id", "p-valeur");
    pValeur.innerHTML = "aire: " + aire + " px²";
    span.appendChild(pColor);
    span.appendChild(pValeur);
}

// suppression du span contenant l'info du rectngle qu'on vient du supprimer
function DelRectInPage(id) {
    var span = document.getElementById("rect-" + id);
    span.remove();
}

// change la couleur des p-color des rectangles concernés
function chgColorRectInPage(id, newColor) {
    var pColor = document.getElementById("rect-" + id).getElementsByTagName("p")[0];
    pColor.style.cssText = "background-color:" + newColor;
}
