function HistoryCard({ icono, titulo, datos }) {
  return (
    <div className="card history-card">
      <div className="card-title">
        {icono}
        <h3>{titulo}</h3>
      </div>

      {datos.map((item, index) => (
        <div className="history-item" key={index}>
          <div>
            <strong>{item.nombre}</strong>
            <span>{item.descripcion}</span>
          </div>
          <p>{item.fecha}</p>
        </div>
      ))}
    </div>
  )
}

export default HistoryCard