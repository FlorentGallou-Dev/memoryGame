/*~~~~~~~~~~~~~~~~~~~~~~~~~ VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~*/
//HTML element selectors
let main = document.querySelector("main");
let header = document.querySelector("header");
let heightMain = 0;
//selector of the cards container
let cardsContainer = document.getElementById("cardsContainer");
let buttonAction = document.getElementById("buttonAction");

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

let flipCardInnerList = []; //Will get the list of the cards 
let checkPairTab = []; //temp array to receive the pair image for control
let numberOfPairsDone = 0; //To count the number of pair found
let timer;//Prepare timer
let timeArray = [];//Score array to compare at the end or each game.

/*~~~~~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~*/

//--------------------------------------------------------------------------------------Function to set the game properly

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
    let singleCardContainerList = document.getElementsByClassName("singleCardContainer");
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

//resize elements when the page is loaded to fully get the header size and so calculate the main height properly
function setsSizeToElementsWhenPageLoaded(){
    //Fist check if page is already loaded in case of restart
    if (document.readyState === "complete") {
        resizeGame(viewportHeight, viewportWidth);
    } else{//Else wait the page to fully load so we can get the true header height
        window.addEventListener('load', function () {
            resizeGame(viewportHeight, viewportWidth);
            buttonWillAppear("play", "", heightMain, "noIma");
            buttonAction.addEventListener("click", function() {
                document.getElementById("cardsContainer").classList.remove("d-none");
                document.getElementById("buttonContainer").parentNode.removeChild(document.getElementById("buttonContainer"));
                let timeArticle = document.getElementById("timerDiv");
                timerCreation(timeArticle);
            });
        });
    }
}

//Function to set the attitude of the player with the cards during a game
function loadEventsWhenReady(){

    for(let flipCardInner of flipCardInnerList) {

        //What happens if the mouse passes hover a card
        flipCardInner.addEventListener("mouseenter", function() {
            //If the card is not already fliped
            if(getComputedStyle(this,null).getPropertyValue("transform") === "none" || getComputedStyle(this,null).getPropertyValue("transform") === "rotateY(0deg)"){
                 hoverAnimationOn(this);
            }
        })

        //What happens if the mouse leaves a card
        flipCardInner.addEventListener("mouseleave", function() {
            //Manage the over elevation animation
            hoverAnimationOff(this);
        })
    
        //What happens if the mouse clicks a card
        flipCardInner.addEventListener("click", function() {
            //Only react if the card is not already fliped so marked with the class "fliped or "goodpair
            if(!this.getElementsByClassName("cardBack")[0].classList.contains("fliped") && !this.getElementsByClassName("cardBack")[0].classList.contains("goodPair") ){
                //Only do something if there is not two cards already fliped
                if(checkPairTab.length < 2){
                    //put the fliped card in the array to check later is it's a match and flip the card
                    checkPairTab.push(flipCardOn(this));
                    //wait for the card to flip to test if it's a match or not
                    setTimeout(scoreVerifications, 500);
                } 
            }
        })
    }
}

//------------------------------------------------------------------------Functions for score verifications---------------------------------------------------------------------------------------------Success

function scoreVerifications(){
            //Checks if there is two values in the pair array and if they match
            if(checkPairTab.length === 2 && checkPairTab[0] === checkPairTab[1]){
    
                //Change the classes to mark the cards as good
                for(let card of flipCardInnerList){
                    //if the actual good match card contains fliped delete it and change it with goodpair so it will not be listed as fliped pair again
                    if(card.getElementsByClassName("cardBack")[0].classList.contains("fliped")){
                        card.getElementsByClassName("cardBack")[0].classList.remove("fliped");
                        card.getElementsByClassName("cardBack")[0].classList.add("goodPair");
                    }
                }
    
                //Empty the pair array when done
                checkPairTab = [];

                //Add a point it the number of pair var
                numberOfPairsDone++;
                
                //What happens when you win ???
                if(numberOfPairsDone === 7){
                    
                    //prepare to check the timer
                    let timeArticle = document.getElementById("timerDiv");
                    //get the time
                    let time = document.getElementById("timer").innerText;
                    // parse int it so we can concatenate the values to check and compare the result
                    let houres = parseInt(time.substr(0, 2));
                    let minutes = parseInt(time.substr(3, 2));
                    let secondes = parseInt(time.substr(6, 2));
                    //Prepare a message var
                    let winMessage = "";
                    //prepare a var to handle the future new record gif
                    let background;
                    
                    //chekc if there is a score stored in the time array
                    if(timeArray.length !== 0){
                        //get the score already present in the time array and concatenate it to be readable in seconds
                        let bestTim = (timeArray[0].houres * 60) + (timeArray[0].minutes * 60) + timeArray[0].secondes;
                        //get the actual score and do so
                        let actualTime = (houres * 60) + (minutes * 60) + secondes;

                        //add the actual score in the array
                        timeArray.push({
                            "houres": houres,
                            "minutes": minutes,
                            "secondes": secondes
                        });

                        //checks if the time already stored in the time array is better than the new one
                        if(bestTim !== 0 && bestTim < actualTime){
                            //Prepare a win message
                            winMessage = `Bravo, tu as gagné en ${minutes} minutes et ${secondes} secondes. Mais votre meilleur score était de ${timeArray[0].minutes} minutes et ${timeArray[0].secondes} secondes. Une autre partie ?`;
                            //get the new score out of the array to keep only the best one
                            timeArray.pop();
                        }else{
                            //prepare the win message
                            winMessage = `Félicitations, c'est un nouveau record de ${minutes} minutes et ${secondes} secondes. Une autre partie ?`;
                            //prepare the magic gif background
                            background = "magic";
                            //as it is a new record we delete the old one to keep only the new one witch becomes the only one in the array
                            timeArray.shift();
                        }

                    }else{
                        //if the array is empty add the first score in the time array
                        timeArray.push({
                            "houres": houres,
                            "minutes": minutes,
                            "secondes": secondes
                        });
                        //prepare the win message
                        winMessage = `Bravo, tu as gagné en ${minutes} minutes et ${secondes} secondes. Une autre partie ?`;
                    }

                    //get rid of the timer to stop it
                    removeTimer(timeArticle);
                
                    //Make a win screen appear
                    buttonWillAppear("restart", winMessage, parseInt(cardsContainer.offsetHeight), background);

                    //What happens if the player clicks restard
                    buttonAction.addEventListener("click", function() {
                        //Clean the older game container
                        cardsContainer.innerHTML = "";
                        //Reset a new set of cards
                        setTheGame(cardsContainer);
                        //Show the game conainer again
                        document.getElementById("cardsContainer").classList.remove("d-none");
                        //Make the succes display screen desapear
                        document.getElementById("buttonContainer").parentNode.removeChild(document.getElementById("buttonContainer"));
                        //Add a new timer
                        timerCreation(timeArticle);
                    });
                }
            }//Checks if there is two elements in the pair array but differents images.
            else if(checkPairTab.length === 2 && checkPairTab[0] !== checkPairTab[1]){
                //List of all flip-card-inner div
                let flipCardInner = document.getElementsByClassName("flip-card-inner");
                //Loop in the flip-card-inner div
                for(let card of flipCardInner){
                    //check if the cardBack div of the actual flip-card-inner div has fliped as class
                    if(card.getElementsByClassName("cardBack")[0].classList.contains("fliped")){
                        //Flip back the cards
                        flipCardOff(card);
                        //remove the fliped class from the cardBack div of the actual flip-card-inner div
                        card.getElementsByClassName("cardBack")[0].classList.remove("fliped");
                    }
                    //empty the pair tab to check a new one
                    checkPairTab = [];
                }
            }
}

//------------------------------------------------------------------------Functions for score verifications---------------------------------------------------------------------------------------------Success

//--------------------------------------------------------------------------------------Function to set the game properly

//--------------------------------------------------------------------------------------Function to set timer

//Function to create the timer container and elements
function createTimerHTMLElement(timerContainer){
    let divContainer = document.createElement("DIV");
    divContainer.classList.add("row", "col-12");
    divContainer.id = "timerContainerChild";

    let divTitle = document.createElement("DIV");
    divTitle.classList.add("col-12");

    let title = document.createElement("H3");
    title.innerText = "Chrono";

    let divTimer = document.createElement("DIV");
    divTimer.classList.add("col-12");

    let timer = document.createElement("p");
    timer.id = "timer";

    divTimer.appendChild(timer);
    divTitle.appendChild(title);
    divContainer.appendChild(divTitle);
    divContainer.appendChild(divTimer);

    timerContainer.appendChild(divContainer);
}

//function to manage the timer
function timerOn(timerTextElement){
    timer = new easytimer.Timer();
    timer.start();

    timer.addEventListener('secondsUpdated', function (e) {
        timerTextElement.innerText = timer.getTimeValues().toString();
    });
}

function timerCreation(div){
    createTimerHTMLElement(div);
    timerP = document.getElementById("timer");
    timerOn(timerP);
}

function removeTimer(div){
    div.removeChild(document.getElementById("timerContainerChild"));
}

//--------------------------------------------------------------------------------------Functions to set timer

//--------------------------------------------------------------------------------------Functions to manage cards animations

//Function to animate the elevation up of the element we are over
function hoverAnimationOn(element){
    element.style.boxShadow = "0px 0px 10px 2px var(--grey)";
}

//Function to animate the elevation down of the element we are leaving
function hoverAnimationOff(element){
    element.style.boxShadow = "0px 0px 0px 0px transparent";
}

//Function to flip the actual card and marked it as fliped
function flipCardOn(element){
    //Get the cardBack element from the actual element
    let cardInThisElement = element.getElementsByClassName("cardBack");
    //Rotate the element
    element.style.transform = "rotateY(180deg)";
    //Add the fliped class to the cardBack
    cardInThisElement[0].classList.add("fliped");

    //return the face image name in class element
    return cardInThisElement[0].classList[1];
}

//Function to flip back the actual card
function flipCardOff(element){
    element.style.transform = "rotateY(0deg)";
}

//--------------------------------------------------------------------------------------Functions to manage cards animations

//--------------------------------------------------------------------------------------Function to create button display mode
function buttonWillAppear(textButton, textSuccess, heightSendt, image){
    //create HTML elements to make a section
    let sectionToReceiveButton = document.createElement("SECTION");
    sectionToReceiveButton.classList.add("row", "p-0", "m-0")
    sectionToReceiveButton.id = "buttonContainer";
    sectionToReceiveButton.style.height = heightSendt + "px";

    //create HTML elements to make a sub section
    let divRowToCenterElements = document.createElement("DIV");
    divRowToCenterElements.classList.add("row", "col-12", "adjust-content-center", "align-items-center", "p-0", "m-0", image)

    //create HTML elements to make a div to contain centered text and link
    let divToContainLink = document.createElement("DIV");
    divToContainLink.classList.add("text-center", "col-12");

    //create HTML elements to make a text over the link
    let textDisplayedOverLink = document.createElement('P');
    textDisplayedOverLink.innerText = textSuccess;

    //create HTML elements to make a link
    let link = document.createElement("A");
    link.classList.add("btn", "btn-memory", "fs-1", "py-sm-1rem", "px-sm-2rem");
    link.id = "buttonAction";
    link.innerText = textButton.toUpperCase();

    //Inject HTML elements as parent/child in the right order
    divToContainLink.appendChild(textDisplayedOverLink);
    divToContainLink.appendChild(link);
    divRowToCenterElements.appendChild(divToContainLink);
    sectionToReceiveButton.appendChild(divRowToCenterElements);

    //Get the main div
    let mainContainer = document.querySelector("main");
    //Hide the cards section
    cardsContainer.classList.add("d-none");
    //Inject the button section in the main
    mainContainer.appendChild(sectionToReceiveButton);
    //set the section height
    
    //finaly get the a element in the var
    buttonAction = document.getElementById("buttonAction");
}

//--------------------------------------------------------------------------------------Function to start a new game
function setTheGame(divGameContainer){
    //Set or Reset all the needed vars
    flipCardInnerList = [];
    checkPairTab = [];
    numberOfPairsDone = 0;
    //Functionnal process to create the cards and injects them in the HTML
    randomSetCards(divGameContainer);

    //Resize elements to fit perfectly the screen
    setsSizeToElementsWhenPageLoaded();
    //Now the elements are created we can target the cards and make a list
    flipCardInnerList = document.getElementsByClassName("flip-card-inner");
    //Load the events player can do
    loadEventsWhenReady();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~ EXECUTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~*/

//Sets the first game behind the play pannel.
setTheGame(cardsContainer);

//Resize the elements when fliping the device
window.addEventListener("orientationchange", function(event) {
    window.location.reload();
    resizeGame(viewportWidth, viewportHeight);
});