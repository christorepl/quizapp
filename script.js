`use strict`;

STORE.currentRender = 0;

function startButton() {
    $('.start').on('click', e => {
        e.preventDefault();
        renderQuestions();
    });
}

function renderQuizData() {
    var htmlText = scoreHtmlTemplate(STORE.score, STORE.questions.length, STORE.currentRender);
    $(".score-data").html(htmlText);
}

function scoreHtmlTemplate(score, questionsLength, currentRender) {
    return `
 <li class='quiz-data'>Score: ${score}/${questionsLength}</li>
 <li class='question-count'>Quiz Progress: ${currentRender + 1}/${questionsLength}</li>
 `;
}

function renderChoices() {
    let question = STORE.questions[STORE.currentRender];
    for (let i = 0; i < question.choices.length; i++) {
        let questionChoicesLoop = question.choices[i];
        let choicesIndex = i + 1;
        let choicesHtml = renderChoicesTemplate(questionChoicesLoop, choicesIndex);
        $('.choice-field').append(choicesHtml);
    }
}

function renderChoicesTemplate(questionChoices, index) {
    return `
  <input type = "radio" id = "choice${index}" name="choices" value= "${questionChoices}" tabindex ="${index}"> 
  <label for="choice${index}"> ${questionChoices}</label> <p class='form break'></p>
  <span id="js-r${index}"></span>
  `;
}

function renderQuestions() {
    let questionIndex = STORE.questions[STORE.currentRender];
    renderQuizData();
    let questionFormHtml = questionsHtmlTemplate(questionIndex);
    $('.quizForm').html(questionFormHtml);
    renderChoices();
    $('#next-question').hide();
}

function questionsHtmlTemplate(question) {
    return `<legend>${question.question}</legend>
  <p class='choice-field'></p>
  <p class='right-or-wrong'></p>
  <button type = "submit" id="submission">That's my final answer!</button>
  <button type = "button" id="next-question">Next!</button>
  `;
}

function renderResultsHtml() {
    return `<div class="results">
	    <div class='results-img'></div>
	      <legend class='results-score'>Your Score is: ${STORE.score}/${STORE.questions.length}</legend>
      	<p class='results-message'></p>
	    <button type="button" id="restart-quiz" label="restart-quiz">Restart Quiz</button>
    </div>
    `;
}

function renderResults() {
    let resultsHtml = renderResultsHtml();
    $(".quizForm").html(resultsHtml);
}

function deteremineResultsImg() {
    if (STORE.score <= 3) {
        renderFailureHtml() || renderFailureMsg();
    } else {
        renderCongratsHtml() || renderCongratsMsg();
    }
}

function renderFailureHtml() {
    let renderedFailure = renderFailure();
    $('.results-img').html(renderedFailureTemplate);
}

function renderFailureTemplate() {
    return `<img src='imgs/wrong.jpg' alt="'counterspell' card art, showing a wizard who failed to cast a spell">
  `;
}

function renderFailureMsg() {
    $('.results-message').text(`Better luck next time! Go play some Magic and brush up on the game, then come back!`);
}

function renderCongratsHtml() {
    let congratsHtml = renderCongratsTemplate();
    $('.results-img').html(congratsHtml);
}

function renderCongratsTemplate() {
    return `<img src='imgs/right.jpg' alt="'gallia of the endless dance' card art, showing a satyr celebrating and grabbing another satyr's head">
  `;
}

function renderCongratsMsg() {
    $('.results-message').text(`You nerd! Great job! Wanna join my playgroup?`);
}

function restartQuizData() {
    $('.question-count').hide();
    STORE.currentRender = 0;
    STORE.score = 0;
}

function determineRenderResultsOrRenderQuestion() {
    $('form').on('click', '#next-question', e => {
        STORE.currentRender === STORE.questions.length ? renderResults() || deteremineResultsImg() || restartQuizData() : renderQuestions();
    });
}

function checkAnswers() {
    $('#quizForm').on('submit', e => {
        e.preventDefault();
        let response = $("input[name=choices]:checked").val();
        let currentQ = STORE.questions[STORE.currentRender];
        if (!response) {
            alert("You must select a response before you can proceed!");
            return;
        }
        if (response === currentQ.answer) {
            STORE.score++;
            let correct = correctAnswerTemplate();
            $('.right-or-wrong').html(correct);
        } else {
            let wrong = wrongAnswerTemplate(currentQ.answer);
            $('.right-or-wrong').html(wrong);
        }
        STORE.currentRender++;
        $(".quiz-data").text(`Score: ${STORE.score}/${STORE.questions.length}`);
        $('#submission').hide();
        $("input[type=radio]").attr('disabled', true);
        $('#next-question').show();
    });
}

function correctAnswerTemplate() {
    return `Correct! Good job planeswalker!
  `;
}

function wrongAnswerTemplate(answer) {
    return `Wrong! <br> The correct answer is "${answer}"
  `;
}

function restartButton() {
    $('fieldset').on('click', '#restart-quiz', (event) => {
        $('.question-count').hide();
        renderQuestions();
    });
}

function quizStarter() {
    startButton();
    checkAnswers();
    determineRenderResultsOrRenderQuestion();
    restartButton();
}

$(quizStarter);
