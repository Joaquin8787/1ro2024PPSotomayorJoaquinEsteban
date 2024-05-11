import { Persona } from "./persona.js";

export class Ciudadano extends Persona {
    
    constructor(id, nombre, apellido, fechaNacimiento,dni) {

        if (dni === null || dni <= 0) {
            throw new Error('DNI debe ser valido');
        }

        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni; //mayor a 0
    }

    tostring() {
        return super.tostring() +
            "DNI: " + this.dni + "\n";
    }
}