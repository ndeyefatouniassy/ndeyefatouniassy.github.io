# Ajouter tes images de projet

1. Mets ton image dans ce dossier (`images/`).
   - Nom court, en minuscules, sans espace ni accent : `sara.jpg`, `olist-segments.png`…
   - Format JPG, PNG ou WebP. Idéalement **1600 × 900 px** (rapport 16:9) et **moins de 300 Ko**.
2. Ouvre `projects.js`, trouve ton projet et renseigne :
   ```js
   image: 'images/sara.jpg',
   imageAlt: 'Schéma de l’architecture de SARA',
   ```
3. C'est tout : l'image apparaît sur la carte et en haut de la page du projet.
   Tant que `image` est vide, un motif de réseau aux couleurs du site s'affiche.

## Images dans les étapes (optionnel)
Dans `steps`, une étape peut aussi avoir une image :
```js
{ title: 'Concevoir l’agent avec LangGraph', text: '…', image: 'images/sara-graphe.png', imageCaption: 'Graphe de l’agent' }
```

## À éviter
- Les captures qui montrent des données internes, des noms de clients ou des chiffres confidentiels (Sonatel).
- Les images trop lourdes : elles ralentissent le site.
- Idées d'images : un schéma d'architecture, un graphique de résultats, une capture de l'interface (Chainlit, MLflow…).
