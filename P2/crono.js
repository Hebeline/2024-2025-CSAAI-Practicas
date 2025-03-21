let cronometro;
let segundos = 0;
let minutos = 0;
let milisegundos= 0;

function startCrono() {
    
    cronometro = setInterval(function() {
        milisegundos++;
        if (milisegundos === 100) {
            segundos++;
            milisegundos = 0;
        }
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        document.querySelector("#contador").innerHTML = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}:${milisegundos.toString().padStart(2,'0')}`;

    }, 10)}

function stopCrono() {
    clearInterval(cronometro);
}

function resetCrono() {
    clearInterval(cronometro);
    segundos = 0;
    minutos = 0;
    milisegundos = 0;
    document.querySelector("#contador").innerHTML = "00:00:00";
}
