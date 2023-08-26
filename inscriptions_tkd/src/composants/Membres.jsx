import React from 'react';
import useMembres from '../hook/useMembres';// Assurez-vous de mettre le bon chemin

const Membres = () => {
  const membres = useMembres();

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
                <button className="btn btn-warning mx-3">Modifier</button>
                <button className="btn btn-info mx-3">Détails</button>
                <button className="btn btn-danger mx-3">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Membres;
