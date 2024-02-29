
// State management
// TODO state on todo hetkeolukord
function render(state) {
    clearPage()
    buildLayout(slides[state.slide].layout)
    addContent(slides[state.slide].type, slides[state.slide].content)
    addProgress(state)
}

const initialState = { slide: 0 }

function getState() {
    return JSON.parse(localStorage.getItem("frameworkFree"))
}

// localstorage = database

function incrementSlide(state) {
    const slideUpdate = 
    state.slide < slides.length - 1 ? {
        slide: slides[state.slide].number + 1 
    } : { slide: 0 }

    localStorage.setItem("frameworkFree", JSON.stringify(Object.assign({}, state, slideUpdate)))

    return render(getState())
}