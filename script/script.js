import { lista } from "./data.js";
import { Extranjero } from "./entidades/extranjero.js";
import { Ciudadano } from "./entidades/ciudadano.js";
import {createForm,crearInputs} from "./form.js";
import { updateTable} from "./tabla.js";

//Importo los datos
const listaPersonas = JSON.parse(JSON.stringify(lista) || []);

// Defino variables
const opciones = ["Todos", "Ciudadanos", "Extranjeros"];
const tipos = ["Ciudadano", "Extranjero"];
let ordenActivo = true;

const $seccionTabla = document.getElementById('seccion-table');
const $seccionFormulario = document.getElementById('formulario');
const $seccionHeaderTabla = document.getElementById('filter');
const colorHeader = "darkorange";


//Evaluo el tipo de cada registro y lo paso por el constructor correspondiente
const listaObjetos = procesarRegistros(listaPersonas);

let datosFiltrados = listaObjetos;
let btnAlta = document.getElementById("alta");
let indicador = "id";

//Agrego el formulario como primer hijo
$seccionFormulario.insertBefore(createForm(listaObjetos,tipos), $seccionFormulario.firstChild);
const $formulario = document.querySelector('form');

//filtrar por (todos/Ciudadanos/Extranjeros)
opciones.forEach(element =>{
    const option = document.createElement('option');
    option.textContent = element;
    $seccionHeaderTabla.appendChild(option);
});

updateTable($seccionTabla, listaObjetos, colorHeader,indicador);
crearInputs();

//EVENTOS

window.addEventListener('click', (e) => {
    if (e.target.matches('td')) {
        handlerSelectedTD(e);
        cambiarVisibilidad();
    }
    else if (e.target.matches('th')) {
        handlerSelectedTH(e);
    }
    else if (e.target.matches("input[type='submit']")) {
        handlerSubmit();
        cambiarVisibilidad();
    }
    else if (e.target.id === 'btnCalcularEdadPromedio') {
        console.log("adentro")
        let fechaNacimientoPromedio = calcularEdadPromedio(datosFiltrados);
        let inputText = document.getElementById('edadPromedio');
        inputText.value = fechaNacimientoPromedio;
    }
    else if (e.target.matches("input[type='reset']")) {
        console.log("Cancelando");
        resetFormulario($formulario);
    }
    else if (e.target.matches("input[id='eliminar']")){
        handlerDelete($formulario.id.value);
    }
});

// Agregar controladores de eventos a los checkboxes
document.querySelectorAll('.showColumn input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if(!checkbox.checked){
            checkbox.checked = false;
        }
        else{
            checkbox.checked = true;
        }
        updateColumnStyle(checkbox.id,checkbox);
    });
});

$seccionHeaderTabla.addEventListener("change", function() {
    const tipoSeleccionado = this.value;

    if(tipoSeleccionado == 'Ciudadanos'){
        filtrarYMostrarDatos(listaObjetos,Ciudadano);
    }else if(tipoSeleccionado == 'Extranjeros'){
        filtrarYMostrarDatos(listaObjetos,Extranjero);
    }
    else{
        datosFiltrados = listaObjetos;
        updateTable($seccionTabla, listaObjetos, colorHeader);
    }
    resetCheckbox();
});

select.addEventListener("change", crearInputs);
btnAlta.addEventListener("click", cambiarVisibilidad);

function resetCheckbox(){
    let checkboxes = document.querySelectorAll('.showColumn input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function updateColumnStyle(columnClass,checkbox) {
    const columns = document.querySelectorAll(`.${columnClass}Th`);
    columns.forEach(column => {
        if (column) {
            column.style.display = checkbox.checked?  '':'none';
        }
    });
}

function handlerCreate(nuevoUsuario) {
    console.log("Creando");
    listaObjetos.push(nuevoUsuario);

    updateTable($seccionTabla, listaObjetos, colorHeader);
}

function handlerUpdate(usuarioAModificar,valoresNuevos) {
    console.log("Actualizando");
    if(esRegistroDeTipo(valoresNuevos,Ciudadano) && esRegistroDeTipo(usuarioAModificar,Ciudadano)){
        console.log("Ciudadano");
        Object.keys(valoresNuevos).forEach(key => {
            // Actualiza la propifechaNacimiento correspondiente en usuarioAModificar con el valor nuevo
            usuarioAModificar[key] = valoresNuevos[key];
        });
    }
    else{
        console.log("Extranjero");
        Object.keys(valoresNuevos).forEach(key => {
            // Actualiza la propifechaNacimiento correspondiente en usuarioAModificar con el valor nuevo
            usuarioAModificar[key] = valoresNuevos[key];
        });
    }
    let index = listaObjetos.findIndex((elemento) => elemento.id == usuarioAModificar.id);
    listaObjetos.splice(index, 1, usuarioAModificar);

    updateTable($seccionTabla, listaObjetos, colorHeader);
}

function handlerDelete(id) {
    console.log("Eliminado");
    let index = listaObjetos.findIndex((elemento) => elemento.id == id);
    if(confirm("¿Desea eliminar este SuperCiudadano?")){
        listaObjetos.splice(index, 1);
        updateTable($seccionTabla, listaObjetos, colorHeader);
        cambiarVisibilidad();
    }

}

function handlerSubmit() {    
    const $inputs = $formulario.querySelectorAll('input[type="text"]');
    let  values = {};

    $inputs.forEach(function(input) {
        values[input.id] = input.value;
    });
    try {
        // Verifico que la persona sea nueva
        if (values.id == '') {

            if (listaObjetos.length > 0) {
                values.id = generarId();
            }
            if(esRegistroDeTipo(values,Ciudadano)){
                console.log("Ciudadano");
                const nuevoCiudadano = new Ciudadano(values.id, values.nombre, values.apellido, values.fechaNacimiento, values.alterego, values.ciudad, values.publicado);
                if (confirm("¿Desea cargar el Ciudadano?")) handlerCreate(nuevoCiudadano);
            }
            else{
                console.log("Extranjero");
                const nuevoExtranjero = new Extranjero(values.id, values.nombre, values.apellido, values.fechaNacimiento, values.enemigo, values.robos, values.asesinatos);
                if (confirm("¿Desea cargar el Extranjero?")) handlerCreate(nuevoExtranjero);
            }
        } else {
            const objetoOriginal = listaObjetos.find(obj => obj.id == values.id);
            if (confirm("¿Desea realizar la modificación?")) handlerUpdate(objetoOriginal,values);
        }
        resetFormulario($formulario);
    } catch (error) {
        alert(error.message);
    }
}
function generarId()
    {
        let id;
        do{
            id = Math.floor(Math.random() * 10000)+1;
        }while(listaObjetos.some(p=>p.id==id))

        return id;
    }

function handlerSelectedTD(e) {
    const idSeleccionado = e.target.parentElement.dataset.id;
    const usuarioSeleccionado = listaObjetos.find((elemento) => elemento.id == idSeleccionado);
    cargarFormulario($formulario, usuarioSeleccionado);
}

function handlerSelectedTH(e) {
    
    const selector = e.target.textContent;
    console.log(selector);

    ordenarListaPorCriterio(datosFiltrados, selector, selector == ordenActivo);
    
    if (selector == ordenActivo) {
        ordenActivo = null;
    } else {
        ordenActivo = selector;
    }
    updateTable($seccionTabla, datosFiltrados, colorHeader);
}

function ordenarListaPorCriterio(lista, criterio, orden) {
    let auxiliar;
    for (let i = 0; i < lista.length; i++) {
        for (let j = i + 1; j < lista.length; j++) {
            if ((!orden && lista[i][criterio] > lista[j][criterio]) || (orden && lista[i][criterio] < lista[j][criterio])) {
                auxiliar = lista[i];
                lista[i] = lista[j];
                lista[j] = auxiliar;
            }
        }
    }
}

function calcularEdadPromedio(lista) {

  const fechasNacimiento = lista.map(elemento => new Date(formatFecha(elemento.fechaNacimiento)));

  // Calcular la edad promedio
  const promedioEdad = fechasNacimiento.reduce((total, fechaNacimiento) => {
      // Calcular la diferencia en años con la fecha actual
      const ahora = new Date();
      
      let diferenciaEnAnos = ahora.getFullYear() - fechaNacimiento.getFullYear();
      console.log(diferenciaEnAnos);
      
      // Considerar el mes y el día para ajustar la diferencia en años
      const meses = ahora.getMonth() - fechaNacimiento.getMonth();
      if (meses < 0 || (meses === 0 && ahora.getDate() < fechaNacimiento.getDate())) {
          diferenciaEnAnos--;
      }
      return total + diferenciaEnAnos;
  }, 0) / lista.length;
  return promedioEdad;
}

// FUNCIONES

function formatFecha(fecha) {
    // Asegurarse de que la fecha tenga exactamente 8 caracteres
    let fechaString = fecha.toString();

    if (fechaString.length !== 8) {
        throw new Error('La fecha debe tener exactamente 8 caracteres en formato yyyyMMdd');
    }

    // Extraer el año, mes y día
    const year = fechaString.substring(0, 4);
    const month = fechaString.substring(4, 6);
    const day = fechaString.substring(6, 8);

    // Asegurarse de que el mes y el día tengan dos dígitos
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');

    // Formatear la fecha en el formato deseado
    return `${year}-${formattedMonth}-${formattedDay}`;
}

function esRegistroDeTipo(registro, Clase) {
    // Obtener las propifechaNacimientoes de la clase
    const propifechaNacimientoesClase = Object.keys(new Clase());

    // Valido si todas las propifechaNacimientoes estan presentes en el registro
    return propifechaNacimientoesClase.every(propifechaNacimiento => registro.hasOwnProperty(propifechaNacimiento));
}

function procesarRegistros(lista) {
    const listaObjetos = [];

    lista.forEach(elemento => {
        if (esRegistroDeTipo(elemento, Ciudadano)) {
            // Asumiendo que el constructor de Ciudadano espera argumentos separados
            const ciudadano = new Ciudadano(
                elemento.id,
                elemento.nombre,
                elemento.apellido,
                elemento.fechaNacimiento,
                elemento.dni
            );
            listaObjetos.push(ciudadano); // Agregar el nuevo objeto Ciudadano a la lista
        } else {
            // Asumiendo que el constructor de Extranjero espera argumentos separados
            const extranjero = new Extranjero(
                elemento.id,
                elemento.nombre,
                elemento.apellido,
                elemento.fechaNacimiento,
                elemento.paisOrigen
            );
            listaObjetos.push(extranjero); // Agregar el nuevo objeto Extranjero a la lista
        }
    });

    return listaObjetos;
}

function filtrarYMostrarDatos(lista, Clase) {
    // Filtrar los datos basándose en el tipo seleccionado
    datosFiltrados = lista.filter(persona => persona instanceof Clase);

    // Llamar a la función updateTable con los datos filtrados
    updateTable($seccionTabla, datosFiltrados, colorHeader, );
}

function cambiarVisibilidad() {
    let form = document.getElementById("formulario");
    let tabla = document.getElementById("tabla");
    let encabezado = document.getElementById("encabezado");
    let boton = document.getElementById("alta");

    if (form.style.display == "") {
        // se oculta el formulario y se muestra la tabla
        form.style.display = "none";
        encabezado.style.display = "";
        tabla.style.display = "";
        boton.value = "Alta";
        boton.textContent = "Alta";
        resetFormulario($formulario);
        resetCheckbox();
    }
    else {
        form.style.display = "";
        tabla.style.display = "none";
        encabezado.style.display = "none";
        boton.value = "Volver";
        boton.textContent = "Volver";
    }
}

function cargarFormulario(formulario, usuario) {
    const $boton = document.getElementById("accion");
    const $botonEliminar = document.getElementById("eliminar");
    $botonEliminar.style.display = "block";
    $boton.value = "Modificar";

    if(usuario instanceof Extranjero){
        select.value = "Extranjero"
        crearInputs();

        formulario.paisOrigen.value = usuario.paisOrigen;
    }
    else{
        select.value = "Ciudadano"
        console.log(usuario);
        formulario.dni.value = usuario.dni;
    }
    formulario.id.value = usuario.id;
    formulario.nombre.value = usuario.nombre;
    formulario.apellido.value = usuario.apellido;
    formulario.fechaNacimiento.value = usuario.fechaNacimiento;
}

function resetFormulario(formulario) {
    const $boton = document.getElementById("accion");
    const $botonEliminar = document.getElementById("eliminar");
    $botonEliminar.style.display = "none";
    $boton.value = "Alta";
    formulario.reset();
}