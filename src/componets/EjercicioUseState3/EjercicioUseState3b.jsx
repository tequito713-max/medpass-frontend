export default function EjercicioUseState3b({ pkg, setPaquete }) {
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
    <div className="tarjeta">
      <h2 className="text-center mb-4">Paquete Guardado</h2>
      <div className="paquete">
        <div className="text-center">
          <div className="mb-3 alinear">
            <label className="form-label">Nombre del Remitente:</label>
            <p>{pkg.nombreRemitente}</p>
          </div>
          <div className="mb-3 alinear">
            <label className="form-label">Dirección del Remitente:</label>
            <p>{pkg.direccionRemitente}</p>
          </div>
          <div className="mb-3 alinear">
            <label className="form-label">Nombre del Destinatario:</label>
            <p>{pkg.nombreDestinatario}</p>
          </div>
          <div className="mb-3 alinear">
            <label className="form-label">Dirección del Destinatario:</label>
            <p>{pkg.direccionDestinatario}</p>
          </div>
          <div className="mb-3 alinear">
            <label className="form-label">Peso del Paquete (kg):</label>
            <p>{pkg.peso}</p>
          </div>
        </div>
        <button
          onClick={() => BorrarEstados()}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
          type="button"
        >
          Borrar estados
        </button>
      </div>
    </div>
  );
}
