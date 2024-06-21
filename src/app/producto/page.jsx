'use client';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import './signStyle.css';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import Menu from "../componentes/navbar/menu";
import swal from 'sweetalert';
import { all_product, save_product } from '../../hooks/Service_product';
import { all_lote } from '../../hooks/Service_lote';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';   

export default function Producto() {
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();
    const token = Cookies.get('token');



    if (!token) {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/session');
        router.refresh();
    }

    //productos
    let [productos, setProductos] = useState(null);
    let [estado, setEstado] = useState(false);


    //lotes
    let [lotes, setLotes] = useState(null);
    let [estado1, setEstado1] = useState(false);

    //validación del listado de productos
    if (!estado) {
        all_product(token).then((info) => {
            if (info.code == 200) {
                setProductos(info.datos)
            }
            else {
                console.log("No se pudo cargar los productos");
            }
        });
        setEstado(true);
    }

    //validación del listado de lotes
    if (!estado1) {
        all_lote(token).then((info) => {
            if (info.code == 200) {
                setLotes(info.datos)
            }
            else {
                console.log("No se pudo cargar los lotes");
            }
        });
        setEstado1(true);
    }

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toDateString();
    };

    //validación de campos 
    const validationSchema = yup.object().shape({
        nombre: yup.string().required('Campo obligatorio'),
        precio: yup.string().required('Campo obligatorio'),
        codigo_lote: yup.string().required('Campo obligatorio'),
    });



    //validar formulario
    const formOption = { resolver: yupResolver(validationSchema) };
    //envío de formulario
    const { register, handleSubmit, formState } = useForm(formOption);
    const reset = useForm(formOption);

    let { errors } = formState;

    const toggleForm = () => setShowForm(!showForm);
    const enviar_data = (data) => {
        save_product(data, token).then((info) => {
            if (info.code == '200') {
                console.log("Datos registrados");
                console.log(info);
                swal({
                    title: "INFO",
                    text: "Producto Guardado",
                    icon: "success",
                    button: "Aceptar",
                    timer: 8000,
                    closeOnEsc: true
                }).then(() => {
                    window.location.reload();
                });
            } else {
                swal({
                    title: "Error",
                    text: info.response.statusText,
                    icon: "error",
                    button: "Aceptar",
                    timer: 8000,
                    closeOnEsc: true
                });
                console.log("No se pudo registrar");
            }
        })
    };


    return (
        <div>
            <Menu />
            <div className="container">
                <div className="d-flex justify-content-between mb-3">
                    <h2 className="text-uppercase mb-0 title-black">Productos</h2>
                    <Button variant="primary" onClick={toggleForm}>Agregar Nuevo Producto</Button>
                </div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Lote</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos ? productos.map((producto, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.precio}</td>
                                <td>
                                    {producto.lote.codigo}
                                </td>
                                <td>{producto.estado}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5">Cargando lotes...</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Modal show={showForm} onHide={toggleForm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Nuevo Lote</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(enviar_data)}>
                            <div className="form-group mb-4 title-black">
                                <label htmlFor="codigo">Nombre del producto</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                                    id="nombre"
                                    {...register('nombre')}
                                />
                                {errors.codigo && <div className="invalid-feedback">{errors.codigo.message}</div>}
                            </div>

                            <div className="form-group mb-4 title-black ">
                                <label htmlFor="cantidad">Precio</label>
                                <input
                                    type="float"
                                    className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                                    id="cantidad"
                                    {...register('precio')}
                                />
                                {errors.cantidad && <div className="invalid-feedback">{errors.cantidad.message}</div>}
                            </div>

                            <div className="form-group mb-4 title-black">
                                <label htmlFor="cantidad">Código de Lote</label>
                                <select
                                    className={`form-control ${errors.codigo_lote ? 'is-invalid' : ''}`}
                                    id="codigo_lote"
                                    {...register('codigo_lote')}
                                >
                                    <option value="">Seleccionar Lote</option>
                                    {lotes && lotes.map(lote => (
                                        <option key={lote.id} value={lote.id}>{lote.codigo}</option>
                                    ))}
                                </select>
                                {errors.codigo_lote && <div className="invalid-feedback">{errors.codigo_lote.message}</div>}
                            </div>

                            <button className="mt-4 w-100 gradient-custom-4" type="submit">Registrar</button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        </div >
    );
}
