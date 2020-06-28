`use strict`;

STORE.currentRender = 0;
STORE.score = 0;

function startButton (){
  $('.start').on('click', e => {
    e.preventDefault();
    renderQuestions();
  });
}

function renderQuizData(){
  const dataHtml = $(`
  <li class='quiz-data'>Score: ${STORE.score}/${STORE.questions.length}</li>
  <li class='question-count'>Quiz Progress: ${STORE.currentRender + 1}/${STORE.questions.length}</li>
  `);
  $(".score-data").html(dataHtml);
}

function renderChoices() {
  let question = STORE.questions[STORE.currentRender];
  for(let i=0; i < question.choices.length; i++)
  {
    $('.choice-field').append(`
        <input type = "radio" name="choices" value= "${question.choices[i]}" tabindex ="${i+1}"> 
        <label for="choice${i+1}"> ${question.choices[i]}</label> <p class='form break'></p>
        <span id="js-r${i+1}"></span>
    `);
  }
  $('.form-break').html(`<form></form>`);
}

function renderQuestions () {
  let question = STORE.questions[STORE.currentRender];
  renderQuizData();
  let questionFormHtml = (`
  <legend>${question.question}</legend>
  <p class='choice-field'></p>
  <p class='right-or-wrong'></p>
  <button type = "submit" id="submission">That's my final answer!</button>
  <button type = "button" id="next-question">On to the next question!</button>
  `);
  $('.quizForm').html(questionFormHtml);
  renderChoices();
  $('#next-question').hide();
}

function renderResults(){
  $('.question-count').hide();
    let quizResultsHtml = $(
    `<div class="results">
	    <div class='results-img'></div>
	      <legend class='results-score'>Your Score is: ${STORE.score}/${STORE.questions.length}</legend>
      	<p class='results-message'></p>
	    <button type="button" id="restart-quiz">Restart Quiz</button>
    </div>`);
  $(".quizForm").html(quizResultsHtml);
  if (STORE.score <= 3){
    $('.results-img').html(`<img src='imgs/wrong.jpg' alt="'counterspell' card art, showing a wizard who failed to cast a spell">`);
    $('.results-message').text(`Better luck next time! Go play some Magic and brush up on the game, then come back!`);
  } else {
    $('.results-img').html(`<img src='imgs/right.jpg' alt="'gallia of the endless dance' card art, showing a satyr celebrating and grabbing another satyr's head">`);
    $('.results-message').text(`You nerd! Great job! Wanna join my playgroup?`);
  }
  STORE.currentRender = 0;
  STORE.score = 0;
}

function determineRenderResultsOrRenderQuestion (){
  $('form').on('click','#next-question', e => {
    STORE.currentRender === STORE.questions.length?renderResults() : renderQuestions();
  });
  //this will bring the user to the next question OR the quizResults screen if there are no more questions to be answered in the quiz
  //if else statement will be used
  //STORE.currentRender === STORE.questions.length
}

function checkAnswers (){
  $('#quizForm').on('submit', e => {
    e.preventDefault();
    let response = $("input[name=choices]:checked").val();
    let currentQ = STORE.questions[STORE.currentRender];
    if (!response){
      alert("You must select a response before you can proceed!");
      return;
    }
   if (response === currentQ.answer){
     STORE.score++;
     $('.right-or-wrong').html(`Correct! Good job planeswalker!`);
   }else {
     $('.right-or-wrong').html(`Wrong! <br> The correct answer is "${currentQ.answer}"`);
   }

    STORE.currentRender++;
    $(".quiz-data").text(`Score: ${STORE.score}/${STORE.questions.length}`);
    $('#submission').hide();
    $("input[type=radio]").attr('disabled', true);
    $('#next-question').show();
   });
  }
  //this will display a message telling the user whether they got the question right or wrong, and if it is wrong, it will tell them the right answer
function restartButton(){
  $('fieldset').on('click','#restart-quiz', (event) => {
   $('.question-count').hide();
   renderQuestions();
  });
}

function quizStarter(){
  startButton ();
  checkAnswers ();
  determineRenderResultsOrRenderQuestion ();
  restartButton ();
}

$(quizStarter);
