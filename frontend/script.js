const fileInput = document.getElementById("file-input");
const uploadButton = document.getElementById("upload-button");
let fileList = [];
const uploadDir = "uploads"; 
const uploadsSizeElement = document.getElementById("uploads-size");
let uploadsSize = 0;

// Fonction pour obtenir la taille actuelle du dossier uploads
async function checkUploadsSize() {
  try {
    const response = await fetch("http://localhost:8090/file/size");
    const data = await response.json();
    console.log("Réponse de l'API :", data);
    uploadsSize = data.sizeInGB;
    uploadsSizeElement.textContent = `Taille actuelle du dossier : ${uploadsSize.toFixed(
      2
    )} Go`;
  } catch (error) {
    console.error(
      "Erreur de récupération de la taille du dossier :",
      error
    );
  }
}

// Charger la taille du dossier au chargement de la page
window.onload = checkUploadsSize;

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    fileList = [file];
  }
});

uploadButton.addEventListener("click", async () => {
  await checkUploadsSize();

  if (uploadsSize >= 2) {
    alert("Espace insuffisant ! Le dossier d'uploads a atteint 2 Go.");
    return;
  }

  if (fileList.length === 0) {
    alert("Aucun fichier à uploader !");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileList[0]);

  try {
    const response = await fetch("http://localhost:8090/file/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // Upload le fichier et réinitialise puis update la taille
    if (data.success) {
      alert("Fichier uploadé avec succès !");
      fileInput.value = "";
      fileList = [];
      checkUploadsSize();
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Erreur de requête :", error);
  }
});


fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    fileList = [file];
  }
});

// Uploader un fichier au clic si la liste n'est pas vide
uploadButton.addEventListener("click", async () => {
  if (fileList.length === 0) {
    alert("Aucun fichier à uploader !");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileList[0]);

  try {
    const response = await fetch("http://localhost:8090/file/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    
    if (data.success) {
      alert("Fichier uploadé avec succès !");
      fileInput.value = "";
      fileList = [];
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Erreur de requête:", error);
  }
});


document.addEventListener("DOMContentLoaded", () => {
    const fileList = document.getElementById("file-list");
  
    // Fonction pour récupérer les fichiers
    async function fetchFiles() {
      try {
        const response = await fetch("http://localhost:8090/file/list-files");
        const data = await response.json();
  
        if (data.files && data.files.length > 0) {
          
          fileList.innerHTML = "";
  
          
          data.files.forEach((file) => {
            const listItem = document.createElement("li");
            listItem.textContent = file;
            fileList.appendChild(listItem);
          });
        } else {
          fileList.innerHTML = "<li>Aucun fichier trouvé.</li>";
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des fichiers :", error);
      }
    }
  
    
    fetchFiles();
  });
  

  document.addEventListener("DOMContentLoaded", () => {
    const fileList = document.getElementById("file-list");
  
    // Fonction pour récupérer les fichiers
    async function fetchFiles() {
      try {
        const response = await fetch("http://localhost:8090/file/list-files");
        const data = await response.json();
  
        if (data.files && data.files.length > 0) {
          fileList.innerHTML = "";
          data.files.forEach((file) => {
            const listItem = document.createElement("li");
            listItem.textContent = file;
  
           
            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Télécharger";
            downloadButton.onclick = async () => {
              try {
                // Faites une requête pour obtenir un jeton valide
                const response = await fetch(`http://localhost:8090/file/generate-share-link/${file}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: "user123" }) // Exemple d'ID utilisateur en dur
                });
                const data = await response.json();
            
                if (data.shareLink) {
                  window.open(data.shareLink, "_blank");
                } else {
                  alert("Impossible de générer un lien de téléchargement.");
                }
              } catch (error) {
                console.error("Erreur lors de la génération du lien de téléchargement :", error);
              }
            };
  
           
            const renameButton = document.createElement("button");
            renameButton.textContent = "Renommer";
            renameButton.onclick = () => {
              const newFileName = prompt("Entrez le nouveau nom du fichier :", file);
              if (newFileName) {
                renameFile(file, newFileName);
              }
            };
  
            
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Supprimer";
            deleteButton.onclick = () => {
              if (confirm(`Voulez-vous vraiment supprimer ${file} ?`)) {
                deleteFile(file);
              }
            };
  
        
            listItem.appendChild(downloadButton);
            listItem.appendChild(renameButton);
            listItem.appendChild(deleteButton);
            fileList.appendChild(listItem);
          });
        } else {
          fileList.innerHTML = "<li>Aucun fichier trouvé.</li>";
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des fichiers :", error);
      }
    }
  
    // Fonction pour renommer un fichier
    async function renameFile(oldFileName, newFileName) {
      try {
        const response = await fetch("http://localhost:8090/file/rename-file", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldFileName, newFileName })
        });
        const data = await response.json();
        alert(data.message);
        fetchFiles();
      } catch (error) {
        console.error("Erreur lors du renommage du fichier :", error);
      }
    }
  
    // Fonction pour supprimer un fichier
    async function deleteFile(fileName) {
      try {
        const response = await fetch("http://localhost:8090/file/delete-file", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName })
        });
        const data = await response.json();
        alert(data.message);
        fetchFiles();
      } catch (error) {
        console.error("Erreur lors de la suppression du fichier :", error);
      }
    }
  
   
    fetchFiles();
  });
  