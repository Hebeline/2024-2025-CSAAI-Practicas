let claveSecreta = [];
let intentos = 10;
let aciertos = 0;
let iniciado = false;

function generarClave() {
    claveSecreta = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    console.log("Clave Secreta:", claveSecreta);
}

document.addEventListener("DOMContentLoaded", () => {
    generarClave();
    document.querySelector("#reset").addEventListener("click", reiniciarJuego);
    document.querySelector("#start").addEventListener("click", iniciarJuego);
    document.querySelector("#stop").addEventListener("click", detenerJuego);
    document.querySelectorAll(".numero").forEach(button => {
        button.addEventListener("click", () => verificarNumero(parseInt(button.textContent)));
    });
});

function iniciarJuego() {
    if (!iniciado) {
        iniciado = true;
        startCrono();
    }
}

function detenerJuego() {
    stopCrono();
}

function reiniciarJuego() {
    stopCrono();
    resetCrono();
    intentos = 10;
    aciertos = 0;
    iniciado = false;
    generarClave();
    document.body.classList.remove('ganaste', 'perdiste');

    document.querySelector("#intentos").textContent = intentos;
    document.querySelectorAll("#clave-container span").forEach(span => {
        span.textContent = "*";
        span.classList.remove("acierto");
    });
}

function verificarNumero(numero) {
    if (!iniciado) iniciarJuego();
    if (intentos > 0) {
        let encontrado = false;
        claveSecreta.forEach((num, index) => {
            if (num === numero) {
                document.querySelectorAll("#clave-container span")[index].textContent = numero;
                document.querySelectorAll("#clave-container span")[index].classList.add("acierto");
                encontrado = true;
                aciertos++;
            }
        });
        
        if (!encontrado) {
            intentos--;
            document.querySelector("#intentos").textContent = intentos;
        }

        if (aciertos === 4) {
            
            document.body.classList.add('ganaste');
            document.body.classList.remove('perdiste');
            detenerJuego();
            setTimeout(function(){
            alert("¡Felicidades! Has adivinado la clave secreta.");
        }, 1)
        }

        if (intentos === 0) {
            
            document.body.classList.add('perdiste');
            document.body.classList.remove('ganaste');
            setTimeout(function(){
            alert("Has perdido. Se reiniciará el juego.");
            document.querySelector("#contador").innerHTML = "00:00:00";
            reiniciarJuego();
        }, 2)
        }
    }
}
