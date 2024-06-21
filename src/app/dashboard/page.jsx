'use client';

import { all_product_valid } from "../../hooks/Service_product";
import Cookies from 'js-cookie';
import Menu from "../componentes/navbar/menu";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import swal from 'sweetalert';
import './dash.css';
import Table from 'react-bootstrap/Table';


export default function Dashboard() {
    const router = useRouter();
    let token = Cookies.get('token');

    if (!token) {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/session');
        router.refresh();
    }



    let [productos, setProducto] = useState(null);
    let [estado, setEstado] = useState(false);
    if (!estado) {
        all_product_valid(token).then((info) => {
            console.log(info);
            if (info.code == 200) {
                setProducto(info.datos)
            }
            else {
                //para cuando no hay datos 
            }
        });
        setEstado(true);
    }
    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toDateString();
    };


    return (

        <div>
            <Menu />
            <div className="container title-black">
            <label>Lista de productos</label>
                <div className="table-container">
                
                <Table responsive>
                    
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Producto</th>
                                <th>Lote</th>
                                <th>Fecha de vencimiento</th>
                                <th>Precio</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos ? productos.map((producto, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.lote.codigo}</td>
                                    <td>{formatFecha(producto.lote.fecha_vencimiento)}</td>
                                    <td>{producto.precio}</td>
                                    <td>{producto.estado}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6">Cargando productos...</td>
                                </tr>
                            )}
                        </tbody>
                        </Table>    
                </div>
            </div>
        </div>
    );
}