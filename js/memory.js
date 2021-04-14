let body = document.querySelector("body");
let header = document.querySelector("header");
let heightMain = parseInt(body.offsetHeight) - parseInt(getComputedStyle(header, null).getPropertyValue("height"));
let widthMain = parseInt(getComputedStyle(document.querySelector("main"), null).getPropertyValue("width"));
widthMain -= parseInt(getComputedStyle(document.querySelector("main"), null).getPropertyValue("padding-left")) * 2;

let cardList = document.getElementsByClassName("card");
let threeColWidth = widthMain / 3;
let fiveRowHeight = heightMain / 5;
let marginWidthCards = threeColWidth * 0.028;
let marginHeightCards = fiveRowHeight * 0.035;

for(let card of cardList){
    card.style.width = (threeColWidth-marginWidthCards) + "px";
    card.style.height = (fiveRowHeight-marginHeightCards) + "px";
    card.style.marginLeft = (marginWidthCards/2) + "px";
    card.style.marginRight = (marginWidthCards/2) + "px";
    card.style.marginTop = (marginHeightCards) + "px";
    card.style.marginBottom = (marginHeightCards) + "px";
}