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
                // option.setAttribute('id', category['id'])
                categorySelect.append(option)
            })
        })
    };
    
    document.addEventListener('submit', (event) => {
        //eventually add to database
        event.preventDefault();

        let form = event.target
        console.log(event.target.id)
        // console.log(form.category.value)
        // let startBtn = document.getElementById('game-start')
        // let loginBtn = document.getElementById('login-button')
        if(event.target.id === 'game-form')
        {
            console.log(event.target.id)
            let categoryId = form.category.value
            let difficulty = form.difficulty.value
            generateGame(categoryId, difficulty)
        }
        else if(event.target.id === 'login-form')
        {
            //login method
            //get userName from form
            let userName = form.user.value
            // console.log(userName)
            // login(userName)
            login(userName)
            console.log(event.target.id)
        }
    });

    function login(userName)
    {
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
        if(typeof question === 'undefined')
        {
            console.log('game over')
            //game over method
        }

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
        answerArr.forEach(ans => {
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
                    // console.log('correct!!!')
                    console.log(i);
                    i += 1; //increase
                    
                    score.innerText = `Score: ${i}`;
                    let leaderboard = document.getElementById('leaderboard')
                    let userId = leaderboard.lastElementChild.dataset.id
                    updateScore(i, userId)
                    let currentLi = leaderboard.lastElementChild
                    currentLi.innerText = `${currentLi.id} Score: ${i}`
                    getQuestion(res, i);
                }
                else
                {
                    console.log('cors error haha jk')
                }
            // console.log('game over');
        })
    };

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
    };
    
    getCategories()
//End of DOMContentLoaded
})