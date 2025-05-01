// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

var nodos1 = document.querySelector('.nodos');
var tiempo = document.querySelector('.tiempo');
var generada = document.querySelector('.generada');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const nodeRadius = 40;
var numNodos = 0;
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100;

const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");

class Nodo {
  constructor(id, x, y, delay) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.delay = delay;
    this.conexiones = [];
  }

  conectar(nodo, peso) {
    this.conexiones.push({ nodo, peso });
  }

  isconnected(idn) {
    return this.conexiones.some(({ nodo: conexion }) => conexion.id === idn);
  }

  node_distance(nx, ny) {
    let a = nx - this.x;
    let b = ny - this.y;
    return Math.floor(Math.sqrt(a * a + b * b));
  }

  far_node(nodos) {
    let distn = 0, cnode = this.id, distaux = 0, pos = 0, npos = 0;
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux > distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }
      pos++;
    }
    return { pos: npos, id: cnode, distance: distn };
  }

  close_node(nodos) {
    let far = this.far_node(nodos);
    let cnode = far.id, distn = far.distance, distaux = 0, pos = 0, npos = 0;
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux <= distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }
      pos++;
    }
    return { pos: npos, id: cnode, distance: distn };
  }
}

function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  const nodos = [];
  let x = 0, y = 0, delay = 0;
  let xp = nodeRadius, yp = nodeRadius;
  const xs = Math.floor(canvas.width / numNodos);
  const ys = Math.floor(canvas.height / 2);
  const xr = canvas.width - nodeRadius;
  const yr = canvas.height - nodeRadius;
  let xsa = xs;
  let ysa = ys;

  for (let i = 0; i < numNodos; i++) {
    if (Math.random() < 0.5) {
      yp = nodeRadius;
      ysa = ys;
    } else {
      yp = ys;
      ysa = yr;
    }
    x = randomNumber(xp, xsa);
    y = randomNumber(yp, ysa);

    xp = xsa;
    xsa += xs;
    if (xsa > xr && xsa <= canvas.width) xsa = xr;
    if (xsa > xr && xsa < canvas.width) {
      xp = nodeRadius;
      xsa = xs;
    }

    delay = generarRetardo();
    nodos.push(new Nodo(i, x, y, delay));
  }

  for (let nodo of nodos) {
    const clonedArray = [...nodos];
    for (let j = 0; j < numConexiones; j++) {
      let closest = nodo.close_node(clonedArray);
      if (!nodo.isconnected(closest.id) && !clonedArray[closest.pos].isconnected(nodo.id)) {
        nodo.conectar(clonedArray[closest.pos], closest.distance);
      }
      clonedArray.splice(closest.pos, 1);
    }
  }

  let tiempo_total = nodos.reduce((acc, nodo) => acc + nodo.delay, 0);
  let tiempo_redondeado = Math.round(tiempo_total * 100) / 100;

  nodos1.innerText = ` ${nodos.length} nodos`;
  generada.innerText = `Red generada`;
  tiempo.innerText = `Tiempo total: ${tiempo_redondeado} sec`;

  return nodos;
}

function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function drawNet(nnodes) {
  nnodes.forEach(nodo => {
    nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
      ctx.beginPath();
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(conexion.x, conexion.y);
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      const pw = `N${nodo.id} pw ${peso}`;
      const midX = Math.floor((nodo.x + conexion.x) / 2);
      const midY = Math.floor((nodo.y + conexion.y) / 2);
      ctx.fillText(pw, midX, midY);
    });
  });

  nnodes.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    const nodoDesc = `N${nodo.id} delay ${Math.floor(nodo.delay)}`;
    ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
  });
}

btnCNet.onclick = () => {
  numNodos = Math.floor(Math.random() * 3) + 3;
  redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet(redAleatoria);
}

btnMinPath.onclick = () => {
  if (!redAleatoria) {
    generada.innerText = `No se puede calcular la ruta antes de generar la red.`;
    return;
  }
  nodoOrigen = redAleatoria[0];
  nodoDestino = redAleatoria[numNodos - 1];
  rutaMinimaConRetardos = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
  console.log("Ruta mínima con retrasos:", rutaMinimaConRetardos);
  drawNet2(rutaMinimaConRetardos);
}

function drawNet2(nnodes) {
  nnodes.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    const nodoDesc = `N${nodo.id} delay ${Math.floor(nodo.delay)}`;
    ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
  });
}
