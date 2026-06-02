function MedicalRow({ icono, titulo, valor }) {
  return (
    <div className="medical-row">
      <div className="medical-icon">
        {icono}
      </div>

      <div>
        <span>{titulo}</span>
        <strong>{valor}</strong>
      </div>
    </div>
  )
}

export default MedicalRow