/* =====================================================
   TES PROJETS
   Chaque projet a une carte (page d'accueil) et une page complète.

   Pour modifier : change le texte entre guillemets.
   Pour ajouter un projet : copie un bloc { ... } entier, colle-le
   dans la liste (sans oublier la virgule), et donne-lui un id unique.

   Champs :
   - id        : court, sans espace ni accent (sert dans l'adresse de la page)
   - categories: métiers concernés, parmi 'data-analyst', 'data-engineer',
                 'data-scientist' (un projet peut en avoir plusieurs)
   - image     : chemin de l'image de couverture, ex. 'images/sara.jpg'
                 (carte + haut de page). '' → un motif de réseau s'affiche.
   - imageAlt  : description courte de l'image (pour l'accessibilité)
   - summary   : une phrase (carte + haut de page)
   - result    : le résultat en une ou deux phrases (carte)
   - meta      : petites infos (cadre, période, rôle). value '' → « à compléter »
   - metrics   : jusqu'à 4 chiffres clés { value, label } (optionnel)
   - steps     : les étapes, dans l'ordre. text '' → « à compléter ».
                 Une étape peut avoir image: 'images/xxx.png' et
                 imageCaption: 'légende' (schéma, capture d'écran…)
   - resultsPoints / resultsTable : détail des résultats (optionnels)
   - links     : adresses complètes (https://...) ou ''
   ===================================================== */

/* Les boutons de filtre de la section Projets (l'ordre = l'ordre d'affichage). */
const CATEGORIES = [
  { id: 'all', label: 'Tous les projets' },
  { id: 'data-analyst', label: 'Data Analyst' },
  { id: 'data-engineer', label: 'Data Engineer' },
  { id: 'data-scientist', label: 'Data Scientist' },
];

const PROJECTS = [
  /* ---------------------------------------------------- SARA */
  {
    id: 'sara',
    categories: ['data-scientist', 'data-engineer'],
    image: '', // ex. 'images/sara.jpg'
    imageAlt: '',
    kicker: 'Projet de fin d’études · Sonatel',
    title: 'SARA — agent de recommandation d’offres',
    summary:
      'Un agent IA qui recommande à chaque client prépayé l’offre la mieux adaptée à son usage, en conversation ou de façon proactive.',
    context:
      'Choisir la bonne offre prépayée dans un large catalogue n’est pas simple pour un client. SARA (Sonatel AI Recommendation Agent) analyse le profil et les habitudes de consommation d’un client pour lui proposer une offre pertinente, et peut aussi le solliciter de lui-même quand son comportement le justifie.',
    stack: ['Python', 'LangGraph', 'LLM', 'RAG · ChromaDB', 'FastAPI', 'HiveSQL', 'K-Means', 'LangSmith'],
    result:
      'Évalué sur 48 scénarios (réactifs, proactifs, adversariaux) selon 6 métriques, avec une comparaison de deux LLM sur la qualité, le coût et la latence.',
    meta: [
      { label: 'Cadre', value: 'Projet de fin d’études · Sonatel (S2D)' },
      { label: 'Période', value: '2026' },
      { label: 'Mon rôle', value: 'Conception, développement et évaluation' },
    ],
    metrics: [
      { value: '48', label: 'scénarios d’évaluation' },
      { value: '6', label: 'métriques de qualité' },
      { value: '8', label: 'déclencheurs proactifs' },
      { value: '7', label: 'segments de clients' },
    ],
    steps: [
      {
        title: 'Cadrer le besoin et choisir l’architecture',
        text: 'J’ai d’abord défini ce que l’agent devait faire (répondre à un client, mais aussi prendre l’initiative) et comparé un agent unique à une architecture multi-agents.',
        bullets: [
          'Choix d’un agent unique : plus simple, réalisable dans les délais, et un LLM suffisamment capable pour la tâche.',
          'Diagrammes de séquence pour les deux modes (réactif et proactif) et diagramme de classes.',
        ],
      },
      {
        title: 'Construire la vue « Customer 360 »',
        text: 'Pour que l’agent connaisse chaque client, j’ai construit un profil comportemental à partir des données de l’opérateur.',
        bullets: [
          'Vues HiveSQL sur 5 univers : identité, voix/SMS, data, recharges et Orange Money.',
          'Plus de 175 variables comportementales et 18 écarts de comportement entre une période de référence et une période d’observation.',
          'Sélection de 15 variables, normalisation MinMax, puis segmentation K-Means en 7 segments (coude et Calinski-Harabasz pour valider).',
        ],
      },
      {
        title: 'Concevoir l’agent avec LangGraph',
        text: 'L’agent suit le schéma ReAct : il raisonne, appelle des outils, puis répond.',
        bullets: [
          'Graphe à 4 nœuds : contrôle de l’entrée, agent, outils, contrôle de la sortie.',
          'État partagé qui étend le suivi des messages de LangGraph.',
        ],
      },
      {
        title: 'Développer les outils de l’agent',
        text: 'Les outils sont regroupés en 4 modules, pour que le LLM raisonne sur des données fiables plutôt que de les inventer.',
        bullets: [
          'Profilage : 6 outils (profil, tendance de consommation, transactions, historique d’interactions, contexte proactif, facture).',
          'Catalogue : entonnoir de filtrage en 4 étapes (éligibilité de la formule, exclusion 2G, filtre de budget, tri par pertinence d’usage). Python filtre, le LLM raisonne.',
          'Transaction, et FAQ en RAG avec ChromaDB et des embeddings multilingues.',
        ],
      },
      {
        title: 'Ajouter la mémoire et le mode proactif',
        text: 'Pour garder le fil d’une conversation et agir sans qu’on le demande.',
        bullets: [
          'Mémoire en trois couches : messages récents (limités à 10), archive SQLite, résumés épisodiques générés par le LLM.',
          'Planificateur déterministe en Python avec 8 déclencheurs comportementaux, répartis en 3 familles : rétention, optimisation, accompagnement.',
        ],
      },
      {
        title: 'Sécuriser l’agent',
        text: 'Protection contre l’injection de prompt (OWASP LLM01) à l’entrée comme à la sortie.',
        bullets: [
          'Nœuds de contrôle dédiés dans le graphe.',
          'Fichier de configuration listant 20 motifs d’injection et 20 termes interdits en sortie.',
        ],
      },
      {
        title: 'Exposer et suivre l’agent',
        text: 'Pour le tester, le brancher à d’autres canaux et comprendre ses décisions.',
        bullets: [
          'API REST FastAPI (conversation, streaming, proactif, santé), indépendante du canal.',
          'Interface de test Chainlit et traçage des exécutions avec LangSmith.',
        ],
      },
      {
        title: 'Évaluer rigoureusement',
        text: 'Un protocole d’évaluation en trois volets : l’agent, la comparaison de deux LLM et, à venir, le RAG.',
        bullets: [
          '48 scénarios stratifiés : 28 réactifs, 7 proactifs et 13 adversariaux.',
          '6 métriques (consistance, véracité, économie, efficacité, explicabilité, proactivité) dans le cadre AutoConcierge.',
          'Juge LLM extérieur aux deux modèles testés, pour éviter un biais de famille.',
        ],
      },
    ],
    resultsPoints: [
      'Évaluation sur 48 scénarios, dont 13 adversariaux pour tester la robustesse.',
      'DeepSeek V4 Flash devance Claude Sonnet 4.6 sur toutes les métriques de qualité ; Sonnet reste plus rapide.',
      'Prochaine étape : évaluation de la partie RAG (FAQ) avec RAGAS sur 20 questions.',
    ],
    // ⚠ À vérifier avec Sonatel avant de publier ces scores.
    resultsTable: {
      caption: 'Comparaison des deux LLM (notes de 0 à 1, juge LLM externe)',
      head: ['Métrique', 'Claude Sonnet 4.6', 'DeepSeek V4 Flash'],
      rows: [
        ['Consistance', '0,95', '1,00'],
        ['Véracité', '0,90', '0,97'],
        ['Économie', '0,71', '0,91'],
        ['Efficacité', '0,98', '0,99'],
        ['Explicabilité', '0,96', '0,99'],
        ['Proactivité', '0,99', '0,99'],
        ['Latence médiane (P50)', '12,4 s', '16,0 s'],
        ['Latence P99', '24,9 s', '31,0 s'],
      ],
    },
    // ⚠ Sonatel : ne publie ni le nombre de clients ni de données internes.
    links: { github: '', demo: '', report: '' },
  },

  /* -------------------------------------------------- OLIST */
  {
    id: 'olist',
    categories: ['data-scientist', 'data-engineer'],
    image: '', // ex. 'images/olist.jpg'
    imageAlt: '',
    kicker: 'Projet d’équipe (3 personnes) · MLOps',
    title: 'Segmentation clients Olist',
    summary:
      'Segmenter les clients d’une plateforme e-commerce brésilienne, puis industrialiser le modèle avec une chaîne MLOps complète.',
    context:
      'À partir des données de l’e-commerce brésilien Olist, l’objectif était d’identifier des groupes de clients aux comportements proches, et de livrer le modèle comme un vrai service : suivi des expériences, versionnement des données, API, tests et déploiement automatisé.',
    stack: ['Python', 'Scikit-learn', 'MLflow', 'DVC', 'FastAPI', 'Docker', 'GitHub Actions', 'Pytest'],
    result:
      '5 segments clients identifiés ; stabilité suivie par l’ARI, avec un ré-entraînement semestriel recommandé.',
    meta: [
      { label: 'Cadre', value: 'Projet d’équipe · MLOps' },
      { label: 'Équipe', value: '3 personnes' },
      { label: 'Période', value: 'Juin 2026' },
      { label: 'Mon rôle', value: '' }, // TODO : précise ta part du travail
    ],
    metrics: [
      { value: '5', label: 'segments de clients' },
      { value: '9', label: 'variables comportementales' },
      { value: '14+', label: 'expériences suivies (MLflow)' },
      { value: '0,85', label: 'seuil d’alerte de stabilité (ARI)' },
    ],
    steps: [
      {
        title: 'Comprendre les données et poser le problème',
        text: 'Exploration des données de commandes de la plateforme et définition de l’objectif : regrouper les clients selon leur comportement d’achat.',
      },
      {
        title: 'Construire les variables comportementales',
        text: 'Création de 9 variables décrivant le comportement de chaque client, mises à la même échelle avec une normalisation MinMax.',
      },
      {
        title: 'Comparer les modèles de clustering',
        text: 'Quatre familles d’algorithmes comparées, avec plus de 14 expériences suivies dans MLflow.',
        bullets: [
          'K-Means, mélange gaussien (GMM), DBSCAN et clustering agglomératif.',
          'Choix final : K-Means avec K=5, sans réduction de dimension (pas d’ACP).',
        ],
      },
      {
        title: 'Interpréter les segments',
        text: 'Lecture des 5 segments obtenus pour comprendre qui sont ces clients et ce qui les distingue.',
      },
      {
        title: 'Industrialiser avec une chaîne MLOps',
        text: 'Le modèle est livré comme un service reproductible et testé.',
        bullets: [
          'DVC pour versionner les données et les étapes du pipeline.',
          'FastAPI pour servir le modèle, Docker pour l’empaqueter.',
          'Tests Pytest et intégration continue avec GitHub Actions.',
        ],
      },
      {
        title: 'Surveiller la stabilité dans le temps',
        text: 'Suivi de la stabilité des segments avec l’indice ARI : il passe sous 0,85 après environ 8 mois, d’où la recommandation d’un ré-entraînement tous les six mois.',
      },
    ],
    resultsPoints: [
      '5 segments de clients identifiés à partir de 9 variables comportementales.',
      'Plus de 14 expériences comparées et tracées dans MLflow.',
      'Ré-entraînement semestriel recommandé, car la stabilité (ARI) passe sous 0,85 vers 8 mois.',
    ],
    links: { github: '', demo: '', report: '' },
  },

  /* ---------------------------------------- RAG TELEGRAM */
  {
    id: 'rag-telegram',
    categories: ['data-scientist'],
    image: '', // ex. 'images/rag-telegram.jpg'
    imageAlt: '',
    kicker: 'Preuve de concept · Sonatel · 2024',
    title: 'Chatbot RAG sur Telegram',
    summary:
      'Un assistant conversationnel qui répond aux questions à partir d’une base de connaissances, directement dans Telegram.',
    context:
      'Preuve de concept réalisée chez Sonatel pour tester un assistant capable de répondre à partir d’une base de documents, dans une application de messagerie déjà familière aux utilisateurs.',
    stack: ['Python', 'RAG', 'LLM', 'Telegram'],
    result: '', // TODO : un résultat concret (temps de réponse, qualité, retour des testeurs…)
    meta: [
      { label: 'Cadre', value: 'Preuve de concept · Sonatel' },
      { label: 'Période', value: 'Août – décembre 2024' },
      { label: 'Mon rôle', value: 'Développeuse IA' },
    ],
    // TODO : remplace ces étapes par les tiennes (titres et textes).
    steps: [
      { title: 'Cadrer le besoin', text: '' },
      { title: 'Préparer la base de connaissances', text: '' },
      { title: 'Construire la chaîne RAG', text: 'Récupération des passages pertinents, puis génération de la réponse par un LLM.' },
      { title: 'Brancher le bot Telegram', text: '' },
      { title: 'Tester et améliorer', text: '' },
    ],
    links: { github: '', demo: '', report: '' },
  },

  /* ------------------------------------------ SENTIMENTS */
  {
    id: 'sentiments-wolof',
    categories: ['data-scientist'],
    image: '', // ex. 'images/sentiments-wolof.jpg'
    imageAlt: '',
    kicker: 'Projet NLP · Sonatel · 2025',
    title: 'Analyse de sentiments en wolof et en français',
    summary:
      'Détecter l’opinion exprimée dans des commentaires Facebook écrits en wolof, en français, ou un mélange des deux.',
    context:
      'Les commentaires des clients sur les réseaux sociaux mélangent souvent wolof et français, ce qui complique l’analyse automatique. Ce projet, mené en parallèle de ma mission d’analyste data, vise à classer ces commentaires selon leur sentiment.',
    stack: ['Python', 'NLP', 'Analyse de sentiments', 'Wolof'],
    result: '', // TODO : métrique (F1, exactitude…) et taille du jeu de données
    meta: [
      { label: 'Cadre', value: 'Sonatel · mission d’analyste data' },
      { label: 'Période', value: 'Juillet – décembre 2025' },
      { label: 'Mon rôle', value: '' }, // TODO
    ],
    // TODO : remplace ces étapes par les tiennes (titres et textes).
    steps: [
      { title: 'Collecter et nettoyer les commentaires', text: '' },
      { title: 'Étiqueter les sentiments', text: '' },
      { title: 'Choisir et entraîner le modèle', text: '' },
      { title: 'Évaluer les résultats', text: '' },
    ],
    links: { github: '', demo: '', report: '' },
  },

  /* --------------------------------------- CDR / BTS KÉDOUGOU */
  {
    id: 'cdr-kedougou',
    categories: ['data-analyst'],
    image: '', // ex. 'images/cdr-kedougou.jpg'
    imageAlt: '',
    kicker: 'Mission data analyst · Sonatel · 2025',
    title: 'Analyse géospatiale CDR / BTS — Kédougou',
    summary:
      'Analyse de données d’appels (CDR) et de sites radio (BTS) sur la région de Kédougou, avec une approche Big Data et géospatiale.',
    context:
      'Mission réalisée chez Sonatel en tant que Data Analyst Big Data & Géospatial : exploiter des données télécoms à grande échelle et les relier à leur localisation.',
    stack: ['Big Data', 'Géospatial', 'CDR', 'BTS'], // TODO : ajoute les outils (SQL, Hive, Python, QGIS, Tableau…)
    result: '', // TODO : un enseignement ou un chiffre clé, sans donnée sensible
    meta: [
      { label: 'Cadre', value: 'Mission d’analyste data · Sonatel' },
      { label: 'Période', value: 'Juillet – décembre 2025' },
      { label: 'Mon rôle', value: 'Data Analyst Big Data & Géospatial' },
    ],
    // TODO : remplace ces étapes par les tiennes. ⚠ Ne publie que des résultats agrégés,
    // jamais de données individuelles ni internes (les CDR sont sensibles).
    steps: [
      { title: 'Collecter et préparer les données', text: '' },
      { title: 'Analyser l’usage du réseau', text: '' },
      { title: 'Cartographier et restituer', text: '' },
    ],
    links: { github: '', demo: '', report: '' },
  },
];
