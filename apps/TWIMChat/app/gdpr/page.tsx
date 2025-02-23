import React from "react";
import MagicCard from "@/components/ui/MagicCard";
import DockWrapper from "@/components/DockWrapper";

const PrivacyPolicy = () => {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden h-screen">
      <div
        className="relative botttom-4"
        style={{ width: "90%", height: "85%" }}>
        <MagicCard
          title={``}
          className="relative items-center mx-auto max-h-screen overflow-hidden"
        >
          <div className="relative items-center justify-center overflow-y-auto h-full">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-4">
                Politique de Confidentialité de The World Is Mind
              </h1>
              <p className="italic mb-6">Dernière mise à jour : 22 Février 2025</p>

              <h2 className="text-2xl font-semibold mt-6">1. Introduction</h2>
              <p className="mt-2">
                Bienvenue sur <strong>The World Is Mind</strong>. La protection de vos
                données personnelles est une priorité pour nous. Cette politique de
                confidentialité explique quelles informations nous collectons, comment
                nous les utilisons et les mesures que nous prenons pour les protéger.
              </p>

              <h2 className="text-2xl font-semibold mt-6">
                2. Responsable du traitement des données
              </h2>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <strong>Nom de l'entreprise</strong> : Marvin POLOMACK
                </li>
                <li>
                  <strong>Adresse</strong> : 229 rue Saint-Honoré, 75001, Paris, France
                </li>
                <li>
                  <strong>Email</strong> : bolt@theworldismind.com
                </li>
                <li>
                  <strong>Téléphone</strong> : 07 69 31 94 48
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">3. Données collectées</h2>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <strong>Données d'identification</strong> : nom, prénom, adresse email.
                </li>
                <li>
                  <strong>Données de connexion</strong> : adresse IP, type de navigateur,
                  pages visitées.
                </li>
                <li>
                  <strong>Données de localisation</strong> : pays, ville (le cas échéant).
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">
                4. Méthodes de collecte
              </h2>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  Vous remplissez un formulaire de contact ou d'inscription.
                </li>
                <li>
                  Vous naviguez sur notre site via des cookies ou technologies similaires.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">
                5. Finalités du traitement
              </h2>
              <ul className="list-disc ml-6 mt-2">
                <li>Fournir et gérer nos services.</li>
                <li>Améliorer votre expérience utilisateur.</li>
                <li>
                  Envoyer des communications marketing, si vous y avez consenti.
                </li>
                <li>Analyser le trafic et l'utilisation du site.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">
                6. Base légale du traitement
              </h2>
              <ul className="list-disc ml-6 mt-2">
                <li>Votre consentement explicite.</li>
                <li>L'exécution d'un contrat.</li>
                <li>
                  Notre intérêt légitime à améliorer nos services.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">
                7. Partage des données
              </h2>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  Nos partenaires et sous-traitants pour l'exécution des services.
                </li>
                <li>
                  Les autorités légales si la loi l'exige.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">
                8. Transfert international de données
              </h2>
              <p className="mt-2">
                Si vos données sont transférées en dehors de l'Union Européenne, nous
                nous assurons que des mesures de protection adéquates sont en place,
                conformément au RGPD.
              </p>

              <h2 className="text-2xl font-semibold mt-6">
                9. Durée de conservation
              </h2>
              <p className="mt-2">
                Vos données sont conservées pendant une durée de 3 ans à compter de votre dernière interaction avec nous,
                sauf obligation légale contraire.
              </p>

              <h2 className="text-2xl font-semibold mt-6">10. Vos droits</h2>
              <p className="mt-2">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <strong>Droit d'accès</strong> : obtenir une copie de vos données
                  personnelles.
                </li>
                <li>
                  <strong>Droit de rectification</strong> : corriger des données
                  inexactes ou incomplètes.
                </li>
                <li>
                  <strong>Droit à l'effacement</strong> : demander la suppression de vos
                  données.
                </li>
                <li>
                  <strong>Droit à la limitation du traitement</strong> : restreindre
                  l'utilisation de vos données.
                </li>
                <li>
                  <strong>Droit à la portabilité</strong> : recevoir vos données dans un
                  format structuré.
                </li>
                <li>
                  <strong>Droit d'opposition</strong> : vous opposer au traitement de
                  vos données pour des motifs légitimes.
                </li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous à bolt@theworldismind.com.
              </p>

              <h2 className="text-2xl font-semibold mt-6">
                11. Sécurité des données
              </h2>
              <p className="mt-2">
                Nous mettons en œuvre des mesures techniques et organisationnelles pour
                protéger vos données contre tout accès non autorisé, modification ou
                destruction.
              </p>

              <h2 className="text-2xl font-semibold mt-6">
                12. Modifications de la politique de confidentialité
              </h2>
              <p className="mt-2">
                Nous pouvons mettre à jour cette politique de confidentialité pour
                refléter les changements de nos pratiques ou des obligations légales.
                Nous vous informerons de toute modification significative via notre
                site ou par email.
              </p>

              <h2 className="text-2xl font-semibold mt-6">13. Contact</h2>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <strong>Email</strong> : bolt@theworldismind.com
                </li>
                <li>
                  <strong>Adresse</strong> : 229 rue Saint-Honoré, 75001, Paris, France
                </li>
              </ul>
            </div>
          </div>
        </MagicCard>
      </div>
      <div className="absolute flex items-center w-full bottom-3">
        <DockWrapper />
      </div>
    </div>
  );
};

export default PrivacyPolicy;