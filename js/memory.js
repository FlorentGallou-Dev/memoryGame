/*~~~~~~~~~~~~~~~~~~~~~~~~~ VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~*/
//HTML element selectors
let main = document.querySelector("main");
let header = document.querySelector("header");
//selector of the cards container
let cardsContainer = document.getElementById("cardsContainer");

//To set size of th main container and so the cards size we need to get viewports dimensions
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

//Object list to define the back face picture of the cards
const pairsFaces = [
        {
            name: "phone",
            url: 'url("img/phone.png")'
        },
        {
            name: "book",
            url: 'url("img/book.png")'
        },
        {
            name: "coin",
            url: 'url("img/coin.png")'
        },
        {
            name: "diamond",
            url: 'url("img/diamond.png")'
        },
        {
            name: "dice",
            url: 'url("img/dice.png")'
        },
        {
            name: "floppy",
            url: 'url("img/floppy.png")'
        },
        {
            name: "sun",
            url: 'url("img/sun.png")'
        }
];

/*~~~~~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~*/

//Function that return a card in HTML element injecting back face picture set of pairs
function createCardsElements(name, url){
    //Create HTML element to main card container
    let singleCardContainer = document.createElement("DIV");
    singleCardContainer.classList.add("singleCardContainer", "p-0", "m-0");
    //Create HTML element child of container to set padding to the card
    let flipCard = document.createElement("DIV");
    flipCard.classList.add("flip-card", "p-1", "p-xl-2");
    //Create HTML element child div used to set padding, used to contain the two faces and set animations
    let flipCardInner = document.createElement("DIV");
    flipCardInner.classList.add("flip-card-inner");
    //Create HTML element front face of the card
    let cardFront = document.createElement("DIV");
    cardFront.classList.add("cardFront");
    //Create HTML element back face of the card witch will display the picture
    let cardBack = document.createElement("DIV");
    cardBack.classList.add("cardBack", name);
    cardBack.style.background = url + " no-repeat center, var(--greyGradient)";
    cardBack.style.backgroundSize = "100%";

    //Injecting HTML elements from smaller child to the highest parent
    flipCardInner.appendChild(cardFront);
    flipCardInner.appendChild(cardBack);
    flipCard.appendChild(flipCardInner);
    singleCardContainer.appendChild(flipCard);

    //Return the card Element created
    return singleCardContainer;
}

//Function to return an array that contains all the HTML cards
function createListOfCards(arrayOfFaces){
    //create array to contain card list
    let arrayOfCards = [];
    //For each pair in the object array pairsFaces set 2 cards with the same picture
    for(let pair of arrayOfFaces){
        arrayOfCards.push(createCardsElements(pair.name, pair.url));
        arrayOfCards.push(createCardsElements(pair.name, pair.url));
    }
    //return the card list array
    return arrayOfCards;
}

//Function to distribut cards, injecting it in the card HTML container
function randomSetCards(divToDistributeCards){
    //Get the list of created cards
    let cardElementList = createListOfCards(pairsFaces);
    //Set a random number corresponding to the indexs of the card list array
    let randomNumber = Math.floor(Math.random() * (cardElementList.length - 1)) + 0 ;

    //Loop to inject randomly each card in the HTML untill the card list array is empty
    while(cardElementList.length !== 0){
        divToDistributeCards.appendChild(cardElementList[randomNumber]);
        //Delete from the array the card that was injected in the HTML container.
        cardElementList.splice(randomNumber, 1);
        //Reset the random value with the new array length.
        randomNumber = Math.floor(Math.random() * (cardElementList.length - 1)) + 0 ;
    }
}

//Resize html elements to display the cards
function resizeGame(height, width){
    //get the viewport height without the header height after the page is fully loaded
    heightMain = height - parseInt(header.offsetHeight);
    //give the full height the main can take
    main.style.height = heightMain + "px";
    //pick each card container and give it it's width and height
    for(let card of singleCardContainerList){
        //if the height is smaller than the width calculate by a simple grid à 5 by 3
        if(width > height){
            card.style.width = (width / 5) + "px";
            card.style.height = (Math.floor(heightMain / 3)) + "px";
        }
        else{
            //if the width is smaller than the height calculate by a simple grid à 3 by 5
            card.style.width = (width / 3) + "px";
            card.style.height = (Math.floor(heightMain / 5)) + "px";
        }
    }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~ EXECUTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~*/

randomSetCards(cardsContainer);

let singleCardContainerList = document.getElementsByClassName("singleCardContainer");

//Order the cards when the page is loaded to fully get the header size and so calculate the main height properly
window.addEventListener('load', function () {
    resizeGame(viewportHeight, viewportWidth);
});

window.addEventListener("orientationchange", function(event) {
    window.location.reload();
    resizeGame(viewportWidth, viewportHeight);
});

/*Reste à faire :
    - déclancher le hover en JS seulement sur les cartes non retournées,
    - déclancher le retournement de la carte en JS si on clique dessus,
    - déclancher un controle si deux cartes sont retournées + bloquer action du joueur,
    - controler le nombre de paires trouvées pour fin du jeu,
    - créer bouton commencer et restart,
    - créer timer.
*/ 