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
        // console.log(form.category.value)
        let categoryId = form.category.value
        let difficulty = form.difficulty.value

        generateGame(categoryId, difficulty)
    });
    
    //call this on event listener
    function generateGame(categoryId, difficulty) {
        fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            let results = data['results']
            // console.log(results)
            getQuestion(results, 0)
        })
    };

    function getQuestion(results, index) {
        let res = results;
        let i = index
        let question = results[i]
        console.log(question)

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

        choicesText.addEventListener('click', event => {
            event.preventDefault();
            // console.log(event.target);
            if(event.target.innerText === correctAnswer)
            {
                // console.log('correct!!!')
                i += 1 //increase
                getQuestion(res, i);
            }
            else{
                console.log('cors error haha jk')
            }
        })
    };
    
    getCategories()
//End of DOMContentLoaded
})