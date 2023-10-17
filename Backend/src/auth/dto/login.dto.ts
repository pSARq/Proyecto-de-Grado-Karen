import { IsNotEmpty } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class LoginUsuarioDto {

    @IsNotBlank()
    correo: string;

    @IsNotEmpty({ message: 'La contraseña del usuario no puede estar vacia' })
    password: string;

}