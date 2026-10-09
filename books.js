/* =====================================================
   LIVRES LUS (section Blog)
   Champs : id, title, author, domain, image (ex. 'images/books/mon-livre.jpg'),
            note (ce que tu en retiens, 1–2 phrases), draft.
   domain : 'data-engineering' | 'machine-learning' | 'data-analyst'
   Les entrées « draft: true » sont des MODÈLES : remplace-les par tes vrais livres
   (puis supprime « draft: true »). Couverture conseillée : ~600×900 px, < 150 Ko.
   ===================================================== */
const BOOK_DOMAINS = [
  { id: 'all', label: 'Tous' },
  { id: 'data-engineering', label: 'Data Engineering' },
  { id: 'machine-learning', label: 'Machine Learning' },
  { id: 'data-analyst', label: 'Data Analyst' },
];

const BOOKS = [
  { draft: true, id: 'modele-de', domain: 'data-engineering', title: 'Titre du livre', author: 'Auteur', image: '', note: '' },
  { draft: true, id: 'modele-ml', domain: 'machine-learning', title: 'Titre du livre', author: 'Auteur', image: '', note: '' },
  { draft: true, id: 'modele-da', domain: 'data-analyst', title: 'Titre du livre', author: 'Auteur', image: '', note: '' },
];
