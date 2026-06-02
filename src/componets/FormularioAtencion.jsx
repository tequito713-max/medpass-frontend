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

const API_URL = "https://localhost:7121/v1";


export default function FormularioAtencion({
  pacienteId,
  medicoId,
  onCerrar,
  onGuardado,
  consultaEditar,
}) {
  const [guardando, setGuardando] = useState(false);

  const [consulta, setConsulta] = useState({
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
    diagnostico: "",
    observaciones: "",
    clinicaId: "",
  });

  const [receta, setReceta] = useState({
    medicamento: "",
    dosis: "",
    duracion: "",
    indicaciones: "",
  });

  const [estudio, setEstudio] = useState({
    tipo: "",
    clinicaLaboratorio: "",
    hospital: "",
    fechaProgramada: "",
    indicaciones: "",
  });

  useEffect(() => {
    if (consultaEditar) {
      setConsulta({
        fecha: consultaEditar.fecha
          ? consultaEditar.fecha.split("T")[0]
          : new Date().toISOString().split("T")[0],
        motivo: consultaEditar.motivo || "",
        diagnostico: consultaEditar.diagnostico || "",
        observaciones: consultaEditar.observaciones || "",
        clinicaId: consultaEditar.clinicaId || "",
      });
    }
  }, [consultaEditar]);

  const manejarConsulta = (e) => {
    setConsulta({
      ...consulta,
      [e.target.name]: e.target.value,
    });
  };

  const manejarReceta = (e) => {
    setReceta({
      ...receta,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEstudio = (e) => {
    setEstudio({
      ...estudio,
      [e.target.name]: e.target.value,
    });
  };

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
        observaciones: consulta.observaciones,
        pacienteId: pacienteId,
        medicoId: medicoId,
        clinicaId: consulta.clinicaId ? Number(consulta.clinicaId) : 1,
      };

      console.log("Consulta enviada:", consultaPayload);

      let consultaId = null;

      if (consultaEditar) {
        const respuestaConsulta = await fetch(
          `${API_URL}/Consultas/${consultaEditar.id}`,
          {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(consultaPayload),
          }
        );

        if (!respuestaConsulta.ok) {
          const errorTexto = await respuestaConsulta.text();
          console.log("Error al actualizar consulta:", errorTexto);
          throw new Error("No se pudo actualizar la consulta");
        }

        alert("Consulta actualizada correctamente");

        if (onGuardado) {
          onGuardado();
        } else {
          onCerrar();
        }

        return;
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

      if (receta.medicamento.trim() !== "") {
        const recetaPayload = {
          medicamento: receta.medicamento,
          dosis: receta.dosis,
          duracion: receta.duracion,
          indicaciones: receta.indicaciones,
          consultaId: consultaId,
        };

        console.log("Receta enviada:", recetaPayload);

        const respuestaReceta = await fetch(`${API_URL}/Recetas`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(recetaPayload),
        });

        if (!respuestaReceta.ok) {
          const errorTexto = await respuestaReceta.text();
          console.log("Error al guardar receta:", errorTexto);
          throw new Error(
            "La consulta se guardó, pero no se pudo guardar la receta"
          );
        }
      }

      if (estudio.tipo.trim() !== "") {
        const estudioPayload = {
          tipo: estudio.tipo,
          resultado: "Pendiente",
          fecha: estudio.fechaProgramada
            ? new Date(estudio.fechaProgramada).toISOString()
            : new Date().toISOString(),
          pacienteId: pacienteId,
          clinicaId: consulta.clinicaId ? Number(consulta.clinicaId) : 1,
        };

        console.log("Estudio enviado:", estudioPayload);

        const respuestaEstudio = await fetch(`${API_URL}/Estudios`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(estudioPayload),
        });

        if (!respuestaEstudio.ok) {
          const errorTexto = await respuestaEstudio.text();
          console.log("Error al guardar estudio:", errorTexto);
          throw new Error(
            "La consulta se guardó, pero no se pudo guardar el estudio"
          );
        }
      }

      alert("Atención médica registrada correctamente");

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
                  ID Clínica / Hospital
                </label>
                <input
                  type="number"
                  name="clinicaId"
                  value={consulta.clinicaId}
                  onChange={manejarConsulta}
                  placeholder="Ejemplo: 1"
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

            <div className="campo">
              <label>Observaciones</label>
              <textarea
                name="observaciones"
                value={consulta.observaciones}
                onChange={manejarConsulta}
                placeholder="Indicaciones generales o notas del doctor..."
              />
            </div>
          </section>

          {!consultaEditar && (
            <>
              <section className="seccion-form">
                <h3>
                  <Pill size={20} />
                  Receta médica
                </h3>

                <div className="grid-form">
                  <div className="campo">
                    <label>Medicamento</label>
                    <input
                      type="text"
                      name="medicamento"
                      value={receta.medicamento}
                      onChange={manejarReceta}
                      placeholder="Ejemplo: Paracetamol"
                    />
                  </div>

                  <div className="campo">
                    <label>Dosis</label>
                    <input
                      type="text"
                      name="dosis"
                      value={receta.dosis}
                      onChange={manejarReceta}
                      placeholder="Ejemplo: 500 mg"
                    />
                  </div>
                </div>

                <div className="grid-form">
                  <div className="campo">
                    <label>Duración</label>
                    <input
                      type="text"
                      name="duracion"
                      value={receta.duracion}
                      onChange={manejarReceta}
                      placeholder="Ejemplo: 5 días"
                    />
                  </div>

                  <div className="campo">
                    <label>Indicaciones</label>
                    <input
                      type="text"
                      name="indicaciones"
                      value={receta.indicaciones}
                      onChange={manejarReceta}
                      placeholder="Ejemplo: Cada 8 horas después de comer"
                    />
                  </div>
                </div>
              </section>

              <section className="seccion-form">
                <h3>
                  <FlaskConical size={20} />
                  Estudios solicitados
                </h3>

                <div className="grid-form">
                  <div className="campo">
                    <label>Tipo de estudio</label>
                    <input
                      type="text"
                      name="tipo"
                      value={estudio.tipo}
                      onChange={manejarEstudio}
                      placeholder="Ejemplo: Biometría hemática"
                    />
                  </div>

                  <div className="campo">
                    <label>Fecha programada</label>
                    <input
                      type="date"
                      name="fechaProgramada"
                      value={estudio.fechaProgramada}
                      onChange={manejarEstudio}
                    />
                  </div>
                </div>

                <div className="grid-form">
                  <div className="campo">
                    <label>Clínica / Laboratorio</label>
                    <input
                      type="text"
                      name="clinicaLaboratorio"
                      value={estudio.clinicaLaboratorio}
                      onChange={manejarEstudio}
                      placeholder="Ejemplo: Laboratorio Santa María"
                    />
                  </div>

                  <div className="campo">
                    <label>Hospital</label>
                    <input
                      type="text"
                      name="hospital"
                      value={estudio.hospital}
                      onChange={manejarEstudio}
                      placeholder="Ejemplo: Hospital General"
                    />
                  </div>
                </div>

                <div className="campo">
                  <label>Indicaciones del estudio</label>
                  <textarea
                    name="indicaciones"
                    value={estudio.indicaciones}
                    onChange={manejarEstudio}
                    placeholder="Ejemplo: Presentarse en ayunas..."
                  />
                </div>
              </section>
            </>
          )}

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