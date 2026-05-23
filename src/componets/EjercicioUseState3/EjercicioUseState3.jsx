import React, { useState } from 'react';
import './EjercicioUseState3.css';
import Ejercicio18a from './EjercicioUseState3a';
import Ejercicio18b from './EjercicioUseState3b';

export default function EjercicioUseState3() {
  const [paquete, setPaquete] = useState({
    nombreRemitente: '',
    direccionRemitente: '',
    nombreDestinatario: '',
    direccionDestinatario: '',
    peso: 0,
  });
  return (
    <div
      className="contenedor"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Ejercicio18a setPaquete={setPaquete} />
      <Ejercicio18b pkg={paquete} setPaquete={setPaquete} />
    </div>
  );
}
