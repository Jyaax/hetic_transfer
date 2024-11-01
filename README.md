HETIC Transfer <br>
Description  <br>
HETIC Transfer est une application serveur construite avec Node.js et Express, visant à gérer des opérations basiques de transfert de données pour une base de données MariaDB. Le projet est structuré pour être conteneurisé avec Docker et utilise des modules ES pour organiser le code. Ce projet utilise également un pool de connexions pour optimiser les performances lors des requêtes vers la base de données hetic_transfer.
 <br> <br>
Fonctionnalités <br>
Création d'un utilisateur dans la base de données <br>
Authentification basique des utilisateurs <br>
Connexion à une base de données MariaDB via un pool de connexions <br>
Gestion des routes utilisateur <br> <br>
Prérequis <br> <br>
Node.js (version 16 ou supérieure) <br>
Docker (optionnel mais recommandé pour déployer l'application) <br>
MariaDB (ou une autre instance de base de données MySQL) <br> <br>
Installation <br> <br>
Clonez ce dépôt : <br>

bash <br>
Copier le code <br>
git clone <url_du_depot> <br>
cd hetic_transfer <br> <br>
Installez les dépendances : <br>

bash <br>
Copier le code <br>
npm install <br>
Configurez les variables d'environnement : <br> <br>

Créez un fichier .env à la racine du projet et définissez les valeurs suivantes : <br> <br>

env <br>
Copier le code <br>
DB_HOST=<hôte_de_la_base_de_données> <br>
DB_USER=<nom_utilisateur> <br>
DB_PASSWORD=<mot_de_passe> <br>
PORT=8090 <br>
Lancez l'application : <br>

bash <br>
Copier le code <br>
Dans backend\app <br>
npm install <br> <br>
Utilisation <br>

Utilisation avec Docker <br>
Pour exécuter le projet dans un conteneur Docker : <br>
bash <br>
Copier le code <br>
docker compose up --build <br>

Auteur <br> <br>
Ce projet est réalisé par : <br>
Luembe Jonathan <br>
Yang Rosine <br>
Luacini Julie <br>
