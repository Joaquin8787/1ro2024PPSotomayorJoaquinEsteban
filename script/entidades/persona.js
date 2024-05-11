export class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {

        if (id === null) {
            throw new Error('ID no puede ser nulo');
        }
        if (nombre === null) {
            throw new Error('Nombre no puede ser nulo');
        }
        if (apellido === null) {
            throw new Error('Apellido no puede ser nulo');
        }
        if (fechaNacimiento === null) {
            throw new Error('Fecha de nacimiento no puede ser nulo');
        }

        this.id = id; //id unico no nulo
        this.nombre = nombre; //string no nulo
        this.apellido = apellido; //string no nulo
        this.fechaNacimiento = fechaNacimiento; //number AAAAMMDD
    }

    tostring() {
        return "ID: " + this.id + "\n" +
            "Nombre: " + this.nombre + "\n" +
            "Apellido: " + this.apellido + "\n" +
            "Edad: " + this.fechaNacimiento + "\n";
    }
}