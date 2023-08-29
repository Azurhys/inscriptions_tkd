import React, { useState } from 'react';
import useMembres from '../hook/useMembres';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ExcelJS from 'exceljs'
import saveAs from 'file-saver'


const Membres = () => {
  const { membres, setMembres } = useMembres();
  const [showEditModal, setShowEditModal] = useState(false); // État pour gérer l'affichage de la modale de modification
  const [showDetailsModal, setShowDetailsModal] = useState(false); // État pour gérer l'affichage de la modale de détails
  const [selectedMembre, setSelectedMembre] = useState(null); // État pour stocker les détails du membre sélectionné
  const [editedMembre, setEditedMembre] = useState(null); // État pour stocker les modifications du membre

  const openEditModal = (membre) => {
    setSelectedMembre(membre);
    setEditedMembre({ ...membre }); // Copiez les détails du membre pour la modification
    setShowEditModal(true);
  };

  const openDetailsModal = (membre) => {
    setSelectedMembre(membre);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setSelectedMembre(null);
    setEditedMembre(null);
    setShowEditModal(false);
    setShowDetailsModal(false);
  };

  const handleEditFieldChange = (field, value) => {
    setEditedMembre({ ...editedMembre, [field]: value });
  };

  const handleEditSubmit = () => {
    // Envoyez les modifications à votre backend ou faites les traitements nécessaires
    console.log("Modifications à envoyer:", editedMembre);
    axios.put(`${import.meta.env.VITE_API}membres/${editedMembre.id}.json`, editedMembre)
      .then(response => {
        // Assuming the request was successful, update the membres state
        const updatedMembres = membres.map((membre) =>
          membre.id === editedMembre.id ? editedMembre : membre
        );
        setMembres(updatedMembres);
      })
      .catch(error => {
        console.error('Error updating member data:', error);
      });
    // Mettez à jour la liste des membres avec les modifications
    const updatedMembres = membres.map((membre) =>
      membre.id === editedMembre.id ? editedMembre : membre
    );

    // Mise à jour de la liste des membres et fermeture de la modale de modification
    setMembres(updatedMembres);
    closeModal();
  };

  const handleDelete = (id) => {
    // Send a request to delete the member with the given id
    axios.delete(`${import.meta.env.VITE_API}membres/${id}.json`)
      .then(response => {
        // Assuming the request was successful, update the membres state
        const updatedMembres = membres.filter(membre => membre.id !== id);
        setMembres(updatedMembres);
      })
      .catch(error => {
        console.error('Error deleting member:', error);
      });
  };
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Membres');

    // Add headers
    const headers = ['Nom', 'Prénom', 'Age', 'Genre', 'Date de naissance', 'Poids', 'Taille', 'Adresse', 'Email 1', 'Email 2', 'Téléphone 1', 'Téléphone 2', 'Cours', 'Montant Inscription', 'Commentaire'];
    worksheet.addRow(headers);

    // Add member data rows
    membres.forEach(membre => {
      const row = [
        membre.nom,
        membre.prenom,
        membre.age,
        membre.genre,
        membre.dateNaissance,
        membre.poids,
        membre.taille,
        `${membre.adresse.adresse1} ${membre.adresse.adresse2} ${membre.adresse.codePostal} ${membre.adresse.ville}`,
        membre.email1,
        membre.email2,
        membre.portable1,
        membre.portable2,
        membre.trancheAge,
        membre.montantTotal,
        membre.commentaire
      ];
      worksheet.addRow(row);
    });

    // Save the workbook to a file
    const excelBuffer = workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'membres.xlsx');
    });
  };
  
  return (
    <div>
      <h1>Liste des Membres</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Cours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {membres.map(membre => (
            <tr key={membre.id}>
              <td>{membre.nom}</td>
              <td>{membre.prenom}</td>
              <td>{membre.trancheAge}</td>
              <td>
                <button className="btn btn-warning mx-3" onClick={() => openEditModal(membre)}>Modifier</button>
                <button className="btn btn-info mx-3" onClick={() => openDetailsModal(membre)}>Détails</button>
                <button className="btn btn-danger mx-3" onClick={() => handleDelete(membre.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modale de modification */}
      <Modal show={showEditModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le membre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMembre && editedMembre && (
            <div>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.nom}
                  onChange={(e) => handleEditFieldChange("nom", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Prénom:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.prenom}
                  onChange={(e) => handleEditFieldChange("prenom", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedMembre.age}
                  onChange={(e) => handleEditFieldChange("age", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Genre:</label>
                <select
                  className="form-control"
                  value={editedMembre.genre}
                  onChange={(e) => handleEditFieldChange("genre", e.target.value)}
                >
                  <option value="H">H</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date de naissance:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.dateNaissance}
                  onChange={(e) =>
                    handleEditFieldChange("dateNaissance", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Poids:</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedMembre.poids}
                  onChange={(e) => handleEditFieldChange("poids", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Taille:</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedMembre.taille}
                  onChange={(e) => handleEditFieldChange("taille", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Adresse:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.adresse.adresse1}
                  onChange={(e) =>
                    handleEditFieldChange("adresse", {
                      ...editedMembre.adresse,
                      adresse1: e.target.value,
                    })
                  }
                />
                <label>Adresse 2:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.adresse.adresse2}
                  onChange={(e) =>
                    handleEditFieldChange("adresse2", {
                      ...editedMembre.adresse,
                      adresse1: e.target.value,
                    })
                  }
                />
                <label>Code Postal :</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.adresse.codePostal}
                  onChange={(e) =>
                    handleEditFieldChange("codePostal", {
                      ...editedMembre.adresse,
                      adresse1: e.target.value,
                    })
                  }
                />
                <label>Ville :</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.adresse.ville}
                  onChange={(e) =>
                    handleEditFieldChange("ville", {
                      ...editedMembre.adresse,
                      adresse1: e.target.value,
                    })
                  }
                />
                
              </div>
              <div className="form-group">
                <label>Email 1:</label>
                <input
                  type="email"
                  className="form-control"
                  value={editedMembre.email1}
                  onChange={(e) => handleEditFieldChange("email1", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email 2:</label>
                <input
                  type="email"
                  className="form-control"
                  value={editedMembre.email2}
                  onChange={(e) => handleEditFieldChange("email2", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Téléphone 1:</label>
                <input
                  type="tel"
                  className="form-control"
                  value={editedMembre.portable1}
                  onChange={(e) => handleEditFieldChange("portable1", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Téléphone 2:</label>
                <input
                  type="tel"
                  className="form-control"
                  value={editedMembre.portable2}
                  onChange={(e) => handleEditFieldChange("portable2", e.target.value)}
                />
              </div>
              {/* ... similar fields for personne1 and personne2 ... */}
              <div className="form-group">
                <label>Cours:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedMembre.trancheAge}
                  onChange={(e) => handleEditFieldChange("trancheAge", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Montant Inscription:</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedMembre.montantTotal}
                  onChange={(e) =>
                    handleEditFieldChange("montantTotal", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Commentaire:</label>
                <textarea
                  className="form-control"
                  value={editedMembre.commentaire}
                  onChange={(e) =>
                    handleEditFieldChange("commentaire", e.target.value)
                  }
                />
              </div>
              {/* Ajoutez d'autres champs de modification ici */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Modale de détails */}
      <Modal show={showDetailsModal} onHide={closeModal}>
      <Modal.Header closeButton>
          <Modal.Title>Détails du Membre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
      {selectedMembre && (
            <div>
              <p>Nom: {selectedMembre.nom}</p>
              <p>Prénom: {selectedMembre.prenom}</p>
              <p>Age : {selectedMembre.age}</p>
              <p>Genre : {selectedMembre.genre}</p>
              <p>Date de naissance : {selectedMembre.dateNaissance}</p>
              <p>Poids : {selectedMembre.poids}</p>
              <p>Taille : {selectedMembre.taille}</p>
              <p>Adresse : {selectedMembre.adresse.adresse1} {selectedMembre.adresse.adresse2} {selectedMembre.adresse.codePostal} {selectedMembre.adresse.ville}</p>
              <p>Email : {selectedMembre.email1}</p>
              <p>Email : {selectedMembre.email2}</p>
              <p>Tel : {selectedMembre.portable1}</p>
              <p>Tel : {selectedMembre.portable2}</p>
              <p>Personne à prévenir : {selectedMembre.personne1.nom} {selectedMembre.personne1.prenom} {selectedMembre.personne1.numeroPortable} {selectedMembre.personne1.lienParente}</p>
              <p>Personne à prévenir : {selectedMembre.personne2.nom} {selectedMembre.personne2.prenom} {selectedMembre.personne2.numeroPortable} {selectedMembre.personne2.lienParente}</p>
              <p>Cours : {selectedMembre.trancheAge}</p>
              <p>Montant Inscription : {selectedMembre.montantTotal} €</p>
              <p>Commentaire : {selectedMembre.commentaire}</p>
              {/* Ajoutez d'autres détails */}
            </div>
          )}
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      <button className="btn btn-success mx-3" onClick={exportToExcel}>Exporter vers Excel</button>
    </div>
  );
};

export default Membres;
