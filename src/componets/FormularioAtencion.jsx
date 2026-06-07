import { useEffect, useState } from "react";
import {
  X,
  Save,
  ClipboardPlus,
  Pill,
  FlaskConical,
  Building2,
  CalendarDays,
} from "lucide-react";
import "./FormularioAtencion.css";

//const API_URL = "https://localhost:7121/v1";
const API_URL = 'https://d35t58c2fgfu9s.cloudfront.net/v1'


export default function FormularioAtencion({
  pacienteId,
  medicoId,
  medicos = [],
  clinicas = [],
  onCerrar,
  onGuardado,
  consultaEditar,
}) {

  const [guardando, setGuardando] = useState(false);

  const [consulta, setConsulta] = useState({
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
    diagnostico: "",
    clinicaId: "",
  });

  const [recetas, setRecetas] = useState([
  {
      medicamento: "",
      dosis: "",
      duracion: "",
    },
  ])
  const [recetasEliminadas, setRecetasEliminadas] = useState([])

  const [estudios, setEstudios] = useState([
    {
      id: "",
      tipo: "",
      fechaProgramada: "",
    },
  ])

  const medicoActual = medicos.find(
    (medico) => String(medico.id) === String(medicoId)
  )

  const clinicaActual = clinicas.find(
    (clinica) => String(clinica.id) === String(medicoActual?.clinicaId)
  )

  const clinicaIdFinal = consultaEditar
    ? consulta.clinicaId
    : medicoActual?.clinicaId

  useEffect(() => {
    if (consultaEditar) {
      setRecetasEliminadas([])
      setConsulta({
        fecha: consultaEditar.fecha
          ? consultaEditar.fecha.split("T")[0]
          : new Date().toISOString().split("T")[0],
        motivo: consultaEditar.motivo || "",
        diagnostico: consultaEditar.diagnostico || "",
        clinicaId: consultaEditar.clinicaId || "",
      })

     if (consultaEditar.recetas && consultaEditar.recetas.length > 0) {
       setRecetas(
         consultaEditar.recetas.map((receta) => ({
           id: receta.id || "",
           medicamento: receta.medicamento || "",
           dosis: receta.dosis || "",
           duracion: receta.duracion || "",
         }))
       )
     } else {
       setRecetas([
         {
           id: "",
           medicamento: "",
           dosis: "",
           duracion: "",
         },
       ])
     }
     }
  }, [consultaEditar])

  const cambiarReceta = (index, campo, valor) => {
    const nuevasRecetas = [...recetas]

    nuevasRecetas[index] = {
      ...nuevasRecetas[index],
      [campo]: valor,
    }

    setRecetas(nuevasRecetas)
  }

  const agregarMedicamento = () => {
    setRecetas([
      ...recetas,
      {
        id: "",
        medicamento: "",
        dosis: "",
        duracion: "",
      },
    ])
  }

  const eliminarMedicamento = (index) => {
    const recetaEliminada = recetas[index]

    if (recetaEliminada.id) {
      setRecetasEliminadas([
        ...recetasEliminadas,
        recetaEliminada.id,
      ])
    }

    const nuevasRecetas = recetas.filter((_, i) => i !== index)
    setRecetas(nuevasRecetas)
  }

  const manejarConsulta = (e) => {
      setConsulta({
        ...consulta,
        [e.target.name]: e.target.value,
      });
    };

    const cambiarEstudio = (index, campo, valor) => {
    const nuevosEstudios = [...estudios]

    nuevosEstudios[index] = {
      ...nuevosEstudios[index],
      [campo]: valor,
    }

    setEstudios(nuevosEstudios)
  }

  const agregarEstudio = () => {
    setEstudios([
      ...estudios,
      {
        id: "",
        tipo: "",
        fechaProgramada: "",
      },
    ])
  }

  const eliminarEstudio = (index) => {
    const nuevosEstudios = estudios.filter((_, i) => i !== index)
    setEstudios(nuevosEstudios)
  }

  const guardarAtencion = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const consultaPayload = {
        fecha: consulta.fecha
          ? new Date(consulta.fecha).toISOString()
          : new Date().toISOString(),
        motivo: consulta.motivo,
        diagnostico: consulta.diagnostico,
        observaciones: "",
        pacienteId: pacienteId,
        medicoId: medicoId,
        clinicaId: Number(clinicaIdFinal),
      };

      console.log("Consulta enviada:", consultaPayload);

      let consultaId = null;

      if (consultaEditar) {
        // 1. Actualizar consulta
        const respuestaConsulta = await fetch(
          `${API_URL}/Consultas/${consultaEditar.id}`,
          {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(consultaPayload),
          }
        )

        if (!respuestaConsulta.ok) {
          const errorTexto = await respuestaConsulta.text()
          console.log("Error al actualizar consulta:", errorTexto)
          throw new Error("No se pudo actualizar la consulta")
        }

        // 2. Eliminar recetas 
        for (const recetaId of recetasEliminadas) {
          const respuestaEliminar = await fetch(`${API_URL}/Recetas/${recetaId}`, {
            method: "DELETE",
            headers: headers,
          })

          if (!respuestaEliminar.ok) {
            const errorTexto = await respuestaEliminar.text()
            console.log("Error al eliminar receta:", errorTexto)
            throw new Error("No se pudo eliminar una receta")
          }
        }

        // 3. Actualizar o agregar recetas
        for (const receta of recetas) {
          if (receta.medicamento.trim() !== "") {
            const recetaPayload = {
              medicamento: receta.medicamento,
              dosis: receta.dosis,
              duracion: receta.duracion,
              consultaId: consultaEditar.id,
            }

            if (receta.id) {
              const respuestaReceta = await fetch(`${API_URL}/Recetas/${receta.id}`, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(recetaPayload),
              })

              if (!respuestaReceta.ok) {
                const errorTexto = await respuestaReceta.text()
                console.log("Error al actualizar receta:", errorTexto)
                throw new Error("No se pudo actualizar la receta")
              }
            } else {
              const respuestaReceta = await fetch(`${API_URL}/Recetas`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(recetaPayload),
              })

              if (!respuestaReceta.ok) {
                const errorTexto = await respuestaReceta.text()
                console.log("Error al agregar receta:", errorTexto)
                throw new Error("No se pudo agregar una receta nueva")
                alert("Error al agregar receta")
              }
            }
          }
        }

        

        if (onGuardado) {
          onGuardado()
        } else {
          onCerrar()
        }

        return
      }

      const respuestaConsulta = await fetch(`${API_URL}/Consultas`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(consultaPayload),
      });

      if (!respuestaConsulta.ok) {
        const errorTexto = await respuestaConsulta.text();
        console.log("Error al guardar consulta:", errorTexto);
        throw new Error("No se pudo guardar la consulta");
      }

      const consultaCreada = await respuestaConsulta.json();
      console.log("Consulta guardada:", consultaCreada);

      consultaId = consultaCreada.id || consultaCreada.Id;

      for (const receta of recetas) {
        if (receta.medicamento.trim() !== "") {
          const recetaPayload = {
            medicamento: receta.medicamento,
            dosis: receta.dosis,
            duracion: receta.duracion,
            indicaciones: "",
            consultaId: consultaId,
          }

          console.log("Receta enviada:", recetaPayload)

          const respuestaReceta = await fetch(`${API_URL}/Recetas`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(recetaPayload),
          })

          if (!respuestaReceta.ok) {
            const errorTexto = await respuestaReceta.text()
            console.log("Error al guardar receta:", errorTexto)
            throw new Error(
              "La consulta se guardó, pero no se pudo guardar una receta"
            )
          }
        }
      }

      for (const estudio of estudios) {
      if (estudio.tipo.trim() !== "") {
        const estudioPayload = {
          tipo: estudio.tipo,
          resultado: "Pendiente",
          fecha: estudio.fechaProgramada
            ? new Date(estudio.fechaProgramada).toISOString()
            : new Date().toISOString(),
          pacienteId: pacienteId,
          clinicaId: Number(clinicaIdFinal),
        }

        console.log("Estudio enviado:", estudioPayload)

        const respuestaEstudio = await fetch(`${API_URL}/Estudios`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(estudioPayload),
        })

        if (!respuestaEstudio.ok) {
          const errorTexto = await respuestaEstudio.text()
          console.log("Error al guardar estudio:", errorTexto)
          throw new Error(
            "La consulta se guardó, pero no se pudo guardar un estudio"
          )
        }
      }
    }

      

      if (onGuardado) {
        onGuardado();
      } else {
        onCerrar();
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-atencion-fondo">
      <div className="modal-atencion">
        <div className="modal-atencion-header">
          <div>
            <h2>
              {consultaEditar
                ? "Actualizar atención médica"
                : "Registrar nueva atención"}
            </h2>   
            <p>
              {consultaEditar
                ? "Corrige los datos de la consulta médica seleccionada."
                : "Agrega consulta, receta y estudios al historial del paciente."}
            </p>
          </div>

          <button className="btn-cerrar" onClick={onCerrar}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={guardarAtencion} className="form-atencion">
          <section className="seccion-form">
            <h3>
              <ClipboardPlus size={20} />
              Datos de la consulta
            </h3>

            <div className="grid-form">
              <div className="campo">
                <label>
                  <CalendarDays size={16} />
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={consulta.fecha}
                  onChange={manejarConsulta}
                  required
                />
              </div>

              <div className="campo">
                <label>
                  <Building2 size={16} />
                  Clínica / Hospital
                </label>
                <input
                  type="text"
                  value={clinicaActual?.nombre || 'Clínica no encontrada'}
                  disabled
                />
              </div>
            </div>

            <div className="campo">
              <label>Motivo de consulta</label>
              <textarea
                name="motivo"
                value={consulta.motivo}
                onChange={manejarConsulta}
                placeholder="Ejemplo: Dolor de cabeza, fiebre, revisión general..."
                required
              />
            </div>

            <div className="campo">
              <label>Diagnóstico</label>
              <textarea
                name="diagnostico"
                value={consulta.diagnostico}
                onChange={manejarConsulta}
                placeholder="Ejemplo: Infección respiratoria..."
                required
              />
            </div>
          </section>

          
            <>
             <section className="seccion-form">
              <h3>
                <Pill size={20} />
                Receta médica
              </h3>

              {recetas.map((receta, index) => (
                <div key={index} className="receta-item">
                  <div className="titulo-receta-item">
                    <h4>Medicamento {index + 1}</h4>

                    {recetas.length > 1 && (
                      <button
                        type="button"
                        className="btn-eliminar-medicamento"
                        onClick={() => eliminarMedicamento(index)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid-form">
                    <div className="campo">
                      <label>Medicamento</label>
                      <input
                        type="text"
                        value={receta.medicamento}
                        onChange={(e) =>
                          cambiarReceta(index, "medicamento", e.target.value)
                        }
                        placeholder="Ejemplo: Paracetamol"
                      />
                    </div>

                    <div className="campo">
                      <label>Dosis</label>
                      <input
                        type="text"
                        value={receta.dosis}
                        onChange={(e) =>
                          cambiarReceta(index, "dosis", e.target.value)
                        }
                        placeholder="Ejemplo: 500 mg"
                      />
                    </div>
                  </div>

                  <div className="grid-form">
                    <div className="campo">
                      <label>Duración</label>
                      <input
                        type="text"
                        value={receta.duracion}
                        onChange={(e) =>
                          cambiarReceta(index, "duracion", e.target.value)
                        }
                        placeholder="Ejemplo: 5 días"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn-agregar-medicamento"
                onClick={agregarMedicamento}
              >
                + Agregar otro medicamento
              </button>
            </section>
       
              {!consultaEditar && (
                <section className="seccion-form">
                  <h3>
                    <FlaskConical size={20} />
                    Estudios solicitados
                  </h3>

                  {estudios.map((estudio, index) => (
                    <div key={index} className="receta-item">
                      <div className="titulo-receta-item">
                        <h4>Estudio {index + 1}</h4>

                        {estudios.length > 1 && (
                          <button
                            type="button"
                            className="btn-eliminar-medicamento"
                            onClick={() => eliminarEstudio(index)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>

                      <div className="grid-form">
                        <div className="campo">
                          <label>Tipo de estudio</label>
                          <input
                            type="text"
                            value={estudio.tipo}
                            onChange={(e) =>
                              cambiarEstudio(index, "tipo", e.target.value)
                            }
                            placeholder="Ejemplo: Biometría hemática"
                          />
                        </div>

                        <div className="campo">
                          <label>Fecha programada</label>
                          <input
                            type="date"
                            value={estudio.fechaProgramada}
                            onChange={(e) =>
                              cambiarEstudio(index, "fechaProgramada", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-agregar-medicamento"
                    onClick={agregarEstudio}
                  >
                    + Agregar otro estudio
                  </button>
                </section>
              )}
            </>
          

          <div className="acciones-form">
            <button type="button" className="btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>

            <button type="submit" className="btn-guardar" disabled={guardando}>
              <Save size={18} />
              {guardando
                ? "Guardando..."
                : consultaEditar
                ? "Actualizar atención"
                : "Guardar atención"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}