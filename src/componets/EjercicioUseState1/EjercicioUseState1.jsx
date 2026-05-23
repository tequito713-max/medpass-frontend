import React, { useState } from 'react';
import './EjercicioUseState1.css';

export default function EjercicioUseState1() {
  const [nombreRemitente, setNombreRemitente] = useState('');
  const [direccionRemitente, setDireccionRemitente] = useState('');
  const [nombreDestinatario, setNombreDestinatario] = useState('');
  const [direccionDestinatario, setDireccionDestinatario] = useState('');
  const [pesoPaquete, setPesoPaquete] = useState('');

  function GuardarEstados() {
    const txtNombreRemitente = document.getElementById('nombreRemitente').value;
    const txtDireccionRemitente =
      document.getElementById('direccionRemitente').value;
    const txtNombreDestinatario =
      document.getElementById('nombreDestinatario').value;
    const txtDireccionDestinatario = document.getElementById(
      'direccionDestinatario'
    ).value;
    const txtPeso = document.getElementById('peso').value;

    setPesoPaquete(txtPeso);
    setNombreRemitente(txtNombreRemitente);
    setDireccionRemitente(txtDireccionRemitente);
    setNombreDestinatario(txtNombreDestinatario);
    setDireccionDestinatario(txtDireccionDestinatario);
  }

  function BorrarEstados() {
    setNombreRemitente('');
    setDireccionRemitente('');
    setNombreDestinatario('');
    setDireccionDestinatario('');
    setPesoPaquete('');
  }

  return (
    <div
      className="contenedor"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <div className="tarjeta">
        <h2 className="text-center mb-4">Paqueteria Express</h2>
        <form className="paquete">
          <div className="mb-3 alinear">
            <label htmlFor="nombreRemitente" className="form-label">
              Nombre del Remitente:
            </label>
            <input id="nombreRemitente" type="text" className="form-control" />
          </div>
          <div
            className="mb-3"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <label htmlFor="direccionRemitente" className="form-label">
              Dirección del Remitente:
            </label>
            <textarea id="direccionRemitente" className="form-control" />
          </div>
          <div className="mb-3 alinear">
            <label htmlFor="nombreDestinatario" className="form-label">
              Nombre del Destinatario:
            </label>
            <input
              id="nombreDestinatario"
              type="text"
              className="form-control"
            />
          </div>
          <div
            className="mb-3"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <label htmlFor="direccionDestinatario" className="form-label">
              Dirección del Destinatario:
            </label>
            <textarea id="direccionDestinatario" className="form-control" />
          </div>
          <div className="mb-3 alinear">
            <label htmlFor="peso" className="form-label">
              Peso del Paquete (kg):
            </label>
            <input id="peso" type="number" className="form-control" />
          </div>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-warning btn-lg"
              onClick={() => GuardarEstados()}
            >
              Guardar Estados
            </button>
          </div>
        </form>
      </div>

      {/* TARJETA PAQUETE GUARDADO */}
      <div className="tarjeta">
        <h2 className="text-center mb-4">Paquete Guardado</h2>
        <div className="paquete">
          <div className="text-center">
            <div className="mb-3 alinear">
              <label className="form-label">Nombre del Remitente:</label>
              <p>{nombreRemitente}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Dirección del Remitente:</label>
              <p>{direccionRemitente}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Nombre del Destinatario:</label>
              <p>{nombreDestinatario}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Dirección del Destinatario:</label>
              <p>{direccionDestinatario}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Peso del Paquete (kg):</label>
              <p>{pesoPaquete}</p>
            </div>
          </div>
          <button
            className="btn btn-warning btn-lg"
            onClick={() => BorrarEstados()}
            style={{ width: '100%' }}
            type="button"
          >
            Borrar estados
          </button>
        </div>
      </div>
    </div>
  );
}
