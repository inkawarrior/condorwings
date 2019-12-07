document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementsByClassName("block_slider")[0].onmousedown = drag
    update_block_slide_width()
})

var last_pos = false
function drag(event){
        //console.log("start drag")
        if(last_pos === false){
            //console.log("register first point")
            last_pos = event.pageX
        }

        window.addEventListener('mousemove', drag_move)
        window.addEventListener('mouseup', function drag_end(){
            //console.log("mousemove event deleted")
            last_pos = false
            window.removeEventListener('mousemove', drag_move)
            window.removeEventListener('mouseup', drag_end)
            const w = window.innerWidth;
            const block_container = document.getElementsByClassName("block_slider")[0]
            const block_style = window.getComputedStyle(block_container)
            const left = parseInt(block_style.left.substring(0, block_style.getPropertyValue('left').indexOf('p')))
            const buffer = 400;
            var rect = block_container.getBoundingClientRect();
            if(rect.right < w+buffer){
                const diff = w+buffer - rect.right
                var count = 10

                var tick1 = function(){
                    if(count < diff){
                        count+=10
                        block_container.style.left = (left + count).toString()+"px";
                        setTimeout(tick1,16)
                    }
                }
                tick1()
            }else if (rect.left > -buffer) {
                const diff = rect.left +buffer
                var count = 10
                var tick2 = function(){
                    if(count < diff){
                        //console.log((deltaX + x).toString()+"px")
                        block_container.style.left = (left - count).toString()+"px";
                        count+=10
                        setTimeout(tick2,16)
                    }
                }
                tick2()
            }
        })
}

function drag_move(e){
    const w = window.innerWidth;

    const block_container = document.getElementsByClassName("block_slider")[0]
    var block_style = window.getComputedStyle(block_container)
    const width = block_style.getPropertyValue('width')

    //console.log("mousemove detected")

    const deltaX = e.pageX - last_pos
    //console.log(deltaX)

    const x = parseInt(block_style.left.substring(0, block_style.left.indexOf('p')))

    //console.log("blockleft, x, w, width")
    //console.log(block_style.left, x, w, width)
    block_container.style.left = (deltaX + x).toString()+"px";
    //console.log((deltaX + x).toString()+"px")

    /*
    if(deltaX > 0 && rect.right - deltaX < w){
        console.log("case 1 ")
        console.log((w-width).toString()+"px")
        block_container.style.left = (w-width).toString()+"px";

    }else if (deltaX < 0 && rect.left - deltaX > 0) {
        console.log("case 2 ")
        block_container.style.left = 0;
    }else{
        console.log("case 3 ")
        block_container.style.left = (deltaX + x).toString()+"px";
        console.log((deltaX + x).toString()+"px")
    }
    */
    last_pos = e.pageX
}


function update_block_slide_width(){
    const block_container = document.getElementsByClassName("block_slider")[0]
    const childNumber = block_container.childElementCount;
    //console.log(childNumber)
    const block = document.querySelector(".block")
    var block_style = window.getComputedStyle(block)

    const block_width = 2*parseInt(block_style.getPropertyValue('margin').substring(0, block_style.getPropertyValue('margin').indexOf('p')))
                + parseInt(block_style.getPropertyValue('width').substring(0, block_style.getPropertyValue('width').indexOf('p')))
    //console.log((block_width*childNumber + block_slider_padding_left + block_slider_padding_right))
    block_container.style.width = (block_width*childNumber /*+ block_slider_padding_left + block_slider_padding_right*/).toString() + "px"
    //console.log(block_container.style.width)
}
