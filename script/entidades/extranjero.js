import { Persona } from "./persona.js";

export class Extranjero extends Persona {

    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        
        if (paisOrigen === null) {
            throw new Error('PaisOrigen no puede ser nulo');
        }

        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen; //string no nulo
    }

    tostring() {
        return super.tostring() +
            "Pais Origen: " + this.paisOrigen + "\n";
    }
}