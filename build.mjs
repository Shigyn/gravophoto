// ===================================================================
//  Gravophoto — generateur du site (LocWeb, 2026-11-02)
//     node build.mjs          -> apercu (noindex)
//     PROD=1 node build.mjs   -> mise en ligne
//  Prix et descriptions : sa boutique Wix. Telephone, e-mail : sa page
//  Facebook. Coloris des serviettes et produits sans prix : a confirmer.
//  Apercu : le panier fonctionne, le paiement Stripe n'est pas branche.
// ===================================================================
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');
const PROD = process.env.PROD === '1';
const URL_SITE = PROD ? 'https://www.gravophoto.com/' : 'https://shigyn.github.io/gravophoto/';
const PHOTOS = JSON.parse(fs.readFileSync(path.join(ICI, '_source', 'photos.json'), 'utf8'));
const V = '2';

const E = {
  nom: 'Gravophoto',
  devise: 'Cadeaux et personnalisation',
  accroche: 'Le spécialiste de la personnalisation d’objets',
  dirigeant: 'Sébastien Emery',
  siret: '451 487 136 00066',
  ville: 'Ambon',
  codePostal: '56190',
  departement: 'Morbihan',
  telAffiche: '06 62 41 23 83',
  tel: '+33662412383',
  email: 'gravophoto@hotmail.com',
  facebook: 'https://www.facebook.com/gravophoto72',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (ch) => URL_SITE + ch;
const prix = (n) => n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0 }) + ' €';
function img(r, nom, alt, { eager = false, sizes = '(min-width: 900px) 33vw, 100vw', cls = '' } = {}) {
  const p = PHOTOS[nom];
  if (!p) throw new Error('photo inconnue : ' + nom);
  const srcset = p.l > 800 ? ` srcset="${r}photos/${nom}-800.webp 800w, ${r}photos/${nom}-1600.webp ${p.l}w" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${r}photos/${nom}-800.webp"${srcset} alt="${esc(alt)}" width="${p.l}" height="${p.h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const I = {
  panier: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V6a5 5 0 0 1 10 0v1h3.5l-1.2 14H4.7L3.5 7zm2 0h6V6a3 3 0 0 0-6 0zM5.7 9l.9 10h10.8l.9-10z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zm2 2.4V17h14V7.4l-7 5.2zM6.9 7l5.1 3.8L17.1 7z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.4V14h2.7v8z"/></svg>',
  camion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h13v3h4l3 4v5h-2.2a2.8 2.8 0 0 1-5.6 0H9.8a2.8 2.8 0 0 1-5.6 0H2zm2 2v8h.7a2.8 2.8 0 0 1 4.6 0H13V8zm11 3v3.2a2.8 2.8 0 0 1 4.3 1.8h.7v-2.3L18 11zM7 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>',
  cadeau: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2a3 3 0 0 1 3 1.8A3 3 0 1 1 17.2 7H21v5h-1v10H4V12H3V7h3.8A3 3 0 0 1 9 2zm2 7H5v1h6zm2 0v1h6V9zm-2 3H6v8h5zm2 0v8h5v-8zM9 4a1 1 0 0 0 0 2h2a2 2 0 0 0-2-2zm6 0a2 2 0 0 0-2 2h2a1 1 0 0 0 0-2z"/></svg>',
  photo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l1.5 2.5H22V20H2V6.5h4.5zm4 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>',
};

/* Les produits qu'on peut acheter tout de suite : prix relevés sur sa boutique. */
const COLORIS = [['blanc', 'Blanc', '#f6f4f0'], ['gris', 'Gris', '#a9abae'], ['noir', 'Noir', '#26262a'], ['rouge', 'Rouge', '#d7192d'], ['rose', 'Rose', '#ef6fa0'], ['ciel', 'Bleu ciel', '#27a3dc'], ['marine', 'Bleu marine', '#1f2c5c'], ['vert', 'Vert', '#7cc34a'], ['jaune', 'Jaune', '#f4c430'], ['orange', 'Orange', '#ef7d22']];
const PRODUITS = [
  {
    id: 'mug', slug: 'mug-personnalise', nom: 'Mug personnalisé', court: 'Mugs', prix: 12, apercu: 'mug',
    h1: 'Le mug <em>avec votre photo</em>',
    titre: 'Mug personnalisé avec votre photo et votre texte',
    description: 'Mug céramique 325 ml personnalisé avec votre photo et votre texte, à partir de 12 €. Résiste au lave-vaisselle et au micro-ondes. Expédition sous 48 h.',
    texte: 'Votre photo et votre texte, ou un modèle à la demande : animaux, chanteurs, moto… Le cadeau qui fait toujours plaisir, et qu’on garde sur la table du petit déjeuner.',
    points: ['Céramique, 325 ml', 'Surface personnalisable : 20 × 9 cm', 'Résiste au lave-vaisselle et au micro-ondes', 'Plus de 400 modèles disponibles : renseignez-vous'],
    champs: { texte: 'Votre texte ou prénom', photo: true }, exemple: 'Mamie',
  },
  {
    id: 'tshirt', slug: 't-shirt-enfant-personnalise', nom: 'T-shirt enfant personnalisé', court: 'T-shirts', prix: 15, apercu: 'tshirt',
    h1: 'Le t-shirt <em>à son prénom</em>',
    titre: 'T-shirt enfant personnalisé, motif et prénom au choix',
    description: 'T-shirt enfant personnalisé à 15 € : un motif et son prénom au choix, ou votre propre photo. Aspect et toucher coton, 140 g. Expédition sous 48 h.',
    texte: 'Un motif et son prénom, ou votre propre photo : le t-shirt qu’il sera le seul à avoir. D’autres modèles sont disponibles, et la réalisation à la demande est possible.',
    points: ['100 % polyester micro respirant', 'Aspect et toucher coton, 140 g', 'Motif et prénom au choix', 'Ou réalisé avec votre photo et votre texte'],
    champs: { texte: 'Prénom à inscrire', photo: true, theme: ['Animaux', 'Humour', 'Transports', 'Sports', 'Divers', 'Ma photo'], taille: true }, exemple: 'Léo',
  },
  {
    id: 'serviette', slug: 'serviette-brodee', nom: 'Serviette brodée', court: 'Serviettes brodées', prix: 25, apercu: 'serviette',
    h1: 'La serviette <em>brodée à son nom</em>',
    titre: 'Serviette brodée avec votre prénom ou votre texte',
    description: 'Serviette brodée avec votre prénom ou votre texte : 2 tailles (50 × 90 cm à 25 €, 70 × 135 cm à 35 €) et 10 coloris au choix. Expédition sous 48 h.',
    texte: 'Une vraie broderie, votre prénom ou votre texte, sur la serviette de la couleur que vous choisissez. Pour la piscine, le sport, ou un cadeau de naissance.',
    points: ['Brodée avec votre prénom ou votre texte', '2 tailles au choix', '10 coloris au choix'],
    champs: { texte: 'Prénom ou texte à broder', coloris: true, variantes: [['50 × 90 cm', 25], ['70 × 135 cm', 35]] }, exemple: 'Emma',
  },
];
/* Annoncés sur sa boutique, sans prix affiché ou en rupture : prix sur demande. */
const SUR_DEMANDE = [
  { nom: 'Housses de coussin', photo: 'coussins', alt: 'Coussins sur un canapé', texte: 'Motif et prénom au choix, ou votre photo.' },
  { nom: 'Gravure sur miroir', photo: 'miroir-led', alt: 'Miroir rond à cadre lumineux', texte: 'Dont le miroir à cadre LED gravé.' },
  { nom: 'Gravure sur verre', photo: 'gravure-verres', alt: 'Chopes en verre gravées', texte: 'Verres et chopes, un prénom ou un message.' },
  { nom: 'Gravure sur bois', photo: 'gravure-bois', alt: 'Décorations en bois gravées', texte: 'Plaques, étiquettes et décorations.' },
  { nom: 'Pendentifs gravés', photo: 'pendentif', alt: 'Pendentif rectangulaire doré', texte: 'Un prénom ou une date, à garder sur soi.' },
  { nom: 'Boules de Noël', photo: 'boule-noel', alt: 'Boule de Noël gravée dans un sapin', texte: 'Personnalisées avec un prénom ou un motif.' },
];
const AUSSI = ['Plaque métal 15 × 20 cm', 'Doudou enfant brodé', 'Peignoir adulte brodé', 'Peignoir enfant brodé', 'T-shirt adulte personnalisé'];
const mailDemande = (quoi) => `mailto:${E.email}?subject=${encodeURIComponent('Demande de prix : ' + quoi)}`;

/* ---------------- donnees structurees ---------------- */
const ENTITE = {
  '@type': 'LocalBusiness',
  '@id': URL_SITE + '#entreprise',
  name: E.nom,
  description: 'Cadeaux personnalisés avec votre photo ou votre prénom : mugs, t-shirts, serviettes brodées, gravure. Expédition sous 48 h partout en France.',
  slogan: E.accroche,
  url: URL_SITE,
  logo: URL_SITE + 'photos/logo.webp',
  image: URL_SITE + 'photos/partage.jpg',
  telephone: E.tel,
  email: E.email,
  address: { '@type': 'PostalAddress', addressLocality: E.ville, postalCode: E.codePostal, addressRegion: 'Bretagne', addressCountry: 'FR' },
  areaServed: { '@type': 'Country', name: 'France' },
  sameAs: [E.facebook],
};
const schemaProduit = (p) => ({
  '@type': 'Product', name: p.nom, description: p.description, image: URL_SITE + 'photos/' + PHOTO_PRODUIT[p.id] + '-800.webp', brand: { '@type': 'Brand', name: E.nom },
  offers: { '@type': 'Offer', price: p.prix, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: abs(p.slug + '/') },
});
const PHOTO_PRODUIT = { mug: 'mug-fenetre', tshirt: 'tshirt-enfant', serviette: 'serviettes-brodees' };

/* ---------------- les apercus en direct ---------------- */
function apercu(r, type, exemple, { eager = false } = {}) {
  if (type === 'mug') return `<figure class="apercu apercu-mug" data-apercu="mug">
    ${img(r, 'mug-fenetre', 'Mug blanc posé près d’une fenêtre, avec votre personnalisation', { eager, sizes: '(min-width: 900px) 46vw, 100vw' })}
    <div class="zone"><img class="zone-photo" data-zone-photo alt="" hidden><span class="zone-texte" data-zone-texte>${esc(exemple)}</span></div>
  </figure>`;
  if (type === 'tshirt') return `<figure class="apercu apercu-tshirt" data-apercu="tshirt">
    ${img(r, 'tshirt-enfant', 'T-shirt blanc d’enfant posé à plat avec votre personnalisation', { eager, sizes: '(min-width: 900px) 46vw, 100vw' })}
    <div class="zone"><img class="zone-photo" data-zone-photo alt="" hidden><span class="zone-texte" data-zone-texte>${esc(exemple)}</span></div>
  </figure>`;
  return `<figure class="apercu apercu-serviette" data-apercu="serviette" data-coloris-cible>
    <div class="serviette"><div class="serviette-pli"></div><div class="serviette-face"><span class="zone-texte" data-zone-texte>${esc(exemple)}</span></div></div>
  </figure>`;
}

function reglages(p, { depuisAccueil = false } = {}) {
  const c = p.champs;
  return `<form class="reglages" data-produit data-id="${p.id}" data-nom="${esc(p.nom)}" data-prix="${p.prix}">
      ${c.variantes ? `<fieldset class="choix"><legend>La taille</legend>${c.variantes.map(([t, px], i) => `<label class="choix-ligne"><input type="radio" name="variante" value="${esc(t)}" data-prix="${px}"${i ? '' : ' checked'}><span>${esc(t)}</span><b>${prix(px)}</b></label>`).join('')}</fieldset>` : ''}
      <label class="champ"><span>${esc(c.texte)}</span><input type="text" name="texte" maxlength="24" value="${esc(p.exemple)}" autocomplete="off" spellcheck="false" data-champ-texte></label>
      ${c.photo ? `<label class="depot"><input type="file" name="photo" accept="image/*" data-champ-photo>${I.photo}<span data-depot-nom>Ajouter votre photo</span></label>` : ''}
      ${c.theme ? `<label class="champ"><span>Le motif</span><select name="theme">${c.theme.map((t) => `<option>${esc(t)}</option>`).join('')}</select></label>` : ''}
      ${c.taille ? `<label class="champ"><span>Âge ou taille</span><input type="text" name="taille" placeholder="ex. 6 ans" required></label>` : ''}
      ${c.coloris ? `<fieldset class="pastilles"><legend>Le coloris</legend>${COLORIS.map(([v, t, h], i) => `<label class="pastille" title="${t}"><input type="radio" name="coloris" value="${t}" data-couleur="${h}"${i === 5 ? ' checked' : ''}><span style="background:${h}"></span><i class="invisible">${t}</i></label>`).join('')}</fieldset>` : ''}
      ${depuisAccueil ? '' : `<fieldset class="pastilles ecritures"><legend>L’écriture</legend>
        <label class="pastille-texte"><input type="radio" name="ecriture" value="Manuscrite" checked><span class="e-main">Manuscrite</span></label>
        <label class="pastille-texte"><input type="radio" name="ecriture" value="Bâton"><span class="e-baton">Bâton</span></label>
      </fieldset>`}
      <div class="achat">
        <p class="achat-prix"><span data-prix-affiche>${prix(p.prix)}</span></p>
        <button class="bouton bouton-rouge" type="submit">${I.panier} Ajouter au panier</button>
      </div>
      <p class="note">L’aperçu vous donne l’idée du rendu.</p>
    </form>`;
}

/* ---------------- gabarit ---------------- */
const NAV = [['mug-personnalise/', 'Mugs'], ['t-shirt-enfant-personnalise/', 'T-shirts'], ['serviette-brodee/', 'Serviettes brodées'], ['gravure-et-objets/', 'Gravure et objets'], ['#contact', 'Contact']];

function page(chemin, { titre, description, corps, schemas = [], classe = '' }) {
  const r = '../'.repeat(chemin.split('/').filter(Boolean).length);
  const accueil = r || './';
  const lien = (h) => (h.startsWith('#') && chemin === '' ? h : accueil + h);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(description)}">
${PROD ? '' : '<meta name="robots" content="noindex,nofollow">\n'}<link rel="canonical" href="${abs(chemin)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(E.nom)}">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${URL_SITE}photos/partage.jpg">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23e30b2c'/%3E%3Ctext x='16' y='23' font-size='20' font-weight='700' text-anchor='middle' fill='%23fff' font-family='Arial'%3EG%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;600;700&family=Pacifico&family=Baloo+2:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/style.css?v=${V}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [ENTITE, ...schemas] })}</script>
</head>
<body class="${classe}">
<a class="evitement" href="#contenu">Aller au contenu</a>

<p class="bandeau">${I.camion} Expédition sous 48 h <span aria-hidden="true">·</span> ${I.cadeau} Livraison offerte dès 50 €</p>
<header class="entete">
  <div class="entete-in">
    <a class="marque" href="${accueil}" aria-label="${esc(E.nom)}, accueil"><img src="${r}photos/logo.webp" alt="${esc(E.nom)}, cadeaux et personnalisation" width="${PHOTOS.logo.l}" height="${PHOTOS.logo.h}"></a>
    <nav class="nav" aria-label="Navigation principale">
      ${NAV.map(([h, t]) => `<a href="${lien(h)}">${t}</a>`).join('\n      ')}
    </nav>
    <button class="bouton-panier" type="button" data-ouvrir-panier aria-label="Ouvrir le panier">${I.panier}<span class="compte" data-compte hidden>0</span></button>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Ouvrir le menu"><span></span><span></span></button>
  </div>
  <div class="menu-mobile" id="menu-mobile" hidden>
    ${NAV.map(([h, t]) => `<a href="${lien(h)}">${t}</a>`).join('\n    ')}
  </div>
</header>

<main id="contenu">
${corps(r, lien)}
</main>

<section class="contact" id="contact">
  <div class="cadre contact-in">
    <div>
      <h2>Une idée <em>qui n’est pas ici ?</em></h2>
      <p>Plus de 400 modèles et la réalisation à la demande : dites-moi ce que vous voulez personnaliser, je vous réponds avec le prix.</p>
    </div>
    <div class="contact-liens">
      <a href="tel:${E.tel}">${I.tel} ${E.telAffiche}</a>
      <a href="mailto:${E.email}">${I.mail} ${E.email}</a>
      <a href="${E.facebook}" target="_blank" rel="noopener">${I.fb} Gravophoto sur Facebook</a>
    </div>
  </div>
</section>

<footer class="pied">
  <div class="cadre pied-in">
    <span>© ${new Date().getFullYear()} ${esc(E.nom)} · ${esc(E.accroche)}</span>
    <span><a href="${r}cgv/">CGV</a> · <a href="${r}mentions-legales/">Mentions légales</a> · <a href="${r}confidentialite/">Confidentialité</a>${PROD ? ' · <a href="https://locweb.fr" target="_blank" rel="noopener">Site réalisé par LocWeb</a>' : ''}</span>
  </div>
</footer>

<div class="voile" data-voile hidden></div>
<aside class="tiroir" data-tiroir aria-label="Votre panier" aria-hidden="true" inert>
  <div class="tiroir-tete"><h2>Votre panier</h2><button type="button" class="fermer" data-fermer-panier aria-label="Fermer le panier">×</button></div>
  <div class="tiroir-corps" data-lignes></div>
  <div class="tiroir-pied">
    <div class="seuil" data-seuil><p data-seuil-texte></p><div class="seuil-barre"><span data-seuil-barre></span></div></div>
    <p class="total"><span>Total</span><b data-total>0 €</b></p>
    <button class="bouton bouton-rouge" type="button" data-payer>Payer par carte</button>
    <p class="note" data-note-paiement hidden>Ceci est un aperçu : le paiement par carte sera branché à la mise en ligne, rien n’est débité ni envoyé.</p>
  </div>
</aside>

<script>
  window.LOCWEB_CONFIG = {
    supabaseUrl: 'https://ibqawtgnucakzdldnitj.supabase.co',
    supabaseAnonKey: 'sb_publishable_rpLrUo4Cqnfl8zSohDqO0A_Q5Vkj2Hk',
    clientId: '',
    ga4Id: ''
  };
</script>
<script src="${r}mesure.js" defer></script>
<script src="${r}assets/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

/* ===================================================================
   PAGES
   =================================================================== */
const PAGES = [];
const ajouter = (ch, o) => PAGES.push([ch, o]);
const mug = PRODUITS[0];

ajouter('', {
  titre: 'Gravophoto — Mugs, t-shirts et cadeaux personnalisés avec votre photo',
  description: 'Mugs, t-shirts, serviettes brodées et gravure : vos cadeaux personnalisés avec votre photo ou votre prénom. Expédition sous 48 h, livraison offerte dès 50 €.',
  schemas: [{ '@type': 'WebSite', url: URL_SITE, name: E.nom, inLanguage: 'fr-FR' }],
  classe: 'accueil',
  corps: (r, lien) => `
<section class="hero">
  <div class="cadre hero-in">
    <div class="hero-texte">
      <p class="surtitre">${esc(E.devise)}</p>
      <h1>Tapez un prénom.<br><em>Il est déjà sur le mug.</em></h1>
      <p class="chapo">Essayez, c’est en direct. Mugs, t-shirts, serviettes brodées, gravure : votre photo ou votre texte sur un vrai cadeau, expédié sous 48 h.</p>
      ${reglages(mug, { depuisAccueil: true })}
    </div>
    ${apercu(r, 'mug', mug.exemple, { eager: true })}
  </div>
</section>

<section class="section" id="rayons">
  <div class="cadre">
    <h2>Que voulez-vous <em>personnaliser ?</em></h2>
    <div class="rayons">
      ${PRODUITS.map((p) => `<a class="rayon" href="${p.slug}/"><figure>${img(r, PHOTO_PRODUIT[p.id], p.nom)}</figure><span class="rayon-nom">${esc(p.court)}</span><span class="rayon-prix">dès ${prix(p.prix)}</span></a>`).join('\n      ')}
      <a class="rayon" href="gravure-et-objets/"><figure>${img(r, 'gravure-verres', 'Chopes en verre gravées')}</figure><span class="rayon-nom">Gravure</span><span class="rayon-prix">sur demande</span></a>
      <a class="rayon" href="gravure-et-objets/"><figure>${img(r, 'coussins', 'Coussins sur un canapé')}</figure><span class="rayon-nom">Housses de coussin</span><span class="rayon-prix">sur demande</span></a>
      <a class="rayon" href="gravure-et-objets/"><figure>${img(r, 'boule-noel', 'Boule de Noël gravée dans un sapin')}</figure><span class="rayon-nom">Boules de Noël</span><span class="rayon-prix">sur demande</span></a>
    </div>
  </div>
</section>

<section class="section section-gris">
  <div class="cadre etapes-bloc">
    <figure class="etapes-photo">${img(r, 'cadeau-mains', 'Mains tendant un cadeau emballé', { sizes: '(min-width: 900px) 40vw, 100vw' })}</figure>
    <div>
      <h2>Trois gestes, <em>et c’est parti</em></h2>
      <ol class="etapes">
        <li><b>Vous personnalisez</b><span>Votre photo, un prénom, un texte : vous voyez le résultat tout de suite.</span></li>
        <li><b>Vous payez en ligne</b><span>Par carte, en toute sécurité. La livraison est offerte dès 50 €.</span></li>
        <li><b>Je prépare, j’expédie</b><span>Votre cadeau part sous 48 h.</span></li>
      </ol>
    </div>
  </div>
</section>`,
});

for (const p of PRODUITS) {
  ajouter(p.slug + '/', {
    titre: `${p.titre} — Gravophoto`,
    description: p.description,
    schemas: [schemaProduit(p)],
    classe: 'fiche',
    corps: (r) => `
<section class="section section-fiche">
  <div class="cadre fiche-in">
    ${apercu(r, p.apercu, p.exemple, { eager: p.apercu !== 'serviette' })}
    <div class="fiche-texte">
      <h1>${p.h1}</h1>
      <p class="chapo">${esc(p.texte)}</p>
      ${reglages(p)}
      <ul class="points">${p.points.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </div>
  </div>
</section>`,
  });
}

ajouter('gravure-et-objets/', {
  titre: 'Gravure, coussins et objets personnalisés — Gravophoto',
  description: 'Gravure sur verre, miroir, bois et pendentifs, housses de coussin, boules de Noël personnalisées : demandez votre prix à Gravophoto.',
  corps: (r) => `
<section class="section section-fiche">
  <div class="cadre">
    <h1>Gravure <em>et objets personnalisés</em></h1>
    <p class="chapo">Chaque pièce se prépare à la demande : dites-moi ce que vous voulez graver ou personnaliser, je vous réponds avec le prix.</p>
    <div class="objets">
      ${SUR_DEMANDE.map((o) => `<article class="objet"><figure>${img(r, o.photo, o.alt)}</figure><h2>${esc(o.nom)}</h2><p>${esc(o.texte)}</p><a class="bouton bouton-ligne" href="${mailDemande(o.nom)}">Demander le prix</a></article>`).join('\n      ')}
    </div>
    <div class="aussi">
      <h2>Et aussi</h2>
      <div class="aussi-liste">${AUSSI.map((t) => `<a href="${mailDemande(t)}">${esc(t)}</a>`).join('')}</div>
    </div>
  </div>
</section>`,
});

const pageTexte = (ch, titre, description, html) => ajouter(ch, { titre: `${titre} — Gravophoto`, description, corps: () => `<section class="section"><div class="cadre etroit texte-riche"><h1>${titre}</h1>${html}</div></section>` });
pageTexte('cgv/', 'Conditions générales de vente', 'Conditions générales de vente de Gravophoto.', `
  <p><em>Trame d’aperçu, à valider avec ${E.dirigeant} avant la mise en ligne.</em></p>
  <h2>Prix et paiement</h2><p>Les prix sont indiqués en euros. Le paiement se fait par carte bancaire à la commande.</p>
  <h2>Expédition</h2><p>Les commandes sont expédiées sous 48 h. La livraison est offerte dès 50 € d’achat.</p>
  <h2>Droit de rétractation</h2><p>Les articles personnalisés sont fabriqués selon vos indications : ils ne bénéficient pas du droit de rétractation (article L221-28 du Code de la consommation).</p>
  <h2>Vos photos et vos textes</h2><p>Vous garantissez disposer des droits sur les photos et motifs que vous envoyez. Les personnages et les marques protégés ne peuvent pas être reproduits sans autorisation.</p>`);
pageTexte('mentions-legales/', 'Mentions légales', 'Mentions légales du site Gravophoto.', `
  <h2>Éditeur du site</h2><p>${E.dirigeant}, nom commercial « ${E.nom} »<br>SIRET : ${E.siret}<br>${E.telAffiche} · ${E.email}</p>
  <p>Directeur de la publication : ${E.dirigeant}</p>
  <h2>Hébergement</h2><p>[À compléter à la mise en ligne]</p>
  <h2>Crédits</h2><p>Photographies : Unsplash, en attendant les photos des créations. Réalisation : LocWeb.</p>`);
pageTexte('confidentialite/', 'Politique de confidentialité', 'Comment Gravophoto traite vos données.', `
  <h2>Vos commandes</h2><p>Vos coordonnées, vos textes et vos photos servent uniquement à préparer et expédier votre commande. Aucune donnée n’est vendue ni cédée.</p>
  <h2>Mesure d’audience</h2><p>Le site utilise Google Analytics pour mesurer sa fréquentation de façon anonymisée.</p>
  <h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données à ${E.email}.</p>`);

for (const [ch, o] of PAGES) {
  fs.mkdirSync(path.join(ICI, ch), { recursive: true });
  fs.writeFileSync(path.join(ICI, ch, 'index.html'), page(ch, o));
}
fs.writeFileSync(path.join(ICI, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.filter(([c]) => !/legales|confidentialite|cgv/.test(c)).map(([c]) => `  <url><loc>${abs(c)}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ICI, 'robots.txt'), PROD ? `User-agent: *\nAllow: /\n\nSitemap: ${URL_SITE}sitemap.xml\n` : `# Apercu : pas d'indexation avant la mise en ligne.\nUser-agent: *\nDisallow: /\n`);
fs.writeFileSync(path.join(ICI, '.nojekyll'), '');
console.log(`${PAGES.length} pages — ${PROD ? 'PRODUCTION' : 'apercu (noindex)'}`);
