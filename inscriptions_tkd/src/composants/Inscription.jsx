import { useState, React, useEffect } from "react";
import axios from "axios";
import PdfGenerator from "../PdfGenerator";
import { saveAs } from 'file-saver';
import { PDFViewer } from "@react-pdf/renderer";

const Inscription = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [genre, setGenre] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [poids, setPoids] = useState('');
    const [taille, setTaille] = useState('');
    const [adresse1, setAdresse1] = useState('');
    const [adresse2, setAdresse2] = useState('');
    const [codePostal, setCodePostal] = useState('');
    const [ville, setVille] = useState('');
    const [email1, setEmail1] = useState('');
    const [email2, setEmail2] = useState('');
    const [portable1, setPortable1] = useState('');
    const [portable2, setPortable2] = useState('');
    const [age, setAge] = useState(0);
    const [commentaire, setCommentaire] = useState("");
    const [nombreEcheances, setNombreEcheances] = useState(1);

    const tarifs = {
        babyTaekwondo: {
          adhesionClub: 30,
          licenceFFST: 15,
          cours: 71,
        },
        enfants: {
          adhesionClub: 30,
          licenceFFST: 21,
          cours: 135,
        },
        adosAdultes: {
          adhesionClub: 30,
          licenceFFST: 25,
          cours: 176,
        },
      };
    
      // Réductions "famille nombreuses"
      const reductionsFamilleNombreuse = [
        { label: '-15€ (sur le 2nd membre inscrit)', montant: 15 },
        { label: '-20€ (sur le 3ème membre inscrit)', montant: 20 },
        { label: '-25€ (sur le 4ème membre et les suivants)', montant: 25 },
      ];
    
      // Réduction "PASS’ SPORT"
      const reductionPassSport = 50;
    
      // Dobok - Tailles et prix
      const dobokTailles = [
        { taille: '100 cm', prix: 20 },
        { taille: '110 cm', prix: 20 },
        { taille: '120 cm', prix: 22 },
        { taille: '130 cm', prix: 24 },
        { taille: '140 cm', prix: 24 },
        { taille: '150 cm', prix: 26 },
        { taille: '160 cm', prix: 28 },
        { taille: '170 cm', prix: 30 },
        { taille: '180 cm', prix: 32 },
        { taille: '190 cm', prix: 34 },
      ];
    
      const [trancheAge, setTrancheAge] = useState('enfants');
      const [reductionFamille, setReductionFamille] = useState(0);
      const [hasReductionPassSport, setHasReductionPassSport] = useState(false);
      const [dobokTaille, setDobokTaille] = useState('');
      const [montantTotal, setMontantTotal] = useState(0);
      const calculateMontantEcheance = () => {
        if (nombreEcheances === 0) {
          return 0;
        }
        return Math.ceil(montantTotal / nombreEcheances);
      };
    

    const [personne1, setPersonne1] = useState({
        nom: '',
        prenom: '',
        lienParente: '',
        numeroPortable: '',
      });
    
      const [personne2, setPersonne2] = useState({
        nom: '',
        prenom: '',
        lienParente: '',
        numeroPortable: '',
      });
      const [paiements, setPaiements] = useState([]);
      const [dobokPaiement, setDobokPaiement] = useState("");
      const [dobokEcheance, setDobokEcheance] = useState("");
      const calculerMontantTotal = () => {
        const tarif = tarifs[trancheAge];
        let total = tarif.adhesionClub + tarif.licenceFFST + tarif.cours;
    
        if (reductionFamille > 0) {
          total -= reductionFamille;
        }
    
        if (hasReductionPassSport) {
          total -= reductionPassSport;
        }
    
    
        setMontantTotal(total);
      };
    
      // Gérer les changements de sélection de tranche d'âge
      const handleTrancheAgeChange = (e) => {
        setTrancheAge(e.target.value);
        setReductionFamille(0);
        setHasReductionPassSport(false);
        setDobokTaille('');
        setMontantTotal(0);
      };
    
      // Gérer les changements de sélection de réduction famille nombreuses
      const handleReductionFamilleChange = (e) => {
        setReductionFamille(parseInt(e.target.value));
      };
    
      // Gérer le changement d'état pour la réduction "PASS’ SPORT"
      const handleReductionPassSportChange = (e) => {
        setHasReductionPassSport(e.target.checked);
      };
    
      // Gérer les changements de sélection pour la taille du dobok
      const handleDobokTailleChange = (e) => {
        setDobokTaille(e.target.value);
      };
      const generatePdf = () => {
        const paiementsArray = paiements.map((echeance, index) => ({
          mois: echeance.mois,
          montant: echeance.montant,
          moyenPaiement: echeance.moyenPaiement,
        }));

        
        // Créez un objet FormData avec les données du formulaire
        const newFormData = {
          nom,
          prenom,
          genre,
          dateNaissance,
          age,
          poids,
          taille,
          adresse: {
            adresse1,
            adresse2,
            codePostal,
            ville,
          },
          email1,
          email2,
          portable1,
          portable2,
          personne1,
          personne2,
          trancheAge,
          tarifs,
          reductionFamille,
          hasReductionPassSport,
          dobokTaille,
          montantTotal,
          paiements,
          dobokPaiement,
          commentaire,
          // ... (ajoutez les autres données ici)
        };
        newFormData.paiements = paiementsArray;
        // Mettez à jour formData avec les données du formulaire
        setFormData(newFormData);
    
        // Affichez le PDF dans le PDFViewer
        setShowPdf(true);
      };
    
      const handleDownloadPdf = async () => {
        try {
          const newFormData = {
            nom,
            prenom,
            genre,
            dateNaissance,
            age,
            poids,
            taille,
            adresse: {
              adresse1,
              adresse2,
              codePostal,
              ville,
            },
            email1,
            email2,
            portable1,
            portable2,
            personne1,
            personne2,
            trancheAge,
            tarifs,
            reductionFamille,
            hasReductionPassSport,
            dobokTaille,
            montantTotal,
            paiements,
            dobokPaiement,
            commentaire,
            // ... (ajoutez les autres données ici)
          };
    
          const pdfBlob = await PdfGenerator(formData).toBlob();

            saveAs(pdfBlob, 'inscription.pdf');
          } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
          }
        };
    
        const generateEcheanciers = () => {
          const montantTotalPaiement = montantTotal - (dobokTaille ? dobokTailles.find((item) => item.taille === dobokTaille)?.prix || 0 : 0);
          const montantSeptembre = montantTotalPaiement > 0 ? Math.ceil(montantTotalPaiement / nombreEcheances) : 0;
          const echeanciers = [];
        
          for (let i = 0; i < nombreEcheances; i++) {
            const dateEcheance = new Date(2023, 8 + i, 1); // 1er septembre, 1er octobre, 1er novembre, 1er janvier, etc.
            echeanciers.push({
              mois: dateEcheance.toLocaleString("default", { month: "long" }),
              montant: i === nombreEcheances - 1 ? montantTotalPaiement - montantSeptembre * (nombreEcheances - 1) : montantSeptembre,
              moyenPaiement: "",
            });
          }
        
          setPaiements(echeanciers);
        };

      useEffect(() => {
        calculerMontantTotal();
        if (dateNaissance) {
            const calculatedAge = calculateAge(dateNaissance);
            setAge(calculatedAge);
          };
          if (age >= 3 && age <= 6) {
            setTrancheAge('babyTaekwondo');
          } else if (age >= 7 && age <= 11) {
            setTrancheAge('enfants');
          } else {
            setTrancheAge('adosAdultes');
          }
          
          
          generateEcheanciers();
      }, [trancheAge, reductionFamille, hasReductionPassSport, dobokTaille, dateNaissance, age, montantTotal, nombreEcheances]);

    // Fonction pour calculer l'âge au 1er septembre 2023
    const calculateAge = (birthdate) => {
      const birthdateParts = birthdate.split('/');
      const birthYear = parseInt(birthdateParts[2], 10);
      const birthMonth = parseInt(birthdateParts[1], 10) - 1; // Les mois commencent à 0
      const birthDay = parseInt(birthdateParts[0], 10);
      
      const referenceDate = new Date(2023, 8, 1); // 1er septembre 2023
      const age = referenceDate.getFullYear() - birthYear;
  
      // Si la date de naissance n'est pas encore passée cette année, on décrémente l'âge de 1
      if (referenceDate.getMonth() < birthMonth || (referenceDate.getMonth() === birthMonth && referenceDate.getDate() < birthDay)) {
        return age - 1;
      }
  
      return age;
    };
    const [formData, setFormData] = useState(null);
    const [showPdf, setShowPdf] = useState(false);

    const handlePdfGeneration = () => {
      setShowPdf(true);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      // Calcul de l'âge au 1er septembre 2023
      const age = calculateAge(dateNaissance);
    
        // Mettez à jour formData avec les données du formulaire
        const paiementsArray = paiements.map((echeance, index) => ({
          mois: echeance.mois,
          montant: echeance.montant,
          moyenPaiement: echeance.moyenPaiement,
        }));
        
      // Créez un objet pour stocker toutes les données du formulaire
      const formData = {
        nom,
        prenom,
        genre,
        dateNaissance,
        age,
        poids,
        taille,
        adresse: {
          adresse1,
          adresse2,
          codePostal,
          ville,
        },
        email1,
        email2,
        portable1,
        portable2,
        personne1,
        personne2,
        trancheAge,
        tarifs,
        reductionFamille,
        hasReductionPassSport,
        dobokTaille,
        montantTotal,
        paiements,
        dobokPaiement,
        commentaire,
        // ... (ajoutez les autres données ici)
      };
      formData.paiements = paiementsArray;
      
      try {
        // Utilisez Axios pour envoyer les données à la base de données Firebase
        const response = await axios.post(`${import.meta.env.VITE_API}membres.json`, formData);
    
        // Vérifiez la réponse si nécessaire
        console.log(response);
    
        // Réinitialiser les champs du formulaire après la soumission
        setNom("");
        setPrenom("");
        setGenre("");
        setDateNaissance("");
        setPoids("");
        setTaille("");
        setAdresse1("");
        setAdresse2("");
        setCodePostal("");
        setVille("");
        setEmail1("");
        setEmail2("");
        setPortable1("");
        setPortable2("");
        setPersonne1({
          nom: "",
          prenom: "",
          lienParente: "",
          numeroPortable: "",
        });
        setPersonne2({
          nom: "",
          prenom: "",
          lienParente: "",
          numeroPortable: "",
        });
        setTrancheAge("enfants");
        setReductionFamille(0);
        setHasReductionPassSport(false);
        setDobokTaille("");
        setMontantTotal(0);
        setCommentaire("");
      } catch (error) {
        console.error("Erreur lors de l'envoi des données:", error);
      }
    };
    
  
    return (
      <div>

      <form onSubmit={handleSubmit}>
        <h3 className="my-3">État Civil</h3>
        <div>
          <label>Nom de l'adhérent:</label>
          <input className="form-control mb-3"  type="text" value={nom}  onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div>
          <label>Prénom de l'adhérent:</label>
          <input className="form-control mb-3"  type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        </div>
        <div>
          <label>Genre (H / F):</label>
          <input className="form-control mb-3" type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
        </div>
        <div>
          <label>Date de naissance (format ex. 25/12/2019):</label>
          <input className="form-control mb-3" type="text" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} required />
        </div>
        <div>
          <label>Poids (en Kg):</label>
          <input className="form-control mb-3" type="number" value={poids} onChange={(e) => setPoids(e.target.value)} required />
        </div>
        <div>
          <label>Taille (en cm):</label>
          <input className="form-control mb-3" type="number" value={taille} onChange={(e) => setTaille(e.target.value)} required />
        </div>
        <div>
          <label>Adresse domicile:</label>
          <input className="form-control mb-3" type="text" value={adresse1} onChange={(e) => setAdresse1(e.target.value)} required />
        </div>
        <div>
          <label>Adresse 2:</label>
          <input className="form-control mb-3" type="text" value={adresse2} onChange={(e) => setAdresse2(e.target.value)} />
        </div>
        <div>
          <label>Code postal:</label>
          <input className="form-control mb-3" type="text" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} required />
        </div>
        <div>
          <label>Ville:</label>
          <input className="form-control mb-3" type="text" value={ville} onChange={(e) => setVille(e.target.value)} required />
        </div>
        <div>
          <label>Adresse mail 1:</label>
          <input className="form-control mb-3" type="email" value={email1} onChange={(e) => setEmail1(e.target.value)} required />
        </div>
        <div>
          <label>Adresse mail 2:</label>
          <input className="form-control mb-3" type="email" value={email2} onChange={(e) => setEmail2(e.target.value)} />
        </div>
        <div>
          <label>N° portable 1 (format avec 06 ou 07):</label>
          <input className="form-control mb-3" type="text" value={portable1} onChange={(e) => setPortable1(e.target.value)} required />
        </div>
        <div>
          <label>N° portable 2 (format avec 06 ou 07):</label>
          <input className="form-control mb-3" type="text" value={portable2} onChange={(e) => setPortable2(e.target.value)} />
        </div>
        <div>
        <h3 className="my-3">PERSONNES A PREVENIR EN CAS D'URGENCE (pour les mineurs)</h3>
        <div>
          <label>Personne n°1 - Nom:</label>
          <input className="form-control mb-3" type="text" value={personne1.nom} onChange={(e) => setPersonne1({ ...personne1, nom: e.target.value })}  />
        </div>
        <div>
          <label>Personne n°1 - Prénom:</label>
          <input className="form-control mb-3" type="text" value={personne1.prenom} onChange={(e) => setPersonne1({ ...personne1, prenom: e.target.value })}  />
        </div>
        <div>
          <label>Personne n°1 - Lien de parenté:</label>
          <input className="form-control mb-3" type="text" value={personne1.lienParente} onChange={(e) => setPersonne1({ ...personne1, lienParente: e.target.value })}  />
        </div>
        <div>
          <label>Personne n°1 - N° portable (format avec 06 ou 07):</label>
          <input className="form-control mb-3" type="tel" pattern="[0-9]{10}" value={personne1.numeroPortable} onChange={(e) => setPersonne1({ ...personne1, numeroPortable: e.target.value })}  />
        </div>
        <div>
          <label>Personne n°2 - Nom:</label>
          <input className="form-control mb-3"  type="text" value={personne2.nom} onChange={(e) => setPersonne2({ ...personne2, nom: e.target.value })}  />
        </div>
        <div>
          <label>Personne n°2 - Prénom:</label>
          <input className="form-control mb-3" type="text" value={personne2.prenom} onChange={(e) => setPersonne2({ ...personne2, prenom: e.target.value })}  />
        </div>
        <div>
          <label>Personne n°2 - Lien de parenté:</label>
          <input className="form-control mb-3" type="text" value={personne2.lienParente} onChange={(e) => setPersonne2({ ...personne2, lienParente: e.target.value })}  />
        </div>
        <div>
          <label>Personne n°2 - N° portable (format avec 06 ou 07):</label>
          <input className="form-control mb-3" type="tel" pattern="[0-9]{10}" value={personne2.numeroPortable} onChange={(e) => setPersonne2({ ...personne2, numeroPortable: e.target.value })}  />
        </div>
      </div>
      <div>
        <h3 className="my-3">CALCUL DU MONTANT DE L'INSCRIPTION</h3>
        <div>
        <label className="my-1">Tranches d'âge au moment de l'inscription:</label>
            <select value={trancheAge} onChange={handleTrancheAgeChange} disabled>
                <option value="babyTaekwondo">4 ans - 5 ans - 6 ans</option>
                <option value="enfants">7 - 8 - 9 - 10 - 11 ans</option>
                <option value="adosAdultes">12 ans et au-delà...</option>
            </select>
        </div>
        <div>
          <label className="my-1">Adhésion au club:</label>
          <span>{tarifs[trancheAge].adhesionClub} €</span>
        </div>
        <div>
          <label className="my-1">Licence fédérale FFST:</label>
          <span>{tarifs[trancheAge].licenceFFST} €</span>
        </div>
        <div>
          <label className="my-1" >Cours:</label>
          <span>{tarifs[trancheAge].cours} €</span>
        </div>
        <div>
          <label className="my-1" >Réduction "famille nombreuses":</label>
          <select className='form-control' value={reductionFamille} onChange={handleReductionFamilleChange}>
            <option value="0">Aucune réduction</option>
            {reductionsFamilleNombreuse.map((reduction) => (
              <option key={reduction.montant} value={reduction.montant}>
                {reduction.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="my-1">Réduction "PASS’ SPORT" (dispositif de la CAF):</label>
          <input type="checkbox" checked={hasReductionPassSport} onChange={handleReductionPassSportChange} />
        </div>
        <div>
          <label className="my-1">Achat Dobok</label>
          <select className='form-control' value={dobokTaille} onChange={handleDobokTailleChange}>
            <option value="">Sélectionner une taille</option>
            {dobokTailles.map((dobok) => (
              <option key={dobok.taille} value={dobok.taille}>
                {dobok.taille}
              </option>
            ))}
          </select>
        </div>
        {dobokTaille && (
          <div>
            <label className="my-1">Prix du dobok:</label>
            <span>{dobokTailles.find((item) => item.taille === dobokTaille)?.prix} €</span>
          </div>
        )}
        <div>
          <label className="my-1">Montant total:</label>
          <span>{montantTotal} €</span>
        </div>
      </div>
      <div>
      <h3 className="my-3">MODE DE PAIEMENT & ECHEANCIERS</h3>
          <div>
            <label>Nombre d'échéances :</label>
            <select className='form-control' value={nombreEcheances} onChange={(e) => setNombreEcheances(parseInt(e.target.value))}>
              <option value="1">1 échéance</option>
              <option value="2">2 échéances</option>
              <option value="3">3 échéances</option>
              <option value="4">4 échéances</option>
            </select>
          </div>
          {Array.from({ length: nombreEcheances }).map((_, index) => (
            <div key={index}>
              <label className="my-1">{paiements[index]?.mois}:</label>
              <span>{calculateMontantEcheance()} €</span>
              <select
                className='form-control'
                value={paiements[index]?.moyenPaiement}
                onChange={(e) => {
                  const updatedPaiements = [...paiements];
                  updatedPaiements[index] = { ...updatedPaiements[index], moyenPaiement: e.target.value };
                  setPaiements(updatedPaiements);
                }}
              >
                <option value="">Choisissez un moyen de paiement</option>
                <option value="Espèces">Espèces</option>
                <option value="Chèque">Chèque</option>
                <option value="ANCV">ANCV</option>
                <option value="Coupons-sport">Coupons-sport</option>
                <option value="CB">CB</option>
              </select>
            </div>
          ))}
        {/* <h5 className="my-3">Option achat Dobok à part</h5>
        <div>
          <label>Montant:</label>
          <span>{dobokTaille ? dobokTailles.find((item) => item.taille === dobokTaille)?.prix : 0} €</span>
        </div>
        <div>
          <label>Mode paiement:</label>
          <select className='form-control' value={dobokPaiement} onChange={(e) => setDobokPaiement(e.target.value)}>
            <option value="">Choisissez un moyen de paiement</option>
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
            <option value="ANCV">ANCV</option>
            <option value="Coupons-sport">Coupons-sport</option>
            <option value="CB">CB</option>
          </select>
        </div> */}
      </div>
        <div>
          <h3 className="my-3">COMMENTAIRES / NOTES</h3>
          <textarea
            value={commentaire}
            className="w-100 form-control"
            onChange={(e) => setCommentaire(e.target.value)}
            rows={6}
            maxLength={3000}
            placeholder="Ajouter un commentaire ou une note..."
          />
        </div>
        <button type="submit" className="btn btn-success my-3"> Soumettre </button>
        
      </form>
      <button onClick={generatePdf} className="btn btn-danger mb-3">
        Générer PDF
      </button>
      {showPdf && (
        <div>
          <PDFViewer width="800" height="600">
            <PdfGenerator formData={formData} />
          </PDFViewer>
        </div>
      )}
    </div>
    );
  };
 
export default Inscription;