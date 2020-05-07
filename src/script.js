document.addEventListener('DOMContentLoaded', () => {
    function getCategories() {
        fetch('https://opentdb.com/api_category.php')
        .then(response => response.json())
        .then(data => {
            data['trivia_categories'].forEach(category => {
                const categorySelect = document.getElementById('category')
                let option = document.createElement('option')
                option.value = category['id']
                option.textContent = category['name']
                option.dataset.id = category['id']
                categorySelect.append(option)
            })
        })
    };
    
    document.addEventListener('submit', (event) => {
        event.preventDefault();

        let form = event.target
        if(event.target.id === 'game-form')
        {
            let categoryId = form.category.value
            let difficulty = form.difficulty.value
            generateGame(categoryId, difficulty)
        }
        else if(event.target.id === 'login-form')
        {
            let userName = form.user.value
            login(userName)
            form.reset()
        }
    });
    let currentScore;
    function login(userName)
    {
        document.getElementById('leaderboard').innerText = '';
        getUsers()
        document.getElementById('score').innerText = 'Score: ' //this resets the score on the DOM when a new user logs in
        currentScore = 0;
        let userObj = {name: userName, score: currentScore}

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(userObj)
        })
        .then(resp => resp.json())
        .then(user => {
            console.log(user)
            let leaderboard = document.getElementById('leaderboard')
            let li = document.createElement('li')
            li.dataset.id = user.id
            li.id = user.name
            li.textContent = user.name 
            leaderboard.append(li)
        })
    };

    function getUsers() {
        let userArray = [];
        fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
                users.sort(function(a, b) {
                    return b.score - a.score;
                })
                let leaderboard = document.getElementById('leaderboard')
                users.forEach(user => {
                    let li = document.createElement('li')
                    li.dataset.id = user.id
                    li.id = user.name
                    li.textContent = `${user.name} Score: ${user.score}`
                    leaderboard.append(li)
                // console.log(users)
            })
        })
    }
    
    //call this on event listener
    let index;
    let results;
    function generateGame(categoryId, difficulty) {
        fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            results = data['results']
            // console.log(results);
            index = 0;
            getQuestion(results, index) //results -> array of all the question objects
        })
    };

    let correctAnswer; //gets assigned in getQuestion
    //should get reassigned each time getQuestion is called to the correct value

    function getQuestion(results, index) {
        // let res = results; //all question objects
        //dont need res becuase using the parameter works
        let i = index
        // console.log(i);
        let question = results[i]
        
        console.log(question) //question object

        let answerArr = []

        //put question text on the screen
        let questionText = document.getElementById('question-text')
        questionText.innerText = question['question']
        
        //save correct answer to the array
        correctAnswer = question['correct_answer']
        answerArr.push(correctAnswer)

        //add the incorrect answers to the array
        question['incorrect_answers'].forEach(q => {
            answerArr.push(q)
        })

        //remove the buttons with the choices -> for reset
        let choicesText = document.getElementById('choices')
        choicesText.innerText = ''  //this works as of may 4 15:57
        
        //shuffle the answers
        let shuffledArray = shuffleArray(answerArr)
        showAnswers(shuffledArray)
    };

    function showAnswers(shuffledArray)
    {
        let choicesText = document.getElementById('choices')
        // let index = i;
        //add each button answer to the DOM
        shuffledArray.forEach(ans => {
            let ansBtn = document.createElement('button')
            ansBtn.className = 'button'
            ansBtn.textContent = ans
            choicesText.appendChild(ansBtn)
        })
    }

    let score = document.getElementById('score');
    let choicesText = document.getElementById('choices')
    choicesText.addEventListener('click', event => {
        event.preventDefault();
        // console.log(event.target)
        let choice = event.target.innerText;

        checkAnswer(choice, correctAnswer)
    })

    function checkAnswer(choice, correctAnswer)
    {
        if(choice === correctAnswer)
        {
            console.log('correct');
            index += 1; //increase
            currentScore += 1;
            score.innerText = `Score: ${currentScore}`;
            let leaderboard = document.getElementById('leaderboard')
            let userId = leaderboard.lastElementChild.dataset.id
            updateScore(currentScore, userId)
            let currentLi = leaderboard.lastElementChild
            currentLi.innerText = `${currentLi.id} Score: ${currentScore}`
            if (index === 10){
                let questionArea = document.getElementById('question-text')
                let answerChoices = document.getElementById('choices')
                questionArea.innerText = ''  
                answerChoices.innerHTML = ''
                // let gameOverMessage = document.getElementById('exampleModal1');
                // gameOverMessage.removeAttribute('hidden');
            }
            // console.log(res)
            console.log(index)
            getQuestion(results, index);
        }
        else
        {
            console.log('incorrect');
            index += 1;
            if(index === 10)
            {
                let questionArea = document.getElementById('question-text')
                let answerChoices = document.getElementById('choices')
                questionArea.innerText = ''  
                answerChoices.innerHTML = ''
                // let gameOverMessage = document.getElementById('exampleModal1');
                // gameOverMessage.removeAttribute('hidden');

            }
            getQuestion(results, index)
        }
    }    

    function updateScore(score, user){
        fetch(`http://localhost:3000/users/${user}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                score: score
            })
        })
        .then(response => response.json())
        // .then(console.log)
        .then()
    };

    function shuffleArray(array){ // this will shuffle the answers, added without Lucas
        for (let i = array.length -1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1))
            let temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    };
    
    getCategories()
//end of DOMContentLoaded
})

/*
What I did to fix the issue:
Made a checkAnswer method and moved it outside of the eventListener
I think that this was part of the issue
Also made results and index global variables so that they could be accessed anywhere
They are needed in several functions that are not connected
Cleaned up parts of code and added lots of comments to diagnose the issue
Not 100% sure why it was doing that but it works correctly now
*/