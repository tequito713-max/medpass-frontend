export default function EjercicioUseState3a({ setPaquete }) {
  function GuardarEstados() {
    setPaquete({
      nombreRemitente: document.getElementById('nombreRemitente').value,
      direccionRemitente: document.getElementById('direccionRemitente').value,
      nombreDestinatario: document.getElementById('nombreDestinatario').value,
      direccionDestinatario: document.getElementById('direccionDestinatario')
        .value,
      peso: document.getElementById('peso').value,
    });
  }
  return (
    <div className="tarjeta">
      <h2 className="text-center mb-4">Paqueteria Express 18</h2>
      <form className="paquete">
        <div className="mb-3 alinear">
          <label htmlFor="nombreRemitente" className="form-label">
            Nombre del Remitente:
          </label>
          <input
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
            name="direccionDestinatario"
            id="direccionDestinatario"
            className="form-control"
          />
        </div>
        <div className="mb-3 alinear">
          <label htmlFor="peso" className="form-label">
            Peso del Paquete (kg):
          </label>
          <input name="peso" id="peso" type="number" className="form-control" />
        </div>
        <div className="text-center">
          <button
            onClick={() => GuardarEstados()}
            type="button"
            className="btn btn-primary btn-lg"
          >
            Guardar Estados
          </button>
        </div>
      </form>
    </div>
  );
}
