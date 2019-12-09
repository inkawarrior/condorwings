document.addEventListener("DOMContentLoaded", ()=>{
    var editor_mod = localStorage.getItem('editor')
    if(editor_mod){
        document.getElementById("edit_tool_bar").style.display = "block";
    }
})

/*
document.addEventListener('DOMContentLoaded', ()=>{
    var header = document.querySelector('header');
    var style=window.getComputedStyle(header,"");
    var bgColor=style.getPropertyValue("background-color");
    //console.log(bgColor);
    rgb = from_rgb(bgColor);
    //console.log(rgb);
    header.style.backgroundColor = rgba(rgb[0],rgb[1],rgb[2], 0.5);
});
*/
function from_rgb(str){
    color=str.substring(str.indexOf('(')+1, str.indexOf(')'));
    rgbColors=color.split(',', 3);
    //console.log(rgbColors);
    //console.log(parseInt(rgbColors[1]));
    var result = rgbColors.map( c =>{
        return parseInt(c, 10);
    });

    return result;
}

function rgba(r, g, b, a){
    return "rgba("+r+","+g+","+b+","+a+")";
}
