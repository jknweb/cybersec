# Aton Cybersécurité : proposition de refonte

Copie de la page d'accueil de [cybersecurite.cd](https://cybersecurite.cd/) reprenant ses textes, menus, liens et images, avec des animations sobres et des corrections mineures (fautes, liens e-mail, titre principal en `h1`, textes alternatifs des images).

## Structure

```
index.html              page d'accueil
css/style.css           styles (couleurs regroupées en haut du fichier)
js/main.js              animations et interactions
images/                 images d'origine du site
scripts/telecharger-images.sh   récupère les images depuis cybersecurite.cd
```

## Voir le site

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur :

```
python3 -m http.server 8000
```

## Animations

- Apparition progressive des sections au défilement
- En-tête qui se compacte, barre de progression de lecture, bouton retour en haut
- Réseau de points animé et visuel flottant dans l'en-tête
- Cartes à légère inclinaison au survol, effet d'onde sur les boutons
- Onglets clients avec indicateur glissant (navigables au clavier)
- Menu « Nos solutions » en méga-menu, menu mobile animé

Toutes les animations sont désactivées si le visiteur a demandé à réduire les mouvements.

## Images

Si le dossier `images/` est vide, lancer `./scripts/telecharger-images.sh`.
