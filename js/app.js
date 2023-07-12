// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//Eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

//Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = presupuesto;
    this.restante = presupuesto;
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
    // console.log(this.gastos);
    // console.log(gasto);
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
    // console.log(this.restante);
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
    // console.log(this.gastos);
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    //extrayendo los valores del presupuesto y su restante
    const { presupuesto, restante } = cantidad;

    //agregando esos valores al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
    // console.log();
  }

  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //mensaje de error
    divMensaje.textContent = mensaje;

    //insertar en el HTML
    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    //quitar el alert despues de 3 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {
    this.limpiarHTML(); //elimina el HTML previo
    //iterar sobre los gastos
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      //crear un LI
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // nuevoGasto.setAttribute('data-id', id); //la forma original de hacerlo
      nuevoGasto.dataset.id = id; //Forma de hacerlo "actual"

      //agregar el HTML del gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;
      //boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Borrar &times;";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);

      //agregar al HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");
    //comprobar 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
      //comprobar 50%
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
      //comprobar el reembolso
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }
    //si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta("Ya no hay presupuesto", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

//instanciado de variables
const ui = new UI();
let presupuesto;
//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt(
    "¿Cual es el presupuesto de esta semana, galán?"
  );
  //   console.log(Number(presupuestoUsuario));
  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }
  //presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);
  ui.insertarPresupuesto(presupuesto);
}

//añadir gastos (input)
function agregarGasto(e) {
  e.preventDefault();

  // leer los datos que hay en los inputs (Formulario)
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  // validar que ningún input del formulario esté vacío
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Es necesario que ingrese valores VÁLIDOS", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Esto no es válido", "error");
    return;
  }

  //generar un objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };

  //añade un nuevo gasto
  presupuesto.nuevoGasto(gasto);
  //   console.log(gasto);
  //Mensaje de ingreso de gasto
  ui.imprimirAlerta("Gasto agregado!");
  //imprimir gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
  //reiniciar el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //Elimina los gastos del objeto
  presupuesto.eliminarGasto(id);
  //Elimina los gastos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
