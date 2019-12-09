var current_tab = undefined
document.addEventListener("DOMContentLoaded", ()=>{
    Array.from(document.getElementsByClassName("tab_button")).forEach(button => {
        button.addEventListener("click", ()=>{display_tab(event, button.value)})
    })
    current_tab = document.querySelector(".tab_button").id
    console.log(current_tab)
    console.log(document.getElementsByClassName(current_tab))
    document.getElementsByClassName(current_tab)[0].style.display = "block"

})


function display_tab(event, animation){
    console.log("display_tab")
    if (event.currentTarget == current_tab){
        console.log("same tab")
        return
    }
    Array.from(document.getElementsByClassName(current_tab)).forEach(div => {
        console.log("found div with current tab")
        //div.className.replace(" current_tab", "")
        console.log(document.getElementById(current_tab).className)
        document.getElementById(current_tab).className = document.getElementById(current_tab).className.replace("tab_selected", "")
        console.log(document.getElementById(current_tab).className)
        div.style.display = "none"
    })
    console.log(event.currentTarget.value)
    current_tab = event.currentTarget.value
    Array.from(document.getElementsByClassName(current_tab)).forEach(div => {
        console.log("found div with target tab")
        //div.className += " current_tab"
        document.getElementById(current_tab).className += " tab_selected"
        div.style.display = "block"
    })
}
