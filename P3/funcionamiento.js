var canvas = document.getElementById("Invasion");
var nave = document.getElementById("nave");
var marciano = document.getElementById("marciano");
var explosion = document.getElementById("explosion");
var botonIzquierdo = document.getElementById("izquierda");
var disparo1 = document.getElementById("disparo");
var botonDerecho = document.getElementById("derecha");
var sonido_disparo = new Audio("disparo.mp3");
var sonido_explosion = new Audio("explosion.mp3");
var sonido_victoria = new Audio("victoria.mp3");
var sonido_derrota = new Audio("perdido.mp3");
var ctx = canvas.getContext("2d");

var jugadorX = 250;
var jugadorY = 550;
var jugadorAncho = 40;
var jugadorAlto = 40;
var enemigoX = 10;
var enemigoY = 30;
var enemigoAncho = 30;
var enemigoAlto = 30;
var puntuacion = 0;

var teclaIzquierda = false;
var teclaDerecha = false;

var disparos = [];
var enemigos = [];

var cambio = 1;
var ganado = true;
var perdido = true;

// Crear lista de enemigos

for (var n = 0; n < 3; n++ ) {
  var sumador2 = enemigoY + n*50;
  for(var m =0; m<8; m++){
    
    var sumador = enemigoX +m*50;
    var objeto = {x:sumador,y :sumador2, foto:marciano};
    enemigos.push(objeto);
  }
};

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowLeft") {
    teclaIzquierda = true;
  }
  if (event.key === "ArrowRight") {
    teclaDerecha = true;
  }
  if (event.key === " ") {
    // Crear un nuevo disparo
    var nuevoDisparo = {
      x: jugadorX + jugadorAncho / 2 - 2,
      y: jugadorY
    };
    sonido_disparo.currentTime = 0;
    sonido_disparo.play();
    disparos.push(nuevoDisparo);
  }
});


document.addEventListener("keyup", function(event) {
  if (event.key === "ArrowLeft") {
    teclaIzquierda = false;
  }
  if (event.key === "ArrowRight") {
    teclaDerecha = false;
  }
});

//Boton izquierdo
botonIzquierdo.addEventListener("touchstart", function() {
  teclaIzquierda=true;
})

botonIzquierdo.addEventListener("touchend", function(){
  teclaIzquierda=false;
})

//Boton derecho
botonDerecho.addEventListener("touchstart", function() {
  teclaDerecha=true;
})

botonDerecho.addEventListener("touchend", function(){
  teclaDerecha=false;
})

//Disparo

disparo1.addEventListener("touchstart", function() {
  var nuevoDisparo1 = {
    x: jugadorX + jugadorAncho / 2 - 2,
    y: jugadorY
  };
  disparos.push(nuevoDisparo1)
})


function dibujarJuego() {
  // Para que se vaya borrando cuando hay cambios enn el canvas
  ctx.clearRect(0, 0, 600, 600);

//hacemos uso de esta variable por que si no el movimiento no es lineal y mientras que se pulsa 
// otra tecla no se puede estar pulsando otra por lo que no se puede avanzar y disparar a la vez.
if (teclaIzquierda) {
    jugadorX -= 3;
  }
  if (teclaDerecha) {
    jugadorX += 3;
  }

  // para que no se salga del
  if (jugadorX < 0) jugadorX = 0;
  if (jugadorX > 550) jugadorX = 550;

   // Dibujar enemigos
   for(var j=0; j< enemigos.length; j++){
     let enemigo = enemigos[j];
     ctx.drawImage(enemigo.foto,enemigo.x, enemigo.y);
     var mover = true;
   };

  if (mover){
    for(var h=0; h<enemigos.length; h++){
      let enemigo = enemigos[h];
      enemigo.x += cambio;
      enemigo.y += 0.10;
      if(enemigo.x== 550){
        cambio = -1
      }
      if (enemigo.x==10){
        cambio = 1
      }
    }
  };

  //Eliminar enemigos

  for(var indice=0; indice<disparos.length; indice++){
    var bala = disparos[indice];
    for(let indice2=0; indice2<enemigos.length; indice2++){
      let enemigo = enemigos[indice2]
      if (bala.x>enemigo.x && bala.x+3<enemigo.x+30 && bala.y>enemigo.y && bala.y+7<enemigo.y+30){
        enemigo.foto=explosion;
        ctx.fillText(`SCORE:${puntuacion}`, 10, 20)
        puntuacion +=10;        
        disparos.splice(indice,1);
        setTimeout(function(){
          enemigos.splice(indice2,1);
        },100)
        sonido_explosion.currentTime = 0;
        sonido_explosion.play();
      }
    }
  }

  // Dibujar al que ataca
  ctx.fillStyle = "blue"; //Define el color del nuevo elemento del canva que vamos a definir.
  ctx.drawImage(nave, jugadorX, jugadorY); //define la posición y las dimensiones del nuevo elemento.
  
  ctx.fillStyle= "white";
  ctx.font = "20px serif";
  ctx.fillText(`SCORE:${puntuacion}`, 10, 20)

  // Dibujar disparos
  ctx.fillStyle = "white";
  for (var i = 0; i < disparos.length; i++) {
    var disparo = disparos[i];
    if (disparo.y > 0){
        ctx.fillRect(disparo.x, disparo.y, 3, 7);
        disparo.y -= 2;}// mover hacia arriba, ya que y = 0 es la parte de arriba del canvas.
  
    else {
        disparos.splice(i, 1); // Eliminar el disparo en el índice 'i'
        i--; 
    } 
  }

  disparos = disparos.filter(function(disparo) {
    return disparo.y > 0;
  });

  if (enemigos.length == 0){
    ctx.font = "50px serif";
    ctx.fillStyle= "green";
    ctx.fillText('VICTORY!', 100, 300);
    if (ganado){
      sonido_victoria.play();
      ganado = false;
    }
  };

  for(let indice3= 0; indice3<enemigos.length; indice3++){
    let enemigo =enemigos[indice3];
    if(enemigo.y+30>jugadorY){
      ctx.font = "50px serif";
      ctx.fillStyle = "red";
      ctx.fillText('GAME OVER', 100, 300)
      if(perdido){
      sonido_derrota.play();
      perdido = false;
    }
    }
  }

  requestAnimationFrame(dibujarJuego);
}

dibujarJuego();
