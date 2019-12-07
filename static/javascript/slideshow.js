var intervalID = undefined;
var slideIndex = 1;
var slide_sliding_in_progress = false;
var slide_fade_in_progress = false;
var slide_auto_ellipse = 10000;
var next_animation = undefined;
var slide_direction = true;
/*
window.onload = () => {
    const slide_container = document.querySelector("slides-container");

    const slide_container.style.background = slide_container.getAttribute('data-src');
}
*/
document.addEventListener('DOMContentLoaded',() => {
    setTimeout(load_deffered_images,0);
    document.getElementsByClassName("arrow-right")[0].onclick = () => {slide(false)}
    document.getElementsByClassName("arrow-left")[0].onclick = slide
    //load_deffered_images();


});

function slide(left = slide_direction){
    return new Promise((resolve, reject) =>{
        if(slide_fade_in_progress){
            reject("Already have animation in progress");
        }else if (slide_sliding_in_progress) {
            next_sliding = left
            resolve("next animation set")
        }else{
            slide_sliding_in_progress = true

            var slides = document.getElementsByClassName("slides_animation");
            const current_slide = slideIndex - 1;
            const __current_slide = slides[current_slide];

            var slide_index_log = slideIndex
            if(left){

                slideIndex++;
                if(slideIndex > slides.length){
                    slideIndex = 1;
                }
                var __next_slide = slides[slideIndex-1];
                __current_slide.style.animationName = "slide_left_out";
                __next_slide.style.animationName = "slide_left_in";
                slide_direction = true
            }else{

                slideIndex--
                if(slideIndex < 1){
                    slideIndex = slides.length;
                }
                var __next_slide = slides[slideIndex-1];

                __current_slide.style.animationName = "slide_right_out";
                __next_slide.style.animationName = "slide_right_in";
                slide_direction = false
            }
            update_slide_jumper(slideIndex-1,slide_index_log-1)

            __next_slide.style.display = "block";

            __current_slide.style.animationPlayState = 'running';
            __next_slide.style.animationPlayState = 'running';

            __current_slide.addEventListener('animationend', function reset_animation(){
                __current_slide.removeEventListener('animationend', reset_animation);
                __current_slide.style.display = "none";

                __current_slide.style.animationPlayState = 'paused';
                __next_slide.style.animationPlayState = 'paused';

                __current_slide.classList.remove('slides_animation');
                __next_slide.classList.remove('slides_animation');


                setTimeout(()=>{
                    __current_slide.classList.add('slides_animation');
                    __next_slide.classList.add('slides_animation');
                    slide_sliding_in_progress = false
                    if(next_sliding != undefined){
                        slide(next_sliding)
                        next_sliding = undefined
                    }
                }, 10);

            });
            resolve("Sucessfully started the animation");
        }


    })

}


function update_slide_jumper(n, slide_index_log = slideIndex-1){
    var jumper = document.getElementsByClassName("slide_jumper");
    jumper[slide_index_log].className = jumper[slide_index_log].className.replace("slide_jumper_selected", "");
    jumper[n].classList.add('slide_jumper_selected');
}

function showDivs(n) {
      return new Promise((resolve, reject) => {
          if(slide_fade_in_progress){
              reject("Sliding changing in progress")
          }else{
              clearInterval(intervalID);
              next_sliding = undefined



              var slides = document.getElementsByClassName("slides_animation");
              var next_slide = (n-1) % slides.length;

              update_slide_jumper(next_slide)

              slide_fade_in_progress = true
              fades_in(slides[slideIndex-1], slides[next_slide], ()=>{
                  slideIndex = next_slide+1;
                  //dots[slideIndex-1].className += " w3-white";
                  slide_fade_in_progress = false
                  intervalID = setInterval(slide, slide_auto_ellipse);
              }, 32 );
              resolve("Sucessfully started changing slide");
          }

      })


}

function load_deffered_images(){
        var images = document.querySelectorAll('img[data-src]');
        for(var i = 0; i < images.length; i++){
                load_deffered_image(images[i]);
        }
        slideIndex = 1;
        const placeholder = document.getElementsByClassName("slide-show-placeholder")[0];
        const first_image = document.querySelector('.slides_animation');
        slide_fade_in_progress = true
        update_slide_jumper(0)
        fades_in(placeholder, first_image, ()=>{
            intervalID = setInterval(slide, slide_auto_ellipse);
            slide_fade_in_progress = false
        });


}

function load_deffered_image(image){
        if(image.getAttribute('data-src')){
            image.setAttribute('src', image.getAttribute('data-src'));
            image.removeAttribute('data-src');
            image.addEventListener('load', function(){
                image.style.opacity = 1;
                /*
                var placeholder = image.previousElementSibling;
                placeholder.style.display = 'none';
                */
            });
    }
}

function fades_in(image_out, image_in, fun = ()=>{}, elapse = 64, init_opacity = true){

    return new Promise((resolve, reject) => {

        if(init_opacity){

            image_in.style.opacity = 0;
            image_out.style.opacity = 1;
        }
        image_in.style.display = "block";
        var tick = function () {
            image_in.style.opacity = Number(image_in.style.opacity) + 0.01;
            image_out.style.opacity = Number(image_out.style.opacity) - 0.01;
            if (image_in.style.opacity < 1 || image_out.style.opacity > 0) {
                setTimeout(tick, elapse);
            }else{
                image_out.style.display = "none";
                image_out.style.opacity = 1;
                fun();
            }
        };
        tick();
        resolve("Sucessfully started the animation");
    })
}
