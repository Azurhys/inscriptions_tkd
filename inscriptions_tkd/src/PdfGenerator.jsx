import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

function calculateDobokPrice(formData) {
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

  const selectedSize = formData.dobokTaille;
  const sizeData = dobokTailles.find(item => item.taille === selectedSize);
  
  if (sizeData) {
    return sizeData.prix;
  }

  // Retournez un prix par défaut si la taille n'est pas trouvée
  return 0;
}


const PdfGenerator = ({formData}) => (
  
  <Document>
    <Page size="A4" style={styles.page}>
        <View style={styles.imageContainer}>
          <Image src="/logo.jpg" style={styles.image} />
          <Text style={styles.entete}>Fiche d'inscription </Text>
        </View>
      <View style={styles.section}>
        <Text style={styles.title}>I - État Civil</Text>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}> Nom : {formData.nom} </Text>
          <Text style={styles.bodyText}> Prénom : {formData.prenom} </Text>
          <Text style={styles.bodyText}> Genre : {formData.genre} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}> Date de naissance : {formData.dateNaissance} </Text>
          <Text style={styles.bodyText}> Poids en Kg : {formData.poids} </Text>
          <Text style={styles.bodyText}> Taille en cm : {formData.taille} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}> Adresse : {formData.adresse.adresse1} {formData.adresse.adresse2} {formData.adresse.codePostal} {formData.adresse.ville} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}> Adresse mail 1 : {formData.email1} </Text>
          <Text style={styles.bodyText}> Adresse mail 2 : {formData.email2} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}> N° Portable 1 : {formData.portable1} </Text>
          <Text style={styles.bodyText}> N° Portable 2 : {formData.portable2} </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>II - Personnes à prévenir en cas d'urgence (pour les mineurs) </Text>
            <View style={styles.bodyContainer}>
                <View style={styles.colContainer}>
                  <Text style={styles.bodyTextContact}> Personne n°1 </Text>
                  <View style={styles.contactContainer}>
                    <Text style={styles.bodyText}> Nom : {formData.personne1.nom} </Text>
                    <Text style={styles.bodyText}> Prenom : {formData.personne1.prenom} </Text>
                    <Text style={styles.bodyText}> Lien de parenté : {formData.personne1.lienParente} </Text>
                    <Text style={styles.bodyText}> N° Portable : {formData.personne1.numeroPortable} </Text>
                  </View>
                </View>
                <View style={styles.colContainer}>
                  <Text style={styles.bodyTextContact}> Personne n°2 </Text>
                  <View style={styles.contactContainer}>
                    <Text style={styles.bodyText}> Nom : {formData.personne2.nom} </Text>
                    <Text style={styles.bodyText}> Prenom : {formData.personne2.prenom} </Text>
                    <Text style={styles.bodyText}> Lien de parenté : {formData.personne2.lienParente} </Text>
                    <Text style={styles.bodyText}> N° Portable : {formData.personne2.numeroPortable} </Text>
                  </View>
                </View>
            </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>III - Montant de l'inscription</Text>
        <View style={styles.bodyContainer}>
                <View style={styles.colContainer}>
                  <Text style={styles.bodyTextContact}> Tranche d'age : {formData.trancheAge} </Text>
                    <Text style={styles.bodyText}> Adhésion au club : {formData.tarifs[formData.trancheAge].adhesionClub} € </Text>
                     <Text style={styles.bodyText}> Licence fédérale FFST : {formData.tarifs[formData.trancheAge].licenceFFST} €</Text>
                     <Text style={styles.bodyText}> Cours : {formData.tarifs[formData.trancheAge].cours} €</Text> 
                </View>
                 <View style={styles.colContainer}>
                  <View style={styles.contactContainer}>
                    <Text style={styles.bodyText}> Réduction Famille Nombreuse : {formData.reductionFamille} €</Text>
                    <Text style={styles.bodyText}> Réduction « PASS’ SPORT » de 50€ : {formData.hasReductionPassSport ? 'Oui' : 'Non'} </Text>
                    <Text style={styles.bodyText}> Dobok : {formData.dobokTaille} - Prix : {calculateDobokPrice(formData)} €</Text> 
                    <Text style={styles.prix}> Montant total : {formData.montantTotal} €</Text>
                  </View>
                </View> 
            </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>IV - Mode de paiement & Écheanciers </Text>
        <View style={styles.bodyContainer}>
          <View style={styles.echeancesContainer}>
            {formData.paiements.map((echeance, index) => (
              <View key={index} style={styles.echeanceContainer}>
                <Text style={styles.bodyText}>Mois : {echeance.mois} </Text>
                <Text style={styles.bodyText}>Montant : {echeance.montant} € </Text>
                <Text style={styles.bodyText}>Moyen de paiement : {echeance.moyenPaiement}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.bodyText}> Dobok à part : {formData.dobokPaiement} €</Text>  
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>V - Commentaires </Text>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}> {formData.commentaire} </Text>  
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>VI - Signature </Text>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>  Date et Signature de l'adhérent ou de son représentant légal </Text>  
        </View>
      </View>
      <View style={styles.footer}>
          <Text>U.S.M. (UNION SPORTIVE DE MAROLLES) </Text>
          <Text>N° SIRET 447 720 699 000 19 / Agrément Sportif Jeunesse et Sports N°12232</Text>
          <Text>SECTION USM TAEKWONDO</Text>
          <Text>N° SIRET 447 720 699 00068</Text>
          <Text>Mairie de Marolles En Hurepoix - 1, avenue Charles De Gaulle - 91630 MAROLLES EN HUREPOIX</Text>
          <Text>Tel  :  06.17.45.14.91</Text>
          <Text>Mail :	marollestaekwondo@gmail.com   </Text>
          <Text>Facebook :  https://www.facebook.com/Usmtaekwondo</Text>
          <Text>N° d’affiliation F.F.S.T. : 10-91-2550</Text>
        </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 20,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'start',
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100, // Largeur de l'image // Hauteur de l'image
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'blue',
    marginBottom: 5,
  },
  entete: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 20,
  },
  bodyContainer: {
    flexDirection: 'row',
  },
  bodyText: {
    fontSize: 14,
    marginBottom: 5, 
  },
  bodyTextContact: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold', 
  },
  contactContainer: {
    marginLeft: 15,
  },
  colContainer:{
    flexDirection:'column',
  },
  prix: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'red',
    marginBottom: 5,
  },
  echeanceContainer: {
    flexDirection: "column", // Utilise Flexbox pour aligner les éléments horizontalement
    justifyContent: "space-between", // Les éléments sont espacés également
    marginBottom: 10, // Marge en bas pour séparer les lignes
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 1,
    right: 0,
    textAlign: 'start',
    fontSize: 10,
  },
});

export default PdfGenerator;
