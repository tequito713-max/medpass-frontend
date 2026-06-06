import { useState } from "react";
import { crearPacienteConCuenta } from "../services/api.js";

export default function RegistrarPaciente({ onPacienteRegistrado, onBack }) {
  const [form, setForm] = useState({
    curp: "",
    nombre: "",
    fechaNac: "",
    tipoSangre: "",
    telefono: "",
    email: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registrarPaciente = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const nuevoPaciente = {
        curp: form.curp,
        nombre: form.nombre,
        fechaNac: form.fechaNac,
        tipoSangre: form.tipoSangre,
        telefono: form.telefono,
        email: form.email,
        password: form.password,
      };

      const pacienteCreado = await crearPacienteConCuenta(nuevoPaciente);

      setMensaje("Paciente registrado correctamente");
      onPacienteRegistrado(pacienteCreado);
    } catch (error) {
      console.error(error);
      setMensaje("Error: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="small-logo">+</div>
          <div>
            <h2>MEDPASS</h2>
            <p>Registrar paciente</p>
          </div>
        </div>

        <button className="logout-button" onClick={onBack}>
          Volver
        </button>
      </header>

      <div className="registro-paciente-container">
        <div className="registro-card">
          <h2>Registrar nuevo paciente</h2>
          <p>Llena los datos para dar de alta al paciente.</p>

          <form onSubmit={registrarPaciente} className="registro-form">
            <label>CURP</label>
            <input
              type="text"
              name="curp"
              value={form.curp}
              onChange={manejarCambio}
              required
            />

            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={manejarCambio}
              required
            />

            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNac"
              value={form.fechaNac}
              onChange={manejarCambio}
              required
            />

            <label>Tipo de sangre</label>
            <input
              type="text"
              name="tipoSangre"
              value={form.tipoSangre}
              onChange={manejarCambio}
              placeholder="Ejemplo: O+"
            />

            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={manejarCambio}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={manejarCambio}
            />

            <label>Contraseña temporal</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={manejarCambio}
              required
            />

            <button type="submit" disabled={cargando}>
              {cargando ? "Guardando..." : "Registrar paciente"}
            </button>

            <button
              type="button"
              className="btn-secundario"
              onClick={onBack}
            >
              Volver
            </button>
          </form>

          {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
      </div>
    </main>
  );
}
