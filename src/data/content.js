// ============================================
// INFORMATIONS GÉNÉRALES DU CABINET
// ============================================
export const cabinetInfo = {
  nomComplet: "BK SUCCESS CONSULTING SARL",
  sigle: "BKSC",
  slogan: "Votre succès, notre expertise.",
  sloganAlternatif: "Comptez sur nous.",
  accroche: "Cabinet d'assistance aux entreprises — Comptabilité · Fiscalité · Juridique · Formation",
  baseline: "Efficacité, Qualité, Accessibilité, Confidentialité, confiance",
  publicCible: "PME, TPE, cliniques, associations, porteurs de projets — Douala et Cameroun",
  anneeFondation: 2019,
  statutJuridique: "Société à Responsabilité Limitée (SARL) — Droit OHADA",
  rccm: "RC/DLN/2019/B/1069",
  niu: "M051912785954F",

  // Directeur — nom personnel pas encore communiqué
  directeur: "[NOM DU DIRECTEUR]",
  titreDirecteur: "Directeur Général",

  // Coordonnées
  adresse: "Ndogbong Citadelle, Douala, Région du Littoral, Cameroun",
  repere: "Ndogbong, à 100m de IPH",
  telephonePrincipal: "+237 657 37 89 27",
  telephoneSecondaire: "+237 673 40 92 31",
  whatsapp: "237657378927",
  email: "bksuccessconsulting@gmail.com",

  horaires: {
    semaine: "08h00 – 12h30  et  13h30 – 17h00",
    samedi: "08h00 – 13h00 (si activité)",
    dimanche: "Fermé",
  },
}

// ============================================
// CHARTE GRAPHIQUE OFFICIELLE
// ============================================
export const couleurs = {
  bleuRoyal: "#0A69AD",   // Header, navbar, boutons CTA
  or: "#C9A227",          // Mot "success", highlights, badges, prix
  blanc: "#FFFFFF",
  grisClair: "#F4F6F8",   // Sections alternées
  bleuFonce: "#065280",   // Titres, liens hover
}

// ============================================
// VISION / MISSION
// ============================================
export const visionMission = {
  vision: "Être, à l'horizon 2028, le cabinet d'assistance aux entreprises de référence de Douala et du Cameroun pour les PME et TPE, reconnu pour l'excellence de ses travaux, l'agrément officiel de son pôle formation et la digitalisation de ses services.",
  mission: "Accompagner les entreprises camerounaises dans la gestion de leurs obligations comptables, fiscales, juridiques et sociales, avec une expertise technique irréprochable, une relation de confiance durable et un souci permanent de former les professionnels de demain.",
}

// ============================================
// HISTORIQUE
// ============================================
export const historique = [
  {
    periode: "2019",
    texte: "Fondation de BK SUCCESS CONSULTING SARL à Douala. Constitution du premier portefeuille clients, amélioration de la qualité de services offertes aux clients antérieurs.",
  },
  {
    periode: "2020–2021",
    texte: "Élargissement du portefeuille. Développement de l'expertise DSF, fiscalité PME. Premières missions juridiques.",
  },
  {
    periode: "2022–2023",
    texte: "Constitution de l'équipe permanente. Développement vers la santé, les associations et les ONG.",
  },
  {
    periode: "2024–2025",
    texte: "Manuel des Procédures V3.0. Logiciel Sage Saari. Lancement du Pôle Formation.",
  },
  {
    periode: "2026",
    texte: "Manuel V3.0 complet. 4 modules certifiants. Démarche MINEFOP. Lancement du site web.",
  },
]

// ============================================
// VALEURS FONDAMENTALES
// ============================================
export const valeurs = [
  {
    titre: "Intégrité",
    texte: "Honnêteté absolue dans tous nos travaux. Chaque chiffre est exact et défendable. Aucun compromis sur la sincérité.",
  },
  {
    titre: "Excellence",
    texte: "Tout travail est vérifié deux fois avant d'être remis. Nous refaisons plutôt que livrer quelque chose d'imparfait.",
  },
  {
    titre: "Secret professionnel",
    texte: "Confidentialité totale sur toutes les informations de nos clients. Obligation permanente et sans exception.",
  },
  {
    titre: "Respect",
    texte: "Respect de nos clients, de leurs délais et de leur budget. Respect mutuel au sein de l'équipe.",
  },
  {
    titre: "Responsabilité",
    texte: "Chacun répond de la qualité de son travail. Nous signalons nos erreurs avant que le client ne les découvre.",
  },
]

// ============================================
// SERVICES (6)
// ============================================
export const services = [
  {
    id: 1,
    titre: "Comptabilité",
    icone: "Calculator",
    accroche: "Nous tenons votre comptabilité avec la rigueur d'un grand cabinet et la proximité d'un partenaire de confiance.",
    items: [
      "Tenue comptabilité générale SYSCOHADA révisé (achats, ventes, banque, caisse, OD)",
      "Grand livre, balance mensuelle et rapprochement bancaire",
      "Lettrage comptes clients/fournisseurs — suivi créances",
      "États financiers annuels : bilan, compte de résultat",
      "Tableau de bord mensuel de gestion",
    ],
  },
  {
    id: 2,
    titre: "Fiscalité & Déclarations",
    icone: "FileText",
    accroche: "Vos obligations déclaratives entièrement prises en charge — TVA, IS, DSF — sans risque de pénalités.",
    items: [
      "Télédéclaration TVA mensuelle sur portail DGI",
      "Acompte IS mensuel, précomptes et retenues à la source",
      "Autres impôts : patentes, PSL, droits d'enregistrement, IGS",
      "DSF annuelle complète (CF1, CF2, tableaux annexes)",
      "Représentation lors des contrôles fiscaux DGI",
    ],
  },
  {
    id: 3,
    titre: "Social & Paie",
    icone: "Users",
    accroche: "De l'immatriculation CNPS à la gestion complète de votre paie — nous gérons vos obligations sociales.",
    items: [
      "Bulletins de salaire conformes Code du Travail camerounais",
      "Déclaration DIPE mensuel CNPS",
      "Immatriculation des employés à la CNPS",
      "Calcul des indemnités de fin de contrat",
      "Tenue et mise à jour du registre du personnel",
    ],
  },
  {
    id: 4,
    titre: "Juridique & Structuration",
    icone: "Scale",
    accroche: "De la création d'entreprise à la restructuration — votre partenaire juridique en droit des affaires OHADA.",
    items: [
      "Création d'entreprise : dossier CFCE complet, rédaction des statuts",
      "PV d'Assemblée Générale Ordinaire (AGO) et Extraordinaire (AGE)",
      "Modifications statutaires, augmentation / cession de capital",
      "Rédaction de contrats commerciaux et conventions",
      "Conseil en droit OHADA et structuration patrimoniale",
    ],
  },
  {
    id: 5,
    titre: "Audit & Contrôle de gestion",
    icone: "Search",
    accroche: "Nous contrôlons vos comptes, analysons vos performances et vous aidons à prendre les bonnes décisions.",
    items: [
      "Revue comptable périodique et audit de cohérence",
      "Analyse financière (ratios, marges, besoin en fonds de roulement)",
      "Tableau de bord mensuel personnalisé avec KPIs",
      "Plan de trésorerie prévisionnel sur 12 mois",
      "Rapport de recommandations de gestion",
    ],
  },
  {
    id: 6,
    titre: "Conseil en gestion",
    icone: "Lightbulb",
    accroche: "Nous vous aidons à prendre les bonnes décisions financières avec des données fiables et une expertise terrain.",
    items: [
      "Budget annuel et suivi des écarts",
      "Optimisation fiscale légale",
      "Conseil en restructuration d'entreprise",
      "Accompagnement lors des demandes de financement",
      "Présentation des résultats aux associés",
    ],
  },
]

// ============================================
// STATISTIQUES (compteurs animés accueil)
// ============================================
export const stats = [
  { valeur: new Date().getFullYear() - cabinetInfo.anneeFondation, suffixe: "+", label: "Années d'expérience" },
  { valeur: 6, suffixe: "", label: "Domaines d'expertise" },
  { valeur: 4, suffixe: "", label: "Modules de formation" },
  { valeur: "[À CONFIRMER]", suffixe: "", label: "Clients accompagnés" },
]

// ============================================
// FORMATIONS (4 modules complets)
// ============================================
export const formations = [
  {
    id: 1,
    titre: "Comptabilité Pratique OHADA",
    accroche: "De la saisie comptable au bilan annuel — maîtrisez la comptabilité d'une PME camerounaise.",
    duree: "3 mois (12 semaines) — 240 heures",
    vagueMatin: "08h00 – 12h00",
    vagueApresMidi: "13h00 – 17h00",
    places: "10 par vague (2 vagues par session)",
    prochainesSessions: ["S1 : 15 Janvier 2026", "S3 : 15 Juillet 2026"],
    attestation: "Attestation BKSC avec mention (note /20)",
    paiement: "3 tranches mensuelles accessibles",
    tarifs: [
      { segment: "Étudiant(e)s", prix: "110 000 FCFA" },
      { segment: "Salarié(e)s", prix: "150 000 FCFA" },
      { segment: "Chef(fe)s d'entreprise", prix: "200 000 FCFA" },
    ],
    fraisInscription: "10 000 FCFA (non remboursables)",
    minimumApprenants: 6,
    publicVise: "Étudiants BTS/Licence/Master · Salariés débutants · Toute personne souhaitant apprendre",
    programme: [
      "Sem. 1–2 : Plan comptable OHADA, partie double, journaux obligatoires",
      "Sem. 3–6 : Achats, ventes, banque, caisse — TP sur pièces réelles BKSC",
      "Sem. 7–8 : Grand livre, balance, lettrage, rapprochement bancaire",
      "Sem. 9–10 : États financiers annuels (bilan, compte de résultat)",
      "Sem. 11 : Travaux de fin d'exercice, initiation Sage Saari",
      "Sem. 12 : Révision + Examen final de certification",
    ],
  },
  {
    id: 2,
    titre: "Fiscalité PME & DSF Pratique",
    accroche: "TVA, IS, DSF — maîtrisez le système fiscal camerounais en autonomie complète.",
    duree: "3 mois (12 semaines) — 240 heures",
    vagueMatin: "08h00 – 12h00",
    vagueApresMidi: "13h00 – 17h00",
    places: "10 par vague (2 vagues par session)",
    prochainesSessions: ["S2 : 15 Avril 2026", "S4 : 15 Octobre 2026"],
    attestation: "Attestation BKSC avec mention (note /20)",
    paiement: "3 tranches mensuelles accessibles",
    tarifs: [
      { segment: "Étudiant(e)s", prix: "110 000 FCFA" },
      { segment: "Salarié(e)s", prix: "150 000 FCFA" },
      { segment: "Chef(fe)s d'entreprise", prix: "200 000 FCFA" },
    ],
    fraisInscription: "10 000 FCFA (non remboursables)",
    minimumApprenants: 6,
    publicVise: "Comptables en poste · Gestionnaires · Chefs d'entreprise",
    programme: [
      "Sem. 1–2 : Système fiscal camerounais, régimes, portail DGI",
      "Sem. 3–4 : TVA 19,25% — télédéclaration mensuelle",
      "Sem. 5–6 : IS mensuel, précomptes, retenues à la source, IGS",
      "Sem. 7–8 : Patentes, PSL, droits d'enregistrement, TDL",
      "Sem. 9–10 : DSF complète — CF1, CF2, tableaux annexes",
      "Sem. 11–12 : Lecture fiscale + Examen final",
    ],
  },
  {
    id: 3,
    titre: "Création d'Entreprise / CNPS / Paie",
    accroche: "Créez votre entreprise et gérez vos salariés avec toutes les obligations sociales CNPS.",
    duree: "3 mois (12 semaines) — 240 heures",
    vagueMatin: "08h00 – 12h00",
    vagueApresMidi: "13h00 – 17h00",
    places: "10 par vague (2 vagues par session)",
    prochainesSessions: ["S3 : 15 Juillet 2026"],
    attestation: "Attestation BKSC avec mention (note /20)",
    paiement: "3 tranches mensuelles accessibles",
    tarifs: [
      { segment: "Étudiant(e)s", prix: "110 000 FCFA" },
      { segment: "Salarié(e)s", prix: "150 000 FCFA" },
      { segment: "Chef(fe)s d'entreprise", prix: "200 000 FCFA" },
    ],
    fraisInscription: "10 000 FCFA (non remboursables)",
    minimumApprenants: 6,
    publicVise: "Porteurs de projets · Entrepreneurs · Responsables RH",
    programme: [
      "Sem. 1–2 : Formes juridiques au Cameroun — critères de choix",
      "Sem. 3–4 : Création CFCE : dossier, statuts, NIU",
      "Sem. 5–6 : Premières obligations fiscales post-création",
      "Sem. 7–8 : CNPS : inscription, cotisations, DIPE mensuel",
      "Sem. 9–10 : Bulletins de salaire — IRPP, CFC, TSA, cotisations",
      "Sem. 11–12 : Rupture contrat, solde tout compte + Examen final",
    ],
  },
  {
    id: 4,
    titre: "Audit Interne & Outils Numériques",
    accroche: "Excel avancé, Sage Saari, tableau de bord — pilotez votre activité avec des outils modernes.",
    duree: "3 mois (12 semaines) — 240 heures",
    vagueMatin: "08h00 – 12h00",
    vagueApresMidi: "13h00 – 17h00",
    places: "10 par vague (2 vagues par session)",
    prochainesSessions: ["S4 : 15 Octobre 2026"],
    attestation: "Attestation BKSC avec mention (note /20)",
    paiement: "3 tranches mensuelles accessibles",
    tarifs: [
      { segment: "Étudiant(e)s", prix: "110 000 FCFA" },
      { segment: "Salarié(e)s", prix: "150 000 FCFA" },
      { segment: "Chef(fe)s d'entreprise", prix: "200 000 FCFA" },
    ],
    fraisInscription: "10 000 FCFA (non remboursables)",
    minimumApprenants: 6,
    publicVise: "Responsables financiers · Comptables confirmés · Chefs d'entreprise PME",
    programme: [
      "Sem. 1–2 : Tableau de bord PME, KPIs, contrôle de gestion",
      "Sem. 3–4 : Audit interne — contrôles cohérence et vraisemblance",
      "Sem. 5–6 : Excel avancé : VPM, TRI, RECHERCHEV",
      "Sem. 7–8 : Tableaux croisés dynamiques, graphiques pro",
      "Sem. 9–10 : Sage Saari — saisie, édition, clôture mensuelle",
      "Sem. 11–12 : Plan de trésorerie prévisionnel + Examen final",
    ],
  },
]

// ============================================
// ÉQUIPE — en attente des noms et photos
// ============================================
export const equipe = [
  { role: "Directeur Général", nom: "[NOM]", photo: null },
  { role: "[FONCTION TM]", nom: "[NOM]", photo: null },
  { role: "[FONCTION EA]", nom: "[NOM]", photo: null },
  { role: "[FONCTION CST]", nom: "[NOM]", photo: null },
]

// ============================================
// TÉMOIGNAGES — en attente de collecte (objectif 5 écrits + 2 vidéos)
// ============================================
export const temoignages = []

// ============================================
// RÉSEAUX SOCIAUX — liens à confirmer
// ============================================
export const reseauxSociaux = {
  facebook: "[LIEN PAGE FACEBOOK]",
  whatsapp: "https://wa.me/237657378927",
  linkedin: "[LIEN LINKEDIN]",
  tiktok: "[LIEN TIKTOK]",
  youtube: "[LIEN YOUTUBE]",
  instagram: "[LIEN INSTAGRAM]",
}