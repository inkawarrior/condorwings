document.addEventListener("DOMContentLoaded", ()=>{
    var editor = iframe_editor.document;
    editor.designMode = "on";
    bold.addEventListener("click", ()=>{
        editor.execCommand("Bold", false, null)
    })
    italic.addEventListener("click", ()=>{
        editor.execCommand("Italic", false, null)
    })
    underline.addEventListener("click", ()=>{
        editor.execCommand("Underline", false, null)
    })
    orderList.addEventListener("click", ()=>{
        editor.execCommand("InsertOrderedList", false, + new Date)
    })
    unorderList.addEventListener("click", ()=>{
        editor.execCommand("InsertUnorderedList", false, + new Date)
    })
    text_color.addEventListener("change", (event)=>{
        editor.execCommand("ForeColor", false, event.target.value)
    })
    background_color.addEventListener("change", (event)=>{
        editor.execCommand("BackColor", false, event.target.value)
    })
    font_size.addEventListener("change", (event)=>{
        editor.execCommand("FontSize", false, event.target.value)
    })
    font_family.addEventListener("change", (event)=>{
        editor.execCommand("FontName", false, event.target.value)
    })
    LinkButton.addEventListener("click", ()=>{
        var url = prompt("Enter a URL", "http://")
        editor.execCommand("CreateLink", false, url)
    })
    unLinkButton.addEventListener("click", ()=>{
        editor.execCommand("UnLink", false, null)
    })
    Undo.addEventListener("click", ()=>{
        editor.execCommand("undo", false, null)
    })
    Redo.addEventListener("click", ()=>{
        editor.execCommand("redo", false, null)
    })
    SaveAs.addEventListener("click", ()=>{
        var file_name = prompt("Enter the filename")
        save_frame(file_name)
    })
    load.addEventListener("click", ()=>{
        var file_name = prompt("Enter the filename")
        load_frame(file_name)
    })
})

function save_frame(file_name){
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
                alert("There was an error.")
            }
        }
        //const iframe_wrapper = document.getElementById("iframe_wrapper")
        const iframe = document.getElementById("iframe_editor")
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const iframe_data = document.getElementById('iframe_editor').innerHTML;
        //console.log(iframeDocument)
        //console.log(iframe.outerHTML)
        const serialized_content = new XMLSerializer().serializeToString(iframeDocument)
        console.log(serialized_content)

        const data = new FormData();
        data.append('file_name', file_name);
        data.append('data', serialized_content);

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
