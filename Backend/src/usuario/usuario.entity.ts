import { hash } from "bcryptjs";
import { AsignacionEntity } from "src/asignacion/asignacion.entity";
import { AsignaturaEntity } from "src/asignaturas/asignaturas.entity";
import { RolEntity } from "src/rol/rol.entity";
import { TramitesEntity } from "src/tramites/tramites.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario' })
export class UsuarioEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  correo: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  carrera: String

  @Column({ type: 'varchar', nullable: true })
  semestre: String

  @Column({ type: 'varchar', length: 10, nullable: true, unique: true })
  nombreUsuario: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  tel: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  jornada: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  programa: string;

  @Column({ type: 'uuid', name: 'reset_password_token', nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'varchar', nullable: true })
  foto: string;

  @OneToMany(() => TramitesEntity, tramite => tramite.usuario)
  tramites: TramitesEntity[];

  @ManyToMany(type => RolEntity, rol => rol.usuarios, { eager: true })
  @JoinTable({
    name: 'usuario_rol',
    joinColumn: { name: 'usuario_id' },
    inverseJoinColumn: { name: 'rol_id' }
  })
  roles: RolEntity[];

  @ManyToMany(type => AsignaturaEntity, asignatura => asignatura.usuarios)
  @JoinTable({
    name: 'usuario_asignatura',
    joinColumn: { name: 'usuario_id' },
    inverseJoinColumn: { name: 'asignatura_id' }
  })
  asignaturas: AsignaturaEntity[];


  @OneToMany(type => AsignacionEntity, asignacion => asignacion.asignatura)
  asignaciones: AsignacionEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasword() {
    if (!this.password) return;
    this.password = await hash(this.password, 10);
  }
}
