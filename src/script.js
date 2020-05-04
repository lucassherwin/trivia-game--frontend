document.addEventListener('DOMContentLoaded', () => {

    function getCategories() {
        fetch('https://opentdb.com/api_category.php')
        .then(response => response.json())
        .then(data => {
            console.log(data)
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
        console.log(question['question']) 
    };
    
    getCategories()
//End of DOMContentLoaded
})