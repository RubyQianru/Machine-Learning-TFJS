let questionIndex = 0;
let questions = [];

async function fetchQuestion() {			
    try {
        const response = await fetch('https://qz2432.itp.io/questions');
        const data = await response.json(); 

        questions = data.data.map(item => ({
            question: item.title,
            instruction: item.instruction,
            symbol: item.symbol
        }));
        updateQuestion(0);
        
    } catch(err) {
        console.log(err)
    }
}

function updateQuestion(count) {
    const title = document.getElementById("title");
    const instruction = document.getElementById("instruction");

    title.innerText = questions[questionIndex].question ;
    instruction.innerText = questions[questionIndex].instruction + count;
}