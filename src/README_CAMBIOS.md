# Cambios realizados

Se partio del `src.zip` funcional.

Cambios de organizacion:
- Se separo `styles/global.css` en archivos CSS por seccion.
- Se dejo `styles/global.original.css` como respaldo.

Cambios de permisos:
- Si el usuario tiene rol `Paciente`, entra directo a su propio perfil usando `pacienteId`.
- El paciente no puede abrir la lista de pacientes.
- El paciente no puede registrar pacientes nuevos.
- El boton Volver del perfil no aparece para paciente.

No se movio la carpeta `componets` para no romper imports.
