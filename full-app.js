// full-app.js 💖 Malla interactiva Economía PUCP

// Cursos que se van a insertar dinámicamente por nivel
const niveles = {
  5: [
    { id: "ECO255", nombre: "Microeconomía 1" },
    { id: "ECO290", nombre: "Macroeconomía 1" },
    { id: "MAT291", nombre: "Matemáticas para Economistas" },
    { id: "1ECO12", nombre: "Historia Económica del Perú" }
  ],
  6: [
    { id: "ECO263", nombre: "Microeconomía 2", prereqs: ["ECO255", "MAT291"] },
    { id: "ECO293", nombre: "Macroeconomía 2", prereqs: ["ECO290", "MAT291"] },
    { id: "EST241", nombre: "Estadística Inferencial" }
  ],
  7: [
    { id: "ECO208", nombre: "Economía Internacional", prereqs: ["ECO263", "ECO293"] },
    { id: "ECO220", nombre: "Historia del Pensamiento Económico" },
    { id: "1ECO11", nombre: "Fundamentos de Econometría", prereqs: ["ECO255", "ECO290", "EST241"] },
    { id: "1ECO23", nombre: "Introducción a la Economía Peruana", prereqs: ["1ECO11"] }
  ],
  8: [
    { id: "1ECO20", nombre: "Seminario de Investigación", prereqs: ["1ECO11"] }
  ],
  9: [
    { id: "1ECO47", nombre: "Seminario de Tesis 1", prereqs: ["1ECO20"] }
  ],
  10: [
    { id: "IDM304", nombre: "Idiomas" },
    { id: "1ECO48", nombre: "Seminario de Tesis 2", prereqs: ["1ECO47"] }
  ]
};

// Electivos organizados por tipo
const electivos = {
  A: [
    { id: "1ECO24", nombre: "Econometría Intermedia: Macro" },
    { id: "1ECO25", nombre: "Econometría Intermedia: Micro" }
  ],
  B: [
    { id: "1ECO14", nombre: "Economía Monetaria" },
    { id: "1ECO18", nombre: "Economía Pública" },
    { id: "1ECO19", nombre: "Teoría del Crecimiento" },
    { id: "1ECO22", nombre: "Economía del Desarrollo" },
    { id: "1ECO16", nombre: "Economía Internacional 2" },
    { id: "1ECO15", nombre: "Organización Industrial" }
  ],
  C: [
    { id: "1ECO30", nombre: "Lab. Bases de Datos" },
    { id: "1ECO31", nombre: "Lab. STATA" },
    { id: "1ECO32", nombre: "Lab. MATLAB" },
    { id: "1ECO33", nombre: "Lab. EVIEWS" }
  ],
  EB: [
    { id: "1ECO13", nombre: "Ética y Economía" }
  ],
  EOO: [
    { id: "ANT308", nombre: "Antropología Económica" },
    { id: "CIS205", nombre: "Lengua y Cultura Quechua 1" },
    { id: "CIS303", nombre: "Seminario de Temas en Ciencias Sociales" },
    { id: "ECO224", nombre: "Estadística Aplicada" },
    { id: "ECO295", nombre: "Economía Institucional" },
    { id: "ECO314", nombre: "Economía Laboral" },
    { id: "ECO328", nombre: "Temas en Economía y Ciencias Sociales 1" },
    { id: "ECO355", nombre: "Temas en Economía 1" },
    { id: "SOC337", nombre: "Sociología Económica" },
    { id: "ECO385", nombre: "Economía de la Integración" },
    { id: "POL244", nombre: "Economía Política Internacional" }
    // Aquí irían los 77 restantes para completar los 88
  ]
};

// Función que crea columnas por nivel
function generarMalla() {
  const grid = document.getElementById("malla-grid");

  Object.entries(niveles).forEach(([nivel, cursos]) => {
    const col = document.createElement("div");
    col.className = "nivel-columna";
    col.dataset.nivel = nivel;
    col.innerHTML = `<h2>Nivel ${nivel}</h2>`;

    cursos.forEach(({ id, nombre, prereqs }) => {
      const div = document.createElement("div");
      div.className = "curso";
      div.dataset.id = id;
      if (prereqs) {
        div.dataset.prereqs = prereqs.join(",");
        div.classList.add("bloqueado");
      }
      div.innerHTML = `${id}<br>${nombre}`;
      col.appendChild(div);
    });

    grid.appendChild(col);
  });

  // Electivos de ejemplo insertados en nivel 6 a 10
  for (let nivel = 6; nivel <= 10; nivel++) {
    const col = document.querySelector(`.nivel-columna[data-nivel='${nivel}']`);
    if (!col) continue;

    ["A", "B", "C", "EB", "EOO"].forEach(tipo => {
      const container = document.createElement("div");
      container.className = "electivo-container";

      const select = document.createElement("select");
      select.className = "electivo-select";
      select.innerHTML = `<option value="">-- Elegir Electivo ${tipo} --</option>` +
        electivos[tipo].map(e => `<option value="${e.id}">${e.id} – ${e.nombre}</option>`).join("");

      const curso = document.createElement("div");
      curso.className = "curso electivo";

      const boton = document.createElement("button");
      boton.className = "cambiar-electivo";
      boton.innerText = "🧁";

      boton.addEventListener("click", () => {
        select.style.display = "block";
        curso.style.display = "none";
      });

      select.addEventListener("change", () => {
        const seleccionado = select.options[select.selectedIndex];
        curso.innerHTML = `${seleccionado.value}<br>${seleccionado.textContent.split(" – ")[1]}`;
        curso.dataset.id = seleccionado.value;
        curso.classList.remove("bloqueado", "tachado");
        select.style.display = "none";
        curso.style.display = "block";
        actualizarBloqueos();
      });

      container.appendChild(select);
      container.appendChild(curso);
      container.appendChild(boton);
      col.appendChild(container);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  generarMalla();

  window.estadoGuardado = JSON.parse(localStorage.getItem("estadoMalla")) || {};

  window.cursos = Array.from(document.querySelectorAll(".curso"));
  cursos.forEach(curso => {
    const id = curso.dataset.id;
    if (estadoGuardado[id]) {
      curso.classList.add("tachado");
    }

    curso.addEventListener("click", () => {
      if (curso.classList.contains("bloqueado")) return;
      curso.classList.toggle("tachado");
      const id = curso.dataset.id;
      if (curso.classList.contains("tachado")) {
        estadoGuardado[id] = true;
      } else {
        delete estadoGuardado[id];
      }
      localStorage.setItem("estadoMalla", JSON.stringify(estadoGuardado));
      actualizarBloqueos();
    });
  });

  actualizarBloqueos();
});

function actualizarBloqueos() {
  cursos.forEach(curso => {
    const prereqs = curso.dataset.prereqs?.split(",");
    if (prereqs) {
      const cumplidos = prereqs.every(p =>
        document.querySelector(`.curso[data-id='${p}']`)?.classList.contains("tachado")
      );
      if (cumplidos) {
        curso.classList.remove("bloqueado");
      } else {
        curso.classList.add("bloqueado");
      }
    }
  });
}

// Exportar a PDF (opcional: puedes agregar jsPDF si deseas)
