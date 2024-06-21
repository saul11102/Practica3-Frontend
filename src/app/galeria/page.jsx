'use client';

import React, { useEffect, useState } from 'react';
import { save_photo, list_photos } from '../../hooks/Service_person';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import Menu from "../componentes/navbar/menu";
import './signStyle.css';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';

const PhotoGallery = () => {
    const [photos, setPhotos] = useState([]);
    const [estado, setEstado] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const token = Cookies.get('token');
    const router = useRouter();

    if (!token) {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/session');
        router.refresh();
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        if (token && !estado) {
            list_photos(token).then((info) => {
                console.log(info);
                if (info) {
                    setPhotos(info);
                } else {
                    console.log("No se pudo cargar las fotos");
                }
                setEstado(true);
            });
        }
    }, [token, estado]);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        save_photo(formData, token).then((info) => {
            if (info.code == '200') {
                swal({
                    title: "INFO",
                    text: "Imagen Guardada",
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
        });
    };

    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    const toggleForm = () => setShowForm(!showForm);

    return (
        <div>
            <Menu />
            <Container>
                <Button variant="primary" onClick={toggleForm}>Agregar Nueva Foto</Button>
                <Modal show={showForm} onHide={toggleForm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Nueva Foto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(handleUpload)}>
                            <div className="form-group mb-4 title-black">
                                <label htmlFor="file">Seleccionar imagen</label>
                                <input
                                    type="file"
                                    className={`form-control ${errors.file ? 'is-invalid' : ''}`}
                                    id="file"
                                    onChange={handleFileChange}
                                    required
                                />
                                {errors.file && <div className="invalid-feedback">Debe seleccionar una imagen</div>}
                            </div>
                            <Button variant="primary" type="submit">Subir Foto</Button>
                        </form>
                    </Modal.Body>
                </Modal>
                <h1 className="my-4 text-center title-black">Photo Gallery</h1>
                <Row>
                    {photos.map((photo, index) => (
                        <Col key={index} sm={6} md={4} lg={3} className="mb-4">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.URL_API}media/${photo}`}
                                    alt={photo}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

            </Container>
        </div>
    );
};

export default PhotoGallery;