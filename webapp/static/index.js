const menuIconButton = document.querySelector('[data-menu-icon-btn]')
const sidebar = document.querySelector("[data-sidebar]")
document.addEventListener("click", e => {
   let handle
   if(e.target.matches(".handle")){
    handle = e.target
   } else {
    handle = e.target.closest(".handle")
   }
   if(handle != null) onHandleClick(handle)
 
})


const throttleBar = checkThrottle(() => {
    document.querySelectorAll(".progress-bar").forEach(progressInBar)
}, 250)

window.addEventListener('resize', throttleBar
)

document.querySelectorAll(".progress-bar").forEach(progressInBar)

function progressInBar(progressBar){
    progressBar.innerHTML = ""
    const slider = progressBar.closest(".row").querySelector(".slider")
    const itemCount = slider.children.length
    const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue("--items-per-screen"))
    const ProgressBarItemCount = Math.ceil(itemCount / itemsPerScreen)
    let sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue('--slider-index'))

    if(sliderIndex >= ProgressBarItemCount){
        slider.style.setProperty("--slider-index", ProgressBarItemCount -1)
        sliderIndex = ProgressBarItemCount - 1
    }


    for(let i = 0; i< ProgressBarItemCount; i++){
        const barItem = document.createElement('div')
        barItem.classList.add("progress-item")
        if(i === sliderIndex){
            barItem.classList.add("active")
        }
        progressBar.append(barItem)
    }
}

function onHandleClick(handle){
    const progressBar = handle.closest(".row").querySelector(".progress-bar")
    const slider = handle.closest(".container").querySelector(".slider")
    const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--slider-index")
    )
    const itemCount = slider.children.length
    const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue("--items-per-screen"))
    const ProgressBarItemCount = Math.ceil(itemCount / itemsPerScreen)

    if(handle.classList.contains("left-handle")){
        if(sliderIndex - 1 < 0){
            slider.style.setProperty("--slider-index", ProgressBarItemCount -1)
            progressBar.children[sliderIndex].classList.remove('active')
            progressBar.children[ProgressBarItemCount -1].classList.add("active")
        } else {
        slider.style.setProperty('--slider-index', sliderIndex - 1)
        progressBar.children[sliderIndex].classList.remove('active')
        progressBar.children[sliderIndex -1].classList.add("active")
        }
    }
   
    if(handle.classList.contains("right-handle")){
        if(sliderIndex + 1 >= ProgressBarItemCount){
            slider.style.setProperty("--slider-index", 0)
            progressBar.children[sliderIndex].classList.remove('active')
            progressBar.children[0].classList.add("active")
        } else {
        slider.style.setProperty("--slider-index", sliderIndex + 1)
        progressBar.children[sliderIndex].classList.remove('active')
        progressBar.children[sliderIndex +1].classList.add("active")
        }
    }
}


function checkThrottle(cb, delay = 1000){
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null){
            shouldWait = false
        } else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
        }
    }

    return(...args)=>{
        if(shouldWait){
            waitingArgs = args
            return
        }

        cb(...args)
        shouldWait = true
        setTimeout(timeoutFunc, delay)
    }
}



menuIconButton.addEventListener("click", ()=>{
    sidebar.classList.toggle("open")
})

function searchFood(query){
    const apiKey = '&apiKey=562382aaab84443dbc1270bd67c313a7'
    const url = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&number=5&metaInformation=true${apiKey}`
    fetch(url)
    .then(response => response.json())
    .then((jsonData) => {
        renderResults(jsonData)
    });
}

function renderResults(data){
    const list = document.getElementById('search-results')
    list.innerHTML = ""
    data.forEach( item => {
        let name = item.name
        let units = item.possibleUnits
        units.push('ml', 'l')
        const food_items_form = document.createElement('form')
        food_items_form.method = 'POST'
        const food_items = document.createElement("div")
        food_items.classList.add('food-item')
        const food_title = document.createElement("div")
        food_title.classList.add('food-item-title')
        food_title.id = 'food_title'
        const food_item_text = document.createElement('input')
        food_item_text.type='text'
        food_item_text.id = 'food_title'
        food_item_text.name = 'food_title'
        food_item_text.placeholder='food_title'
        food_item_text.value = name
        // food_item_text.disabled = 'true'
        food_item_text.classList.add('food_item_text')
        const food_item_amount = document.createElement('div')
        food_item_amount.classList.add('food-item-amount')
        const label = document.createElement('label')
        const labelSelect = document.createElement('label')
        label.innerHTML = 'Enter Amount'
        const inputAmount = document.createElement('input')
        inputAmount.type='number'
        inputAmount.id='amount'
        inputAmount.name='amount'
        const select = document.createElement('select')
        labelSelect.innerHTML = 'Unit'
        select.id = "unit"
        select.name = "unit"
        select.classList.add('select-amount')
        for (var i = 0; i < units.length; i++){
            var option = document.createElement("option")
            option.value = units[i]
            option.text = units[i]
            select.appendChild(option)
        }

        const label2 = document.createElement('label')
        label2.for = 'expiry'
        label2.innerHTML = 'Add Expiry Date'
        const food_item_expiry = document.createElement('div')
        food_item_expiry.classList.add('food-item-expiry')
        food_item_expiry.id = 'expiry'
        const add_expiry = document.createElement('input')
        add_expiry.type = 'date'
        add_expiry.id = 'add-expiry'
        add_expiry.name = 'expiry'

        const add_food_button = document.createElement('button')
        add_food_button.classList.add('add_button')
        add_food_button.type = 'submit'
        add_food_button.innerHTML = 'Add'

        
        food_title.appendChild(food_item_text)
        food_item_amount.appendChild(label)
        food_item_amount.appendChild(inputAmount)
        food_item_amount.appendChild(labelSelect)
        food_item_amount.appendChild(select)
        food_item_expiry.appendChild(label2)
        food_item_expiry.appendChild(add_expiry)
        food_items.appendChild(food_title)
        food_items.appendChild(food_item_amount)
        food_items.appendChild(food_item_expiry)
        food_items.appendChild(add_food_button)
        
        food_items_form.appendChild(food_items)
        console.log(food_item_text.value)

        list.appendChild(food_items_form)
    })
}

function extractItem(string){
    let query
    if(string.search("chicken") > 1)
    {
        query = 'chicken'
        getRecipes(query)
        
    }else {
        getRecipes(string)
        
    }
}

let recommendedRecipes = []

async function getRecipes(recipeQueries){

    const url = `https://api.spoonacular.com/recipes/complexSearch?instructionsRequired=true&number=10&query=${recipeQueries}&apiKey=562382aaab84443dbc1270bd67c313a7`
    

    const response = await fetch(url)
    const data = await response.json();

    if(data.results.length > 0){
        recommendedRecipes.push(data.results)
    }

    if(recommendedRecipes.length >= 0){
        console.log(recommendedRecipes)
        renderSlider()
    }

    

}

function renderSlider(){
    let sliderArray = []
    for (i=0; i<recommendedRecipes.length; i++){
        recommendedRecipes[i].forEach(item => {
            console.log(sliderArray)
            sliderArray.push(item)
        })
    }

    if(sliderArray.length < 12){
        arrayLength = sliderArray.length
        let difference = 12 - arrayLength
        for(x = 0; x<arrayLength; x++){
            let generatedHTML = '';
            generatedHTML +=
       
       
        `
        <div class="recipe-image">
                    <img src="${sliderArray[x].image}" alt="" class="recpie-img">
                </div>
                <div class="recipe-info">
                    <div class="recipe-title">
                    ${sliderArray[x].title}
                    </div>
                </div>
        `
        const sliderElement = document.getElementById('slider_element_' + x)
        sliderElement.innerHTML = generatedHTML
        sliderElement.id = sliderArray[x].id  
        } 
        for(y = 0; y < difference; y++){
            let index = y + arrayLength
            let generatedHTML = '';
            generatedHTML +=
       
       
        `
        <div class="recipe-image">
                    <img src="${sliderArray[y].image}" alt="" class="recpie-img">
                </div>
                <div class="recipe-info">
                    <div class="recipe-title">
                    ${sliderArray[y].title}
                    </div>
                </div>
        `
        const sliderElement = document.getElementById('slider_element_' + index)
        sliderElement.innerHTML = generatedHTML
        sliderElement.id = sliderArray[y].id
        }
    } else {
    for(x = 0; x<12; x++){
        console.log(sliderArray[x])
        let generatedHTML = '';
        generatedHTML +=
       
       
        `
        <div class="recipe-image">
                    <img src="${sliderArray[x].image}" alt="" class="recpie-img">
                </div>
                <div class="recipe-info">
                    <div class="recipe-title">
                    ${sliderArray[x].title}
                    </div>
                </div>
        `
        const sliderElement = document.getElementById('slider_element_' + x)
        sliderElement.innerHTML = generatedHTML   
        sliderElement = sliderArray[x].id
        }  
    }   
}





const RecipeArray = []

function searchRecipes(query){
    const apiKey = '&apiKey=3e6f92f2a2dc48c2a6ecb37e0f81d171'
    const url = `https://api.spoonacular.com/recipes/complexSearch?instructionsRequired=true&number=1&query=${query}${apiKey}`
    const food_item_column = document.getElementById('food_item_column')
    const childDivs = food_item_column.getElementsByTagName('div')
    const childDivLen = childDivs.length
    fetch(url)
    .then(response => response.json())
    .then((jsonData) => {
    
        const recipe = jsonData.results
       
        RecipeArray.push(query, recipe)
        
        
        if(RecipeArray.length/2 == childDivLen - 1){
            console.log(RecipeArray)
            console.log(childDivLen)
            renderRecipe()
        }
    })
}

function renderRecipe(){

    const food_item_column = document.getElementById('food_item_column')
    const childDivs = food_item_column.getElementsByTagName('div')

    for(i = 1; i < childDivs.length; i++){
        var childDiv = childDivs[i]
        var childDivTitle = childDiv.innerHTML
        for(x = 0; x < RecipeArray.length; x++){
            if(RecipeArray[x] == childDivTitle){
                let recipe_number = x + 1
                let recipe = RecipeArray[recipe_number]
                let recipe_title = recipe[0].title
                let recipe_id = recipe[0].id
                let title_element = document.getElementById('example_recipe'+i)
                let open_recipe = document.getElementById('open_recipe' +i)
                open_recipe.id = recipe_id
                title_element.innerHTML = recipe_title
            }
        }
        
    }
}



