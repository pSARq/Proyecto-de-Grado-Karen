import { IsEmail, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class NuevoUsuarioDto {

    @IsString()
    @MaxLength(100, { message: 'nombre: longitud maxima de 100' })
    nombre: string;

    @IsNotBlank({ message: 'No puede estar vacio' })
    @IsEmail()
    correo: string;

    @IsNotBlank({ message: 'La contraseña del usuario no puede estar vacia' })
    password: string;

    @IsNotBlank()
    rol: string;

    @IsNotBlank()
    carrera: string;

    @IsNotBlank()
    semestre: string;

}