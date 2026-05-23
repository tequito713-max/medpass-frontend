function InfoItem({ titulo, valor, large }) {
  return (
    <div className={large ? 'info-item large' : 'info-item'}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  )
}

export default InfoItem