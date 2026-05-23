import React, { useState } from 'react';
import './EjercicioUseState2.css';

export default function EjercicioUseState2() {
  const [paquete, setPaquete] = useState({
    nombreRemitente: '',
    direccionRemitente: '',
    nombreDestinatario: '',
    direccionDestinatario: '',
    peso: 0,
  });

  function GuardarEstados(e) {
    const { name, value } = e.target;
    setPaquete({
      ...paquete,
      [name]: value,
    });
  }

  function BorrarEstados() {
    setPaquete({
      nombreRemitente: '',
      direccionRemitente: '',
      nombreDestinatario: '',
      direccionDestinatario: '',
      peso: 0,
    });
  }

  return (
    <div
      className="contenedor"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <div className="tarjeta">
        <h2 className="text-center mb-4">Paqueteria Express15</h2>
        <form className="paquete">
          <div className="mb-3 alinear">
            <label htmlFor="nombreRemitente" className="form-label">
              Nombre del Remitente:
            </label>
            <input
              onChange={(e) => GuardarEstados(e)}
              id="nombreRemitente"
              name="nombreRemitente"
              type="text"
              className="form-control"
            />
          </div>
          <div
            className="mb-3"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <label htmlFor="direccionRemitente" className="form-label">
              Dirección del Remitente:
            </label>
            <textarea
              onChange={(e) => GuardarEstados(e)}
              name="direccionRemitente"
              id="direccionRemitente"
              className="form-control"
            />
          </div>
          <div className="mb-3 alinear">
            <label htmlFor="nombreDestinatario" className="form-label">
              Nombre del Destinatario:
            </label>
            <input
              onChange={(e) => GuardarEstados(e)}
              name="nombreDestinatario"
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
            <textarea
              onChange={(e) => GuardarEstados(e)}
              name="direccionDestinatario"
              id="direccionDestinatario"
              className="form-control"
            />
          </div>
          <div className="mb-3 alinear">
            <label htmlFor="peso" className="form-label">
              Peso del Paquete (kg):
            </label>
            <input
              onChange={(e) => GuardarEstados(e)}
              name="peso"
              id="peso"
              type="number"
              className="form-control"
            />
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
              <p>{paquete.nombreRemitente}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Dirección del Remitente:</label>
              <p>{paquete.direccionRemitente}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Nombre del Destinatario:</label>
              <p>{paquete.nombreDestinatario}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Dirección del Destinatario:</label>
              <p>{paquete.direccionDestinatario}</p>
            </div>
            <div className="mb-3 alinear">
              <label className="form-label">Peso del Paquete (kg):</label>
              <p>{paquete.peso}</p>
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
