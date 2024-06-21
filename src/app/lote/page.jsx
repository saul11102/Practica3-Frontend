'use client';
import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import './signStyle.css';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import Menu from "../componentes/navbar/menu";
import swal from 'sweetalert';
import { all_lote, save_lote } from '../../hooks/Service_lote';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';    
import Modal from 'react-bootstrap/Modal';


export default function newLote() {
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();
    const token = Cookies.get('token');

    if (!token) {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/session');
        router.refresh();
    }

    let [lotes, setLotes] = useState(null);
    let [estado, setEstado] = useState(false);

    if (!estado) {
        all_lote(token).then((info) => {
            if (info.code == 200) {
                setLotes(info.datos)
            }
            else {
                console.log("No se pudo cargar los lotes");
            }
        });
        setEstado(true);
    }
    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toDateString();
    };

    //validación de campos 
    const validationSchema = yup.object().shape({
        codigo: yup.string().required('Campo obligatorio'),
        fecha_vencimiento: yup.string().required('Campo obligatorio'),
        cantidad: yup.string().required('Campo obligatorio'),
    });



    //validar formulario
    const formOption = { resolver: yupResolver(validationSchema) };
    //envío de formulario
    const { register, handleSubmit, formState } = useForm(formOption);
    const reset = useForm(formOption);

    let { errors } = formState;

    const toggleForm = () => setShowForm(!showForm);    

    const enviar_data = (data) => {
        save_lote(data, token).then((info) => {
            if (info.code == '200') {
                console.log("Datos registrados");
                console.log(info);
                swal({
                    title: "INFO",
                    text: "Lote Guardado",
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
                    <h2 className="text-uppercase mb-0 title-black">Lotes</h2>
                    <Button variant="primary" onClick={toggleForm}>Agregar Nuevo Lote</Button>
                </div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Código</th>
                            <th>Cantidad</th>
                            <th>Fecha de llegada</th>
                            <th>Fecha de vencimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotes ? lotes.map((lote, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{lote.codigo}</td>
                                <td>{lote.cantidad}</td>
                                <td>{formatFecha(lote.fecha_llegada)}</td>
                                <td>{formatFecha(lote.fecha_vencimiento)}</td>
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
                                <label htmlFor="codigo">Código de lote</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                                    id="codigo"
                                    {...register('codigo')}
                                />
                                {errors.codigo && <div className="invalid-feedback">{errors.codigo.message}</div>}
                            </div>

                            <div className="form-group mb-4 title-black">
                                <label htmlFor="cantidad">Cantidad de productos</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                                    id="cantidad"
                                    {...register('cantidad')}
                                />
                                {errors.cantidad && <div className="invalid-feedback">{errors.cantidad.message}</div>}
                            </div>

                            <div className="form-group mb-4 title-black">
                                <label htmlFor="fecha_vencimiento">Fecha de vencimiento</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.fecha_vencimiento ? 'is-invalid' : ''}`}
                                    id="fecha_vencimiento"
                                    {...register('fecha_vencimiento')}
                                />
                                {errors.fecha_vencimiento && <div className="invalid-feedback">{errors.fecha_vencimiento.message}</div>}
                            </div>

                            <Button variant="primary" type="submit">Registrar</Button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}