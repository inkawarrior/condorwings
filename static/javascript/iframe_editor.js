
function activate_iframe_editor (editor){
    editor.designMode = "on";
    bold.addEventListener("click", function bold(){
        editor.execCommand("Bold", false, null)
    })
    italic.addEventListener("click", function italic(){
        editor.execCommand("Italic", false, null)
    })
    underline.addEventListener("click", function underline(){
        editor.execCommand("Underline", false, null)
    })
    orderList.addEventListener("click", function orderList(){
        editor.execCommand("InsertOrderedList", false, + new Date)
    })
    unorderList.addEventListener("click", function unorderList(){
        editor.execCommand("InsertUnorderedList", false, + new Date)
    })
    text_color.addEventListener("change", function text_color(event){
        editor.execCommand("ForeColor", false, event.target.value)
    })
    background_color.addEventListener("change", function background_color(event){
        editor.execCommand("BackColor", false, event.target.value)
    })
    font_size.addEventListener("change", function font_size(event){
        editor.execCommand("FontSize", false, event.target.value)
    })
    font_family.addEventListener("change", function font_family(event){
        editor.execCommand("FontName", false, event.target.value)
    })
    LinkButton.addEventListener("click", function LinkButton(){
        var url = prompt("Enter a URL", "http://")
        editor.execCommand("CreateLink", false, url)
    })
    unLinkButton.addEventListener("click", function unLinkButton(){
        editor.execCommand("UnLink", false, null)
    })
    Undo.addEventListener("click", function Undo(){
        editor.execCommand("undo", false, null)
    })
    Redo.addEventListener("click", function Redo(){
        editor.execCommand("redo", false, null)
    })
    SaveAs.addEventListener("click", function SaveAs(){
        var file_name = prompt("Enter the filename")
        save_frame(file_name)
    })
    load.addEventListener("click", function load(){
        var file_name = prompt("Enter the filename")
        load_frame(file_name)
    })
}

function save_frame(iframe, file_name, absolute_path = true){
    {
        const request = new XMLHttpRequest();

        request.open('POST', "/save_content");

        request.onload = () => {
            console.log("request loaded")
            const data = JSON.parse(request.responseText);

            if (data['success']) {
                alert("Success")
            }
            else {
                alert(data["message"])
            }
        }
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        //const iframe_data = document.getElementById('iframe_editor').innerHTML;

        const serialized_content = new XMLSerializer().serializeToString(iframeDocument)
        console.log(serialized_content)

        const data = new FormData();
        data.append('file_name', file_name);
        data.append('data', serialized_content);
        data.append("absolute_path", absolute_path)

        request.send(data);

        return false;
    }
}


function load_frame(file_name){
    {
        const request = new XMLHttpRequest();

        request.open('GET', "/load_content/"+file_name);

        request.onload = () => {
            console.log("request loaded")
            const data = JSON.parse(request.responseText);

            if (data['success']) {
                alert("Success")
                //const iframe_wrapper = document.getElementById("iframe_wrapper")
                var iframe = document.getElementById("iframe_editor")
                const content = new DOMParser().parseFromString(data["iframe_document"], "text/html")
                console.log(new DOMParser().parseFromString(data["iframe_document"], "text/html"))
                iframe = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
                iframe.document.open()
                iframe.document.write(data["iframe_document"])
                iframe.document.close()
                //iframe.replaceChild(new DOMParser().parseFromString(data["iframe_document"], "text/html"), iframe.document)
            }
            else {
                alert("There was an error."+data["message"])
            }
        }

        //const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        //const iframe_data = document.getElementById('iframe_editor').innerHTML;
        //console.log(iframeDocument)
        //const data = new FormData();
        //data.append('file_name', file_name);
        request.send();

        return false;
    }
}
