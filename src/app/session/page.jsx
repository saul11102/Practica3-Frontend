//nspage
//use client es para usar y realizar eventos dentro de la pantalla del cliente
'use client';
import './login.css';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { login } from '../../hooks/Service_authenticate';
import { useRouter } from 'next/navigation';

//solo se exporta esta funcion
export default function Session() {

    const router = useRouter();

    if (Cookies.get('token') != null){
        router.push('/dashboard');
        router.refresh();
    }

    const validacion_esquema = Yup.object().shape({
        usuario: Yup.string().trim().required('Campo obligatorio'),
        clave: Yup.string().trim().required('Campo obligatorio').min(3, 'La clave debe tener al menos 3 caracteres alfanumericos')
    });

    const opciones_formulario = { resolver: yupResolver(validacion_esquema)};

    const { register, handleSubmit, formState } = useForm(opciones_formulario);

    let { errors } = formState;
    
    const enviar_data = (data) => {
        login(data).then((info) => {
            console.log(info);
            if (info.code == '200') {
                console.log("Inicio de sesion exitoso");
                Cookies.set('token', info.datos.token);
                Cookies.set('usuario', info.datos.user);
                swal({
                    title: "INFO",
                    text: "Bienvenido" + " " + info.datos.user,
                    icon: "success",
                    button: "Aceptar",
                    timer: 8000,
                    closeOnEsc: true
                });
                //redireccionar a la pagina de menu
                router.push('/dashboard');
                router.refresh();
            } else {
                swal({
                    title: "Error",
                    text: "Contraseña o usuario no coinciden",
                    icon: "error",
                    button: "Aceptar",
                    timer: 8000,
                    closeOnEsc: true
                });
                console.log("Inicio de sesion fallido");
                console.log(info);
            }
        })
    };



    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit(enviar_data)}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Inicio de sesión</h3>\
                    <div className="form-group mt-3">
                        <label>Usuario</label>
                        <input
                            type="text"
                            {...register('usuario', { required: 'Usuario es requerido' })}
                            className="form-control mt-1"
                            placeholder="Usuario o correo electrónico"
                        />
                        {errors.usuario && (
                            <div className="text-xs inline-block py-1 px-2 rounded text-gray-600">
                                {errors.usuario.message}
                            </div>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            {...register('clave', { required: 'Contraseña es requerida', minLength: { value: 5, message: 'La clave debe tener al menos 5 caracteres alfanuméricos' } })}
                            className="form-control mt-1"
                            placeholder="*******"
                        />
                        {errors.clave&& (
                            <div className="text-xs inline-block py-1 px-2 rounded text-gray-600">
                                {errors.clave.message}
                            </div>
                        )}
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Iniciar Sesión
                        </button>
                    </div>
                    <p className="forgot-password text-right mt-2">
                        Forgot <a href="#">password?</a>
                    </p>
                </div>
            </form>
        </div>
    );
}

