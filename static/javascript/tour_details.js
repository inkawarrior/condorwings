var current_tab = undefined

$(document).ready(function() {
    get_available_symbols((available_symbols)=>{

        $("#input").autocomplete({
            minLength: 0,
            source: available_symbols,

            select: (event, ui)=>{
                localStorage.setItem('currency', ui.item.value);
                get_exchange_rate(ui.item.value)
                setTimeout(()=>{document.querySelector(".currency_form_popup").style.display = "none"}, 0)
                $("#input").val("")
                return false;
            },
            appendTo: $("#currency_drop_down")
            /*
            select: function (event, ui) {
                var label = ui.item.label;
                var value = ui.item.value;*/
               //store in session
          //document.valueSelectedForAutocomplete = value
        }).bind('focus', function(){
                $(this).autocomplete("search");

            } );

        jQuery.ui.autocomplete.prototype._resizeMenu = function () {
          var ul = this.menu.element;
          ul.outerWidth(this.element.outerWidth()+200);
        }
    })
});



document.addEventListener('DOMContentLoaded', () => {

    set_body_height()
    document.getElementById("currency_exchange").onclick = () => {
        const popup = document.querySelector(".currency_form_popup")
        if(window.getComputedStyle(popup).getPropertyValue("display") == "none")
            popup.style.display = "block";
        else {

            popup.style.display = "none";

        }
    }
    window.onresize = set_body_height

    Array.from(document.getElementsByClassName("tab_button")).forEach(button => {
        button.addEventListener("click", ()=>{display_tab(event, button.value)})
    })
    current_tab = document.querySelector(".tab_button").id
    console.log(current_tab)
    console.log(document.getElementsByClassName(current_tab))
    document.getElementById(current_tab).className += " tab_selected"
    Array.from(document.getElementsByClassName(current_tab)).forEach(tab => {
        tab.style.display = "block"
    })
    display_price()

    var editor_mod = localStorage.getItem('editor')
    if(editor_mod){
        $( "<button class=\"start_edit\" onclick=\"start_edit()\">Edit</button>" ).insertAfter( "iframe" );
        /*document.querySelectorAll("iframe").forEach(doc=> {

            doc.style.before =
        })*/
        //event.srcElement
    }
})

function start_edit(){
    const button = event.srcElement
    const iframe = button.previousElementSibling
    var iframe_dis = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
    alert(iframe_dis.document)
    const editor = iframe_dis.document
    //editor.designMode = "on";
    activate_iframe_editor(editor)
    $( "<button class=\"start_edit\" onclick=\"done_edit()\">Done</button>" ).insertAfter( button );
}

function done_edit(){
    const button = event.srcElement
    const iframe = button.previousElementSibling.previousElementSibling
    var iframe_dis = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
    const editor = iframe_dis.document
    editor.designMode = "off";
    button.parentNode.removeChild(button);
    alert(iframe.src)
    save_frame(iframe, iframe.src)
}

function get_exchange_rate(target_currency){
    {
        const request = new XMLHttpRequest();
        //const target_currency = ui.item.value



        //const price_in_soles = Number(document.querySelector('.price').dataset.price)
        request.open('POST', "/convert");

        request.onload = () => {
            //console.log("request loaded")
            const data = JSON.parse(request.responseText);

            if (data['success']) {
                change_all_prices(data['rate'], target_currency)
                //const contents = data['rate']*price_in_soles;
                //document.querySelector('.price').innerHTML = contents.toFixed(2);
                //document.querySelector(".currency_symbol").innerHTML = target_currency;
            }
            else {
                document.querySelector('.price').innerHTML = 'There was an error.';
            }
        }

        const data = new FormData();
        data.append('target_currency', target_currency);
        //console.log(target_currency)

        request.send(data);

        return false;
    }
}

function change_all_prices(rate, symbol){
    var iframe = document.querySelectorAll("iframe")
    for(var i = 0; i < iframe.length; i++){
        iframe_dis = iframe[i].contentWindow || iframe[i].contentDocument.document || iframe[i].contentDocument;
        Array.from(iframe_dis.document.querySelectorAll(".price")).forEach(price=>{
            price.innerHTML = (price.dataset.price*rate).toFixed(2);
        })
        Array.from(iframe_dis.document.querySelectorAll(".currency_symbol")).forEach(sym_holder=>{
            sym_holder.innerHTML = symbol;
        })
    }
    Array.from(document.querySelectorAll(".price")).forEach((price)=>{
        price.innerHTML = (price.dataset.price*rate).toFixed(2);
    })
    Array.from(document.querySelectorAll(".currency_symbol")).forEach((sym_holder)=>{
        sym_holder.innerHTML = symbol
    })
}


function get_available_symbols(callback){
    const request = new XMLHttpRequest();
    request.open('GET', "/convert/symbols");

    request.onload = () => {
        //console.log("request loaded")
        const data = JSON.parse(request.responseText);

        if (data['success']) {
            callback(data["source"])
        }
        else {
            alert("Loading available currencies failed")
        }
    }
    request.send();
}


function display_price(){
    var exchange_rate = 1;
    var user_currency = localStorage.getItem('currency')
    if (!user_currency){
        localStorage.setItem('currency', "PEN");
        change_all_prices(1, "PEN");
    }else{
        get_exchange_rate(user_currency)
    }
}





function display_tab(event, animation = "left_top_zoom"){
    //console.log("display_tab")
    if (event.currentTarget == current_tab){
        //console.log("same tab")
        return
    }
    Array.from(document.getElementsByClassName(current_tab)).forEach(div => {
        //console.log("found div with current tab")
        document.getElementById(current_tab).className = document.getElementById(current_tab).className.replace("tab_selected", "")
        div.style.display = "none"
    })
    //console.log(event.currentTarget.value)
    current_tab = event.currentTarget.value
    Array.from(document.getElementsByClassName(current_tab)).forEach(div => {
        console.log("found div with target tab")
        document.getElementById(current_tab).className += " tab_selected"
        div.style.display = "block"
    })
}
