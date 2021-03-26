const miFormulario = document.querySelector('form');

const url = window.location.hostname.includes("localhost")
    ? "http://localhost:8080/api/auth/"
    : "https://webserver-restapi-basico.herokuapp.com/api/auth/";

//Se añade un listener al formulario
//Capturan los datos del frontend que van al backend
miFormulario.addEventListener('submit', ev => {
    //Para evitar refresh del navegador
    ev.preventDefault();
    const formData = {}
    // Se leen los datos del formulario
    for (let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value
    }
    //Envio de datos al backend

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html'
        })
        .catch(err => {
            console.log(err);
        })
});


console.log(window.location);
function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log("Name: " + profile.getName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    //Para hacer peticion post desde el fronend
    fetch(url + 'google', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((resp) => resp.json())
        .then(({ token }) => {
            //Se graba en el localStorage
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log());
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log("User signed out.");
    });
}
