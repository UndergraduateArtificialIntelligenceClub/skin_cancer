// GET DOM ELEMENTS
var humanPredText = document.getElementById("human-pred-text");
var groundTruthText = document.getElementById("ground-truth-text");
var aiPredText = document.getElementById("ai-pred-text");

var predictionButtonsDiv = document.getElementById("prediction-buttons");
var predictionResultsDiv = document.getElementById("prediction-results");

var humanAccuracyText = document.getElementById("human-accuracy");
var humanCorrectText = document.getElementById("human-correct");
var humanIncorrectText = document.getElementById("human-incorrect");

var aiAccuracyText = document.getElementById("ai-accuracy");
var aiCorrectText = document.getElementById("ai-correct");
var aiIncorrectText = document.getElementById("ai-incorrect");

var countText = document.getElementById("count");

var moleImage = document.getElementById("mole-image");

// VARIABLES
// const apiUrl = window.location.origin + "/api/predict/";

var predictions = null;
fetch("static/predictions.json").then((response) => {
    return response.json();
}).then((json) => {
    predictions = json;
    reset();
})

var numCorrectHuman = 0;
var numCorrectAI = 0;
var numTotal = 0;

const numMalignant = 300;
const numBenign = 360;

var malignantImages = [];
for (let i = 1; i <= numMalignant; i++) {
    malignantImages.push(i);
}

var benignImages = [];
for (let i = 1; i <= numBenign; i++) {
    benignImages.push(i);
}

var malignantIndex = 0;
var benignIndex = 0;

var malignant = (Math.random() > 0.5);


// FUNCTION DEFINITIONS

// add a shuffle method to the Array prototype
// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
Array.prototype.shuffle = function () {
    let counter = this.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = this[counter];
        this[counter] = this[index];
        this[index] = temp;
    }
}

function pred(humanPredMalignant) {
    if (malignant && humanPredMalignant) {
        numCorrectHuman += 1;

        humanPredText.innerText = "Human: Predicted Malignant (True Positive)";
        humanPredText.style.color = "green";
    }
    else if (malignant && !humanPredMalignant) {
        humanPredText.innerText = "Human: Predicted Benign (False Negative)";
        humanPredText.style.color = "red";
    }
    else if (!malignant && humanPredMalignant) {
        humanPredText.innerText = "Human: Predicted Malignant (False Positive)";
        humanPredText.style.color = "red";
    }
    else {
        numCorrectHuman += 1;

        humanPredText.innerText = "Human: Predicted Benign (True Negative)";
        humanPredText.style.color = "green";
    }

    updateStats();

    resultsMode();
}

function updateStats() {
    let humanAccuracy = Math.round(10000 * numCorrectHuman / numTotal) / 100;

    let aiAccuracy = Math.round(10000 * numCorrectAI / numTotal) / 100;

    countText.innerText = "Count: " + numTotal.toString();

    humanCorrectText.innerText = "Correct: " + numCorrectHuman.toString();
    humanIncorrectText.innerText = "Incorrect: " + (numTotal - numCorrectHuman).toString();
    aiCorrectText.innerText = "Correct: " + numCorrectAI.toString();
    aiIncorrectText.innerText = "Incorrect: " + (numTotal - numCorrectAI).toString();

    if (numTotal > 0) {
        humanAccuracyText.innerText = "Accuracy: " + humanAccuracy.toString() + "%";
        aiAccuracyText.innerText = "Accuracy: " + aiAccuracy.toString() + "%";
    }
    else {
        humanAccuracyText.innerText = "Accuracy: 100%";
        aiAccuracyText.innerText = "Accuracy: 100%";
    }
}

function next() {
    predictMode();
    resetText();

    numTotal += 1;

    malignant = (Math.random() > 0.5);

    let imagePath = window.location + "/static/images/";
    if (malignant) {
        groundTruthText.innerText = "Actual: Malignant";
        imagePath += "malignant/" + (malignantImages[malignantIndex]).toString() + ".jpg";
    }
    else {
        groundTruthText.innerText = "Actual: Benign";
        imagePath += "benign/" + (benignImages[benignIndex]).toString() + ".jpg";
    }
    moleImage.src = imagePath;

    if (malignant) {
        malignantIndex = (malignantIndex + 1) % numMalignant;
    }
    else {
        benignIndex = (benignIndex + 1) % numBenign;
    }

    getAIPred();
}

function reset() {
    numCorrectHuman = 0;
    numCorrectAI = 0;
    numTotal = 0;

    malignantImages.shuffle();
    benignImages.shuffle();

    malignantIndex = 0;
    benignIndex = 0;

    resetText();
    updateStats();

    next();
}

function predictMode() {
    predictionButtonsDiv.style.display = "flex";
    predictionResultsDiv.style.display = "none";
}

function resultsMode() {
    predictionButtonsDiv.style.display = "none";
    predictionResultsDiv.style.display = "flex";
}

function resetText() {
    aiPredText.innerText = "";
    humanPredText.innerText = "";
}

function getAIPred() {
    let malignantProbability;
    let benignProbability;
    if (malignant) {
        malignantProbability = predictions["malignant"][malignantIndex]["predictions"]["malignant"];
        benignProbability = predictions["malignant"][malignantIndex]["predictions"]["benign"];
    }
    else {
        malignantProbability = predictions["benign"][benignIndex]["predictions"]["malignant"];
        benignProbability = predictions["benign"][benignIndex]["predictions"]["benign"];
    }

    let aiPredMalignant = (malignantProbability > benignProbability);

    let malignantCertainty = Math.round(10000 * malignantProbability) / 100;
    let benignCertainty = Math.round(10000 * benignProbability) / 100;

    if (malignant && aiPredMalignant) {
        numCorrectAI += 1;

        aiPredText.innerText = "AI: Predicted Malignant with " + malignantCertainty.toString() + "% certainty (True Positive)";
        aiPredText.style.color = "green";
    }
    else if (malignant && !aiPredMalignant) {
        aiPredText.innerText = "AI: Predicted Benign with " + benignCertainty.toString() + "% certainty (False Negative)";
        aiPredText.style.color = "red";
    }
    else if (!malignant && aiPredMalignant) {
        aiPredText.innerText = "AI: Predicted Malignant with " + malignantCertainty.toString() + "% certainty (False Positive)";
        aiPredText.style.color = "red";
    }
    else {
        numCorrectAI += 1;

        aiPredText.innerText = "AI: Predicted Benign with " + benignCertainty.toString() + "% certainty (True Negative)";
        aiPredText.style.color = "green";
    }

    // let url = apiUrl;
    // if (malignant) {
    //     url += "malignant/" + malignantImages[malignantIndex].toString();
    // }
    // else {
    //     url += "benign/" + benignImages[benignIndex].toString();
    // }

    // fetch(url).then((response) => {
    //     return response.json();
    // }).then((json) => {
    //     let malignantProbability = json["predictions"]["malignant"];
    //     let benignProbability = json["predictions"]["benign"];

    //     let aiPredMalignant = (malignantProbability > benignProbability);

    //     let malignantCertainty = Math.round(10000 * malignantProbability) / 100;
    //     let benignCertainty = Math.round(10000 * benignProbability) / 100;

    //     if (malignant && aiPredMalignant) {
    //         numCorrectAI += 1;

    //         aiPredText.innerText = "AI: Predicted Malignant with " + malignantCertainty.toString() + "% certainty (True Positive)";
    //         aiPredText.style.color = "green";
    //     }
    //     else if (malignant && !aiPredMalignant) {
    //         aiPredText.innerText = "AI: Predicted Benign with " + benignCertainty.toString() + "% certainty (False Negative)";
    //         aiPredText.style.color = "red";
    //     }
    //     else if (!malignant && aiPredMalignant) {
    //         aiPredText.innerText = "AI: Predicted Malignant with " + malignantCertainty.toString() + "% certainty (False Positive)";
    //         aiPredText.style.color = "red";
    //     }
    //     else {
    //         numCorrectAI += 1;

    //         aiPredText.innerText = "AI: Predicted Benign with " + benignCertainty.toString() + "% certainty (True Negative)";
    //         aiPredText.style.color = "green";
    //     }
    // })
}
