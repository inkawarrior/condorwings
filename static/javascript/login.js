
document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("login_form").onsubmit = ()=>{
        console.log(document.getElementById("login_form"))
        const request = new XMLHttpRequest();
        request.open('POST', '/login');

        request.onload = () => {
            console.log(request.responseText)
            const data = JSON.parse(request.responseText);
            console.log(data)
            if (data.success) {
                console.log("test")
                localStorage.setItem('editor', true);
                location.replace("/")
            }
            else {
                alert( data["message"]);
            }
        }
        var data = new FormData()
        console.log(document.forms['login_form'].elements['username'])
        data.append('username', document.forms["login_form"].elements["username"].value);
        data.append('password', document.forms["login_form"].elements["password"].value);
        request.send(data);
        return false;
    }
})
