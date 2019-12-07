//bf97b943316e71b57a2bac4b3959c450
//api key

$(document).ready(function() {
    get_available_symbols((available_symbols)=>{

        $("#input").autocomplete({
            minLength: 0,
            source: available_symbols,

            select: (event, ui)=>{
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
    display_price()
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

})

function get_exchange_rate(target_currency){
    {
        const request = new XMLHttpRequest();
        //const target_currency = ui.item.value

        localStorage.setItem('currency', target_currency);

        //const price_in_soles = Number(document.querySelector('.price').dataset.price)
        request.open('POST', "/convert");

        request.onload = () => {
            console.log("request loaded")
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
        console.log(target_currency)

        request.send(data);

        return false;
    }
}

function change_all_prices(rate, symbol){

    document.querySelectorAll(".price").forEach((price)=>{
        price.innerHTML = (price.dataset.price*rate).toFixed(2);
    })
    document.querySelectorAll(".currency_symbol").forEach((sym_holder)=>{
        sym_holder.innerHTML = symbol
    })
}


function get_available_symbols(callback){
    const request = new XMLHttpRequest();
    request.open('GET', "/convert/symbols");

    request.onload = () => {
        console.log("request loaded")
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
