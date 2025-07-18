document.addEventListener("DOMContentLoaded", () => {
  const cursos = document.querySelectorAll(".curso");
  const selects = document.querySelectorAll(".electivo-select");
  const cambiarBtns = document.querySelectorAll(".cambiar-electivo");
  const exportarPDF = document.getElementById("exportarPDF");

  // Restaurar estado guardado
  const estadoGuardado = JSON.parse(localStorage.getItem("estadoMalla")) || {};
  cursos.forEach(curso => {
    const id = curso.dataset.id;
    if (estadoGuardado[id]) curso.classList.add("tachado");
  });

  selects.forEach((select, i) => {
    const key = `electivo${i}`;
    const valorGuardado = localStorage.getItem(key);
    if (valorGuardado) {
      const text = select.querySelector(`option[value='${valorGuardado}']`)?.textContent;
      if (text) {
        select.nextElementSibling.textContent = text;
        select.style.display = "none";
        select.nextElementSibling.style.display = "block";
        select.nextElementSibling.classList.add("curso", "electivo");
      }
    }
    select.addEventListener("change", () => {
      const valor = select.value;
      localStorage.setItem(key, valor);
      if (valor) {
        const text = select.querySelector(`option[value='${valor}']`).textContent;
        select.nextElementSibling.textContent = text;
        select.style.display = "none";
        select.nextElementSibling.style.display = "block";
        select.nextElementSibling.classList.add("curso", "electivo");
        actualizarBloqueos();
      }
    });
  });

  cambiarBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const select = selects[i];
      select.style.display = "block";
      select.nextElementSibling.style.display = "none";
      localStorage.removeItem(`electivo${i}`);
    });
  });

  cursos.forEach(curso => {
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

  actualizarBloqueos();

  exportarPDF.addEventListener("click", () => {
    const style = document.createElement("style");
    style.textContent = `
      @page { size: auto; margin: 10mm; }
      body { background: white !important; color: black !important; font-family: sans-serif; }
      .curso.tachado::after { content: " ✔"; color: green; }
      .header, .cambiar-electivo { display: none !important; }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => style.remove(), 1000);
  });

  // DRAG & DROP para electivos
  let dragged = null;

  document.querySelectorAll(".curso.electivo").forEach(card => {
    card.setAttribute("draggable", true);
    card.addEventListener("dragstart", (e) => {
      dragged = e.target;
      e.dataTransfer.effectAllowed = "move";
    });
  });

  document.querySelectorAll(".nivel-columna").forEach(col => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragged && dragged.classList.contains("electivo")) {
        col.appendChild(dragged);
      }
    });
  });
});

