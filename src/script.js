document.addEventListener('DOMContentLoaded', () => {

    function getCategories() {
        fetch('https://opentdb.com/api_category.php')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data['trivia_categories'].forEach(category => {
                const categorySelect = document.getElementById('category')
                let option = document.createElement('option')
                option.value = category['name']
                option.textContent = category['name']   
                categorySelect.append(option)
            })
        })
    };

    document.addEventListener('submit', (event) => {
        //eventually add to database
        let form = event.target
        let categoryId = form.category.value.id
        let difficulty = form.difficulty.value
        console.log(categoryId)
        console.log(difficulty)
    });
    
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
        let i = index
        let question = results[i]
        console.log(question)
        console.log(question['question']) 
    };
    
    
    
   
    generateGame()
    getCategories()
//End of DOMContentLoaded
})