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

    function login(userName)
    {
        getUsers()
        let userObj = {name: userName}

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
            let leaderboard = document.getElementById('leaderboard')
            let li = document.createElement('li')
            li.dataset.id = user.id
            li.id = user.name
            li.textContent = user.name 
            leaderboard.append(li)
        })
    };

    function getUsers() {
        fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            let leaderboard = document.getElementById('leaderboard')
            users.forEach(user => {
                let li = document.createElement('li')
                li.dataset.id = user.id
                li.id = user.name
                li.textContent = `${user.name} Score: ${user.score}`
                leaderboard.append(li)
            })
        })
    }
    
    //call this on event listener
    function generateGame(categoryId, difficulty) {
        fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            let results = data['results']
            getQuestion(results, 0)
        })
    };

    function getQuestion(results, index) {
        let res = results;
        let i = index
        let question = results[i]
        console.log(question)
        // if(typeof question === 'undefined')
        // {
        //     console.log('game over')
        //     //game over method
        // }

        let answerArr = []
        let questionText = document.getElementById('question-text')
        questionText.innerText = question['question']

        let choicesText = document.getElementById('choices')
        let correctAnswer = question['correct_answer']
        answerArr.push(correctAnswer)

        question['incorrect_answers'].forEach(q => {
            answerArr.push(q)
        })
        choicesText.innerText = ''  //this works as of may 4 15:57
        let shuffledArray = shuffleArray(answerArr)
        showQuestion(shuffledArray, res, i, correctAnswer)
    };

    function showQuestion(shuffledArray, res, i, correctAnswer){
        let choicesText = document.getElementById('choices')
        shuffledArray.forEach(ans => {
            let ansBtn = document.createElement('button')
            ansBtn.className = 'answer-button'
            ansBtn.textContent = ans
            choicesText.appendChild(ansBtn)
        })
        let score = document.getElementById('score');
        choicesText.addEventListener('click', event => {
            event.preventDefault();
            // console.log(event.target)
                if(event.target.innerText === correctAnswer)
                {
                    console.log('if')
                    // console.log(`Correct ${event.target.innerText}`)
                    // console.log(i);
                    i += 1; //increase
                    let currentScore = i
                    score.innerText = `Score: ${currentScore}`;
                    let leaderboard = document.getElementById('leaderboard')
                    let userId = leaderboard.lastElementChild.dataset.id
                    updateScore(currentScore, userId)
                    let currentLi = leaderboard.lastElementChild
                    currentLi.innerText = `${currentLi.id} Score: ${currentScore}`
                    if (i === 10){
                      let questionArea = document.getElementById('question-text')
                      let answerChoices = document.getElementById('choices')
                      questionArea.innerText = ''  
                      answerChoices.innerHTML = ''
                    }
                    console.log(res)
                    console.log(i)
                    getQuestion(res, i);
                } else if (event.target.innerText !== correctAnswer){
                    console.log('else if')
                    i += 1
                    if (i === 10){
                        let questionArea = document.getElementById('question-text')
                        let answerChoices = document.getElementById('choices')
                        questionArea.innerText = ''  
                        answerChoices.innerHTML = ''
                      }
                    // console.log(`Incorrect ${event.target.innerText}`)
                    getQuestion(res, i)
                    // console.log(i)
                }
                // else
                // {
                //     console.log('cors error haha jk')
                // }
            // console.log('game over');
        })
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
        .then(console.log)
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
//End of DOMContentLoaded
})