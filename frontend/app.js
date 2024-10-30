document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8090/upload", {
      // Lien vers l'API backend
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.success) {
      alert("Fichier uploadé avec succès !");
      fetchFiles(); // Appelle la fonction pour mettre à jour la liste des fichiers
    } else {
      alert("Erreur lors de l'upload");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors de l'upload");
  }
});

async function fetchFiles() {
  const response = await fetch("http://localhost:8090/files"); // Endpoint pour récupérer la liste des fichiers
  const files = await response.json();
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";
  files.forEach((file) => {
    const li = document.createElement("li");
    li.textContent = `${file.name} - ${file.size} bytes`;
    fileList.appendChild(li);
  });
}

fetchFiles(); // Charger la liste des fichiers au démarrage
