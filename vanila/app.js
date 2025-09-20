function getStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudent(student) {
    const students = getStudents();
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
}

function saveStudents(students) {
    localStorage.setItem("students", JSON.stringify(students));
}

function deleteStudent(index) {
    const students = getStudents();
    if (index >= 0 && index < students.length) {
        students.splice(index, 1);
        saveStudents(students);
    }
    renderList();

}

function router() {
    const path = location.hash.slice(1) || "/";
    const app = document.getElementById("app");
    app.innerHTML = "";

    let templateId;

    if (path === "/") {
        templateId = "form-template";
    } else if (path === "/lista") {
        templateId = "list-template";
    } else {
        templateId = "404-template";
    }

    const template = document.getElementById(templateId);
    app.appendChild(template.content.cloneNode(true));
    if (path === "/") {
        attachFormLogic();
    } else if (path === "/lista") {
        renderList();
    }
}

function attachFormLogic() {
    const form = document.getElementById("student-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const n1 = parseFloat(document.getElementById("Nota1").value); // <-- Cambiado
        const n2 = parseFloat(document.getElementById("Nota2").value); // <-- Cambiado
        const n3 = parseFloat(document.getElementById("Nota3").value); // <-- Cambiado

        if (!name || isNaN(n1) || isNaN(n2) || isNaN(n3)) {
            document.getElementById("message").textContent = "Por favor, complete todos los campos correctamente.";
            return;
        }

        const average = ((n1 + n2 + n3) / 3).toFixed(2);
        saveStudent({ name, average });

        document.getElementById("message").textContent = `✅Estudiante ${name} con promedio ${average} guardado.`;
        form.reset();
    });
}

function renderList() {
    const students = getStudents();
    const list = document.getElementById("student-list");

    list.innerHTML = "";

    if (students.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No hay estudiantes registrados.";
        list.appendChild(empty);
        return;
    }

    const template = document.getElementById("student-item-template");

    students.forEach((s, i) => {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".student-name").textContent = s.name;
        clone.querySelector(".student-average").textContent = s.average;

        // Agregar evento al botón de eliminar
        const deleteBtn = clone.querySelector(".delete-button");
        deleteBtn.addEventListener("click", () => {
            deleteStudent(i);
        });

        list.appendChild(clone);
    });

}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);