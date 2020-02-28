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
var numCorrectHuman = 0;
var numCorrectAI = 0;
var numTotal = 0;

const numMalignant = 300;
const numBenign = 360;

var malignantIndex = Math.floor(Math.random() * numMalignant);
var benignIndex = Math.floor(Math.random() * numBenign);

var malignant = (Math.random() > 0.5);

// MAIN
updateStats();
next();

// FUNCTION DEFINITIONS

function pred(humanPredMalignant) {
    let aiPredictions = getAIPred();

    let benignProbability = aiPredictions["benign"];
    let malignantProbability = aiPredictions["malignant"];

    let aiPredMalignant = (malignantProbability > benignProbability);

    benignProbability = Math.round(10000 * benignProbability) / 100;
    malignantProbability = Math.round(10000 * malignantProbability) / 100;

    resultsMode();

    numTotal += 1;

    if (malignant) {
        groundTruthText.innerText = "Actual: Malignant";

        if (humanPredMalignant) {
            numCorrectHuman += 1;

            humanPredText.innerText = "Human: Predicted Malignant (True Positive)";
            humanPredText.style.color = "green";
        }
        else {
            humanPredText.innerText = "Human: Predicted Benign (False Negative)";
            humanPredText.style.color = "red";
        }

        if (aiPredMalignant) {
            numCorrectAI += 1;

            aiPredText.innerText = "AI: Predicted Malignant with " + malignantProbability.toString() + "% certainty (True Positive)";
            aiPredText.style.color = "green";
        }
        else {
            aiPredText.innerText = "AI: Predicted Benign with " + benignProbability.toString() + "% certainty (False Negative)";
            aiPredText.style.color = "red";
        }
    }
    else {
        groundTruthText.innerText = "Actual: Benign";

        if (humanPredMalignant) {
            humanPredText.innerText = "Human: Predicted Malignant (False Positive)";
            humanPredText.style.color = "red";
        }
        else {
            numCorrectHuman += 1;

            humanPredText.innerText = "Human: Predicted Benign (True Negative)";
            humanPredText.style.color = "green";
        }

        if (aiPredMalignant) {
            aiPredText.innerText = "AI: Predicted Malignant with " + malignantProbability.toString() + "% certainty (False Positive)";
            aiPredText.style.color = "red";
        }
        else {
            numCorrectAI += 1;

            aiPredText.innerText = "AI: Predicted Benign with " + benignProbability.toString() + "% certainty (True Negative)";
            aiPredText.style.color = "green";
        }
    }

    updateStats();
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
    if (malignant) {
        malignantIndex = (malignantIndex + 1) % numMalignant;
    }
    else {
        benignIndex = (benignIndex + 1) % numBenign;
    }

    malignant = (Math.random() > 0.5);

    let imagePath = "/static/images/";
    if (malignant) {
        imagePath += "malignant/" + (malignantIndex + 1).toString() + ".jpg";
    }
    else {
        imagePath += "benign/" + (benignIndex + 1).toString() + ".jpg";
    }

    moleImage.src = imagePath;

    predictMode();
}

function reset() {
    numCorrectHuman = 0;
    numCorrectAI = 0;
    numTotal = 0;

    var malignantIndex = Math.floor(Math.random() * numMalignant);
    var benignIndex = Math.floor(Math.random() * numBenign);

    var malignant = (Math.random() > 0.5);

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

function getAIPred() {
    let api_url = window.location.origin + "/api/predict/";
    if (malignant) {
        api_url += "malignant/" + malignantIndex.toString();
    }
    else {
        api_url += "benign/" + benignIndex.toString();
    }

    var json;

    $.ajax({
        url: api_url,
        dataType: "json",
        async: false,
        success: function(data){
            json = data;
        }
    })

    return json["predictions"];
}