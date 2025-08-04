import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBur7OZoFQ_YCXp9cX3NIFHpDczWBcAVfo",
  authDomain: "registro-asistencias-907a9.firebaseapp.com",
  projectId: "registro-asistencias-907a9",
  storageBucket: "registro-asistencias-907a9.appspot.com",
  messagingSenderId: "167960843068",
  appId: "1:167960843068:web:2ea7aad6588c4f94668439"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const btnGestionAlumnos = document.getElementById('btnGestionAlumnos');
const btnRegistroAsistencia = document.getElementById('btnRegistroAsistencia');

const panelGestionAlumnos = document.getElementById('panelGestionAlumnos');
const panelRegistroAsistencia = document.getElementById('panelRegistroAsistencia');

const formAlumno = document.getElementById('formAlumno');
const nombreInput = document.getElementById('nombre');
const cursoSelect = document.getElementById('curso');
const listaAlumnosDiv = document.getElementById('listaAlumnos');

const cursoAsistenciaSelect = document.getElementById('cursoAsistencia');
const fechaAsistenciaInput = document.getElementById('fechaAsistencia');
const listaAsistenciaDiv = document.getElementById('listaAsistencia');
const btnGuardarAsistencia = document.getElementById('btnGuardarAsistencia');

// Mostrar panel según rol de usuario
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario logueado
    loginSection.style.display = 'none';
    appSection.style.display = 'block';
    cargarAlumnos();
    panelGestionAlumnos.style.display = 'block';
    panelRegistroAsistencia.style.display = 'none';
    fechaAsistenciaInput.valueAsDate = new Date();
  } else {
    // Usuario no logueado
    loginSection.style.display = 'block';
    appSection.style.display = 'none';
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Opcional: SweetAlert éxito
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    // Mostrar error con SweetAlert y en texto
    Swal.fire({
      icon: 'error',
      title: 'Error al iniciar sesión',
      text: error.message,
    });
    loginError.textContent = 'Error al iniciar sesión: ' + error.message;
  }
});

// Confirmar y cerrar sesión con SweetAlert
btnCerrarSesion.addEventListener('click', async () => {
  const result = await Swal.fire({
    title: '¿Seguro que quieres cerrar sesión?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    await signOut(auth);
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      showConfirmButton: false,
      timer: 1200
    });
  }
});

// Navegación paneles
btnGestionAlumnos.addEventListener('click', () => {
  panelGestionAlumnos.style.display = 'block';
  panelRegistroAsistencia.style.display = 'none';
  cargarAlumnos();
});

btnRegistroAsistencia.addEventListener('click', () => {
  panelGestionAlumnos.style.display = 'none';
  panelRegistroAsistencia.style.display = 'block';
});

// Función para cargar alumnos
async function cargarAlumnos() {
  listaAlumnosDiv.innerHTML = 'Cargando alumnos...';
  const q = query(collection(db, "alumnos"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    listaAlumnosDiv.innerHTML = '<p>No hay alumnos registrados.</p>';
    return;
  }

  listaAlumnosDiv.innerHTML = '';
  snapshot.forEach(docSnap => {
    const alumno = docSnap.data();
    const div = document.createElement('div');
    div.classList.add('alumno-item');
    div.textContent = `${alumno.nombre} (${alumno.curso})`;
    listaAlumnosDiv.appendChild(div);
  });
}

// Evento para agregar alumno
formAlumno.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const curso = cursoSelect.value;

  if (!nombre || !curso) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.'
    });
    return;
  }

  try {
    await addDoc(collection(db, "alumnos"), { nombre, curso });

    nombreInput.value = '';
    cursoSelect.value = '';
    cargarAlumnos();

    Swal.fire({
      icon: 'success',
      title: 'Alumno agregado',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al agregar alumno',
      text: error.message
    });
  }
});

// Función para cargar asistencias
async function cargarAsistencia() {
  listaAsistenciaDiv.innerHTML = '';

  const curso = cursoAsistenciaSelect.value;
  const fecha = fechaAsistenciaInput.value;

  if (!curso || !fecha) {
    listaAsistenciaDiv.innerHTML = '<p>Selecciona curso y fecha para cargar alumnos.</p>';
    return;
  }

  // Obtener alumnos del curso
  const qAlumnos = query(collection(db, "alumnos"), where("curso", "==", curso));
  const snapshotAlumnos = await getDocs(qAlumnos);

  if (snapshotAlumnos.empty) {
    listaAsistenciaDiv.innerHTML = '<p>No hay alumnos en este curso.</p>';
    return;
  }

  // Obtener asistencias para esa fecha y curso
  const qAsistencia = query(collection(db, "asistencias"), where("fecha", "==", fecha), where("curso", "==", curso));
  const snapshotAsistencia = await getDocs(qAsistencia);

  // Mapear asistencias para acceso rápido
  const mapaAsistencia = {};
  snapshotAsistencia.forEach(docSnap => {
    const data = docSnap.data();
    mapaAsistencia[data.alumnoId] = { estado: data.estado, id: docSnap.id };
  });

  // Construir lista para marcar asistencia
  snapshotAlumnos.forEach(docSnap => {
    const alumno = docSnap.data();
    const asistencia = mapaAsistencia[docSnap.id];
    const estado = asistencia ? asistencia.estado : 'A'; // A por defecto

    const div = document.createElement('div');
    div.classList.add('alumno');
    div.innerHTML = `
      <span>${alumno.nombre}</span>
      <select class="estado-asistencia" data-id="${docSnap.id}" data-asistencia-id="${asistencia ? asistencia.id : ''}">
        <option value="A" ${estado === 'A' ? 'selected' : ''}>A (Asistencia)</option>
        <option value="F" ${estado === 'F' ? 'selected' : ''}>F (Falta)</option>
        <option value="R" ${estado === 'R' ? 'selected' : ''}>R (Retraso)</option>
        <option value="L" ${estado === 'L' ? 'selected' : ''}>L (Licencia)</option>
      </select>
    `;
    listaAsistenciaDiv.appendChild(div);
  });
}

// Cargar lista asistencia cuando cambie curso o fecha
cursoAsistenciaSelect.addEventListener('change', cargarAsistencia);
fechaAsistenciaInput.addEventListener('change', cargarAsistencia);

// Guardar asistencias
btnGuardarAsistencia.addEventListener('click', async () => {
  const selects = document.querySelectorAll('.estado-asistencia');
  if (selects.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Nada para guardar',
      text: 'No hay alumnos para guardar.'
    });
    return;
  }

  try {
    for (const select of selects) {
      const estado = select.value;
      const alumnoId = select.dataset.id;
      const asistenciaId = select.dataset.asistenciaId;

      if (asistenciaId) {
        // Actualizar registro existente
        const docRef = doc(db, "asistencias", asistenciaId);
        await updateDoc(docRef, { estado });
      } else {
        // Crear nuevo registro
        await addDoc(collection(db, "asistencias"), {
          alumnoId,
          curso: cursoAsistenciaSelect.value,
          fecha: fechaAsistenciaInput.value,
          estado,
          timestamp: new Date()
        });
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'Asistencias guardadas',
      showConfirmButton: false,
      timer: 1500
    });
    cargarAsistencia();

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar asistencias',
      text: error.message
    });
  }
});

// Botón imprimir PDF
const btnImprimirPDF = document.getElementById('btnImprimirPDF');

btnImprimirPDF.addEventListener('click', async () => {
  const curso = cursoAsistenciaSelect.value;
  const fecha = fechaAsistenciaInput.value;

  if (!curso || !fecha) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan datos',
      text: 'Selecciona curso y fecha para imprimir.'
    });
    return;
  }

  // Cargar asistencias para el curso y fecha seleccionados
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text(`Lista de Asistencia - Curso: ${curso}, Fecha: ${fecha}`, 14, 20);

  // Traer alumnos + asistencias
  const qAlumnos = query(collection(db, "alumnos"), where("curso", "==", curso));
  const snapshotAlumnos = await getDocs(qAlumnos);

  if (snapshotAlumnos.empty) {
    Swal.fire({
      icon: 'info',
      title: 'Sin alumnos',
      text: 'No hay alumnos en este curso.'
    });
    return;
  }

  const qAsistencia = query(collection(db, "asistencias"), where("curso", "==", curso), where("fecha", "==", fecha));
  const snapshotAsistencia = await getDocs(qAsistencia);

  // Mapear asistencias
  const mapaAsistencia = {};
  snapshotAsistencia.forEach(docSnap => {
    const data = docSnap.data();
    mapaAsistencia[data.alumnoId] = data.estado;
  });

  // Preparar datos para tabla
  const filas = [];
  snapshotAlumnos.forEach(docSnap => {
    const alumno = docSnap.data();
    const estado = mapaAsistencia[docSnap.id] || 'A'; // Por defecto 'A'

    filas.push([
      alumno.nombre,
      estado
    ]);
  });

  // Generar tabla
  doc.autoTable({
    head: [['Nombre del Alumno', 'Estado']],
    body: filas,
    startY: 30,
    styles: { fontSize: 12 },
  });

  // Abrir PDF en nueva ventana (o descargar)
  doc.output('dataurlnewwindow');
});
