/* =====================================================
   À PROPOS
   Modifie ici le texte de la section « À propos ».

   - intro      : tes paragraphes de présentation
   - facts      : la fiche « en bref »
   - education  : ta formation (la plus récente en premier)
   - experience : tes expériences (la plus récente en premier)
       period  : ex. 'Juil. – déc. 2025'  ('' → « Dates à compléter »)
       project : id d'un projet de projects.js pour ajouter un lien (optionnel)
       skills  : ce que tu y as utilisé / appris (étiquettes)
   ===================================================== */

const ABOUT = {
  // TODO : adapte ces paragraphes à ta voix.
  intro: [
    'Je suis ingénieure en informatique et télécommunications, diplômée de l’École Polytechnique de Thiès, et je vis à Dakar. Je travaille à la croisée de l’IA et de la donnée : agents LLM, RAG, traitement du langage en wolof et en français, et pipelines de données.',
    'Mon parcours s’est construit chez Sonatel (Orange Sénégal) : un chatbot RAG sur Telegram, une mission d’analyste data en Big Data et géospatial, puis mon projet de fin d’études, SARA, un agent IA de recommandation d’offres. Ce qui m’intéresse : relier un vrai besoin métier à un système d’IA évalué et utilisable.',
  ],

  facts: [
    { label: 'Basée à', value: 'Dakar, Sénégal' },
    { label: 'Formation', value: 'Ingénieure en informatique et télécommunications (EPT)' },
    { label: 'Domaines', value: 'IA / ML · agents LLM · pipelines de données · NLP' },
    { label: 'Expérience', value: 'Sonatel (Orange Sénégal) · 2024 – 2026' },
  ],

  // TODO : ajoute les années, ta spécialisation, et tes formations précédentes.
  education: [
    {
      title: 'Diplôme d’ingénieur · Informatique et Télécommunications',
      org: 'École Polytechnique de Thiès (EPT)',
      period: '',
      bullets: ['Projet de fin d’études réalisé chez Sonatel (SARA) et soutenu avec succès.'],
      project: 'sara',
      skills: [],
    },
  ],

  experience: [
    {
      title: 'Stagiaire ingénieure IA · Projet de fin d’études',
      org: 'Sonatel (Orange Sénégal) · Smart & Data-Driven Hub (S2D)',
      period: '2026',
      bullets: [
        'Conception et développement de SARA, un agent IA qui recommande des offres prépayées.',
        'Construction d’un profil client en HiveSQL et segmentation K-Means.',
        'Évaluation sur 48 scénarios et comparaison de deux LLM.',
      ],
      project: 'sara',
      skills: ['LangGraph', 'RAG', 'FastAPI', 'HiveSQL', 'K-Means'],
    },
    {
      title: 'Data Analyst Big Data & Géospatial',
      org: 'Sonatel (Orange Sénégal)',
      period: 'Juil. – déc. 2025',
      bullets: [
        'Analyse de données d’appels (CDR) et de sites radio (BTS) sur la région de Kédougou.',
        'En parallèle, projet NLP d’analyse de sentiments sur des commentaires Facebook en wolof et en français.',
      ],
      project: 'cdr-kedougou',
      skills: ['Big Data', 'Géospatial', 'NLP', 'Analyse de sentiments'],
    },
    {
      title: 'Développeuse IA',
      org: 'Sonatel (Orange Sénégal)',
      period: 'Août – déc. 2024',
      bullets: ['Réalisation d’une preuve de concept de chatbot RAG accessible sur Telegram.'],
      project: 'rag-telegram',
      skills: ['RAG', 'LLM', 'Python', 'Telegram'],
    },
  ],
};
