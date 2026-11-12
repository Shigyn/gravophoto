// ===================================================================
//  Gravophoto — generateur du site (LocWeb, 2026-11-02, mise en page refaite le 2026-11-12)
//     node build.mjs          -> apercu (noindex)
//     PROD=1 node build.mjs   -> mise en ligne
//  Mise en page : d'apres les deux maquettes envoyees par Sebastien le 12/11 (en-tete noir
//  et rouge, grande image qui defile, categories en photos, idees cadeaux par occasion,
//  fiche produit « 1 Personnalisez / 2 Quantite »). Ses maquettes sont des images generees :
//  avis clients, prix et photos y sont inventes, on n'en reprend que la mise en page.
//  Prix et descriptions : sa boutique Wix. Telephone, e-mail : sa page Facebook.
//  Apercu : le panier et les favoris fonctionnent, le paiement Stripe n'est pas branche.
// ===================================================================
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');
const PROD = process.env.PROD === '1';
const URL_SITE = PROD ? 'https://www.gravophoto.com/' : 'https://shigyn.github.io/gravophoto/';
const PHOTOS = JSON.parse(fs.readFileSync(path.join(ICI, '_source', 'photos.json'), 'utf8'));
const V = '4';

const E = {
  nom: 'Gravophoto',
  devise: 'Cadeaux et personnalisation',
  accroche: 'Le spécialiste de la personnalisation d’objets',
  dirigeant: 'Sébastien Emery',
  siret: '451 487 136 00066',
  ville: 'Ambon',
  codePostal: '56190',
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

/* Icones au trait, comme sur ses maquettes. */
const T = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="ico"><path d="${d}"/></svg>`;
const I = {
  camion: T('M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'),
  bouclier: T('M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5'),
  etoile: T('M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'),
  casque: T('M4 15v-3a8 8 0 0 1 16 0v3M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1zM17 19c0 1.5-2 2-4 2'),
  loupe: T('M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20'),
  coeur: T('M12 20s-7-4.4-9-9A4.8 4.8 0 0 1 12 6.5 4.8 4.8 0 0 1 21 11c-2 4.6-9 9-9 9z'),
  panier: T('M3 4h2.5l2.2 10.5h10.6L20.5 7H6.3M9.5 20a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6zM17 20a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z'),
  maison: T('M3 11l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5'),
  cadeau: T('M3 8h18v4H3zM5 12v8h14v-8M12 8v12M12 8c-1.5-3-5-4-5-1.5S10 8 12 8zm0 0c1.5-3 5-4 5-1.5S14 8 12 8z'),
  eclat: T('M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3.5 3.5M15.5 15.5L19 19M19 5l-3.5 3.5M8.5 15.5L5 19'),
  broderie: T('M12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM12 3v3M9.5 10.5l5 5M14.5 10.5l-5 5'),
  tshirt: T('M8 3L3 6l2 4 2.5-1V21h9V9l2.5 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z'),
  mug: T('M5 6h11v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3zM16 9h2a2.5 2.5 0 0 1 0 5h-2'),
  mail: T('M3 5h18v14H3zM3 6l9 7 9-7'),
  diamant: T('M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l-2 6 5 12 5-12-2-6'),
  crayon: T('M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4'),
  carte: T('M3 6h18v12H3zM3 10h18M15 15h3'),
  pouce: T('M7 11v9H4v-9zM7 11l4-8c1.5 0 2.5 1 2.5 2.5V9h5.5a2 2 0 0 1 2 2.3l-1.2 6.5A2.5 2.5 0 0 1 17.3 20H7'),
  gateau: T('M4 21h16v-8H4zM4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 3 1 4 0M8 13V9M12 13V9M16 13V9M8 5.5v1M12 5.5v1M16 5.5v1'),
  personne: T('M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'),
  flocon: T('M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9 4l3 2 3-2M9 20l3-2 3 2'),
  alliances: T('M9 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM15 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10 6l2-2.5L14 6l-2 2z'),
  ourson: T('M12 21a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM6.6 9a2.6 2.6 0 1 1 3-3.4M17.4 9a2.6 2.6 0 1 0-3-3.4M10 13h.01M14 13h.01M11 16.5h2'),
  droite: T('M9 5l7 7-7 7'),
  gauche: T('M15 5l-7 7 7 7'),
  plus: T('M12 5v14M5 12h14'),
  moins: T('M5 12h14'),
  photo: T('M8 5h8l1.5 2.5H21V19H3V7.5h3.5zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'),
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-plein"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.4V14h2.7v8z"/></svg>',
};

/* Les motifs du t-shirt (en attendant ses vrais modeles : il en annonce plus de 400). */
const MOTIFS = [
  ['montagne', 'Montagne', '<path d="M4 86 L37 32 L50 52 L63 37 L96 86Z"/><circle cx="76" cy="20" r="9"/><path d="M14 86 L21 70 L18 70 L24 58 L21 58 L27 46 L33 58 L30 58 L36 70 L33 70 L40 86Z"/>'],
  ['coeur', 'Cœur', '<path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 20 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88Z"/>'],
  ['etoile', 'Étoile', '<polygon points="50,5 61,37 95,38 68,58 78,92 50,72 22,92 32,58 5,38 39,37"/>'],
  ['couronne', 'Couronne', '<path d="M10 72 L14 28 L33 48 L50 16 L67 48 L86 28 L90 72Z"/><rect x="10" y="78" width="80" height="11" rx="3"/>'],
  ['patte', 'Patte', '<ellipse cx="50" cy="67" rx="23" ry="19"/><circle cx="23" cy="40" r="10"/><circle cx="40" cy="22" r="10"/><circle cx="60" cy="22" r="10"/><circle cx="77" cy="40" r="10"/>'],
];
const motifSvg = (m) => `<svg viewBox="0 0 100 100" aria-hidden="true">${m[2]}</svg>`;
const COULEURS_TSHIRT = [['blanc', 'Blanc', '#f7f6f3', 0], ['noir', 'Noir', '#1d1d20', 1], ['marine', 'Bleu marine', '#1f2c5c', 1], ['gris', 'Gris chiné', '#b9bbbf', 0], ['rouge', 'Rouge', '#d7192d', 1], ['kaki', 'Vert kaki', '#6f7d3c', 1]];
const TAILLES_ENFANT = ['2 ans', '4 ans', '6 ans', '8 ans', '10 ans', '12 ans', '14 ans'];
const COLORIS = [['blanc', 'Blanc', '#f6f4f0'], ['gris', 'Gris', '#a9abae'], ['noir', 'Noir', '#26262a'], ['rouge', 'Rouge', '#d7192d'], ['rose', 'Rose', '#ef6fa0'], ['ciel', 'Bleu ciel', '#27a3dc'], ['marine', 'Bleu marine', '#1f2c5c'], ['vert', 'Vert', '#7cc34a'], ['jaune', 'Jaune', '#f4c430'], ['orange', 'Orange', '#ef7d22']];

/* Les produits qu'on peut acheter tout de suite : prix releves sur sa boutique. */
const PRODUITS = [
  {
    id: 'mug', slug: 'mug-personnalise', nom: 'Mug personnalisé', rayon: ['Cadeaux personnalisés', ''], prix: 12, apercu: 'mug', exemple: 'Mamie', max: 24,
    titre: 'Mug personnalisé avec votre photo et votre texte',
    description: 'Mug céramique 325 ml personnalisé avec votre photo et votre texte, à partir de 12 €. Résiste au lave-vaisselle et au micro-ondes. Expédition sous 48 h.',
    texte: 'Votre photo et votre texte, ou un modèle à la demande : animaux, chanteurs, moto… Le cadeau qui fait toujours plaisir.',
    points: [['Céramique 325 ml', 'Lave-vaisselle et micro-ondes'], ['Photo et texte', 'Zone imprimable 20 × 9 cm'], ['Plus de 400 modèles', 'Ou réalisé à la demande'], ['Expédition rapide', 'Sous 48 h']],
  },
  {
    id: 'tshirt', slug: 't-shirt-enfant-personnalise', nom: 'T-shirt enfant personnalisé', rayon: ['Textile personnalisé', 't-shirt-enfant-personnalise/'], prix: 15, apercu: 'tshirt', exemple: 'Léo', max: 15,
    titre: 'T-shirt enfant personnalisé, motif et prénom au choix',
    description: 'T-shirt enfant personnalisé à 15 € : un motif et son prénom au choix, ou votre propre image. Aspect et toucher coton, 140 g. Expédition sous 48 h.',
    texte: 'Un motif et son prénom, ou votre propre image : le t-shirt qu’il sera le seul à avoir.',
    points: [['Impression de qualité', 'Résistante et durable'], ['Tissu confortable', 'Aspect et toucher coton, 140 g'], ['Personnalisation unique', 'Texte, motif ou votre image'], ['Expédition rapide', 'Sous 48 h']],
  },
  {
    id: 'serviette', slug: 'serviette-brodee', nom: 'Serviette brodée', rayon: ['Broderie', 'serviette-brodee/'], prix: 25, apercu: 'serviette', exemple: 'Emma', max: 20,
    titre: 'Serviette brodée avec votre prénom ou votre texte',
    description: 'Serviette brodée avec votre prénom ou votre texte : 2 tailles (50 × 90 cm à 25 €, 70 × 135 cm à 35 €) et 10 coloris au choix. Expédition sous 48 h.',
    texte: 'Une vraie broderie, votre prénom ou votre texte, sur la serviette de la couleur que vous choisissez.',
    variantes: [['50 × 90 cm', 25], ['70 × 135 cm', 35]],
    points: [['Vraie broderie', 'Fil résistant au lavage'], ['2 tailles', '50 × 90 ou 70 × 135 cm'], ['10 coloris', 'Au choix'], ['Expédition rapide', 'Sous 48 h']],
  },
];
/* Annonces sur sa boutique ou sur ses maquettes, sans prix : prix sur demande. */
const SUR_DEMANDE = [
  { id: 'verres', nom: 'Verres gravés', photo: 'gravure-verres', alt: 'Chopes en verre gravées', texte: 'Verres et chopes, un prénom ou un message.' },
  { id: 'couteaux', nom: 'Couteaux gravés', photo: 'couteau', alt: 'Couteau pliant à manche en bois', texte: 'Un prénom, une date ou un motif sur la lame.' },
  { id: 'bois', nom: 'Gravure sur bois', photo: 'gravure-bois', alt: 'Décorations en bois gravées', texte: 'Plaques, étiquettes et décorations.' },
  { id: 'miroirs', nom: 'Cadres et miroirs', photo: 'miroir-led', alt: 'Miroir rond à cadre lumineux', texte: 'Dont le miroir à cadre LED gravé.' },
  { id: 'pendentifs', nom: 'Pendentifs gravés', photo: 'pendentif', alt: 'Pendentif rectangulaire doré', texte: 'Un prénom ou une date, à garder sur soi.' },
  { id: 'coussins', nom: 'Housses de coussin', photo: 'coussins', alt: 'Coussins sur un canapé', texte: 'Motif et prénom au choix, ou votre photo.' },
  { id: 'noel', nom: 'Boules de Noël', photo: 'boule-noel', alt: 'Boule de Noël gravée dans un sapin', texte: 'Personnalisées avec un prénom ou un motif.' },
];
const AUSSI = ['Plaque métal 15 × 20 cm', 'Doudou enfant brodé', 'Peignoir adulte brodé', 'Peignoir enfant brodé', 'T-shirt adulte personnalisé'];
const mailDemande = (quoi) => `mailto:${E.email}?subject=${encodeURIComponent('Demande de prix : ' + quoi)}`;

/* L'accueil, comme sur sa maquette. */
const CATEGORIES = [
  ['Mugs personnalisés', '', 'mug-fenetre', 'mug-personnalise/'],
  ['Verres gravés', '', 'gravure-verres', 'gravure-et-objets/#verres'],
  ['Couteaux gravés', '', 'couteau', 'gravure-et-objets/#couteaux'],
  ['Broderie', 'serviettes, peignoirs…', 'serviettes-brodees', 'serviette-brodee/'],
  ['Textile personnalisé', 't-shirts, coussins…', 'tshirt-enfant', 't-shirt-enfant-personnalise/'],
  ['Gravure sur bois', '', 'gravure-bois', 'gravure-et-objets/#bois'],
  ['Cadres miroirs', '', 'miroir-led', 'gravure-et-objets/#miroirs'],
];
// Chaque occasion ouvre un produit avec un texte deja propose.
const OCCASIONS = [
  ['Anniversaire', I.gateau, 'anniversaire', 'mug-personnalise/?texte=Joyeux+anniversaire'],
  ['Fête des mères', I.coeur, 'fleurs', 'mug-personnalise/?texte=Super+Maman'],
  ['Fête des pères', I.personne, 'cadeau-papa', 'mug-personnalise/?texte=Super+Papa'],
  ['Noël', I.flocon, 'boule-noel', 't-shirt-enfant-personnalise/?texte=Joyeux+No%C3%ABl'],
  ['Mariage', I.alliances, 'alliances', 'serviette-brodee/?texte=Mr+%26+Mme'],
  ['Naissance', I.ourson, 'ourson', 'serviette-brodee/?texte=Bienvenue+L%C3%A9o'],
];
const ATOUTS = [[I.diamant, 'Qualité', 'professionnelle'], [I.crayon, 'Personnalisation', 'sur mesure'], [I.camion, 'Expédition sous 48 h', 'et soignée'], [I.carte, 'Paiement 100 %', 'sécurisé'], [I.pouce, 'Idées cadeaux', 'pour toutes les occasions']];

/* La recherche : produits, categories et objets sur demande. */
const RECHERCHE = [
  ...PRODUITS.map((p) => ({ t: p.nom, u: p.slug + '/', k: p.description })),
  ...SUR_DEMANDE.map((o) => ({ t: o.nom, u: 'gravure-et-objets/#' + o.id, k: o.texte + ' gravure' })),
  ...AUSSI.map((a) => ({ t: a, u: 'gravure-et-objets/#aussi', k: 'broderie' })),
  ...OCCASIONS.map(([n, , , u]) => ({ t: 'Idée cadeau : ' + n, u, k: 'cadeau occasion' })),
];

/* ---------------- donnees structurees ---------------- */
const ENTITE = {
  '@type': 'LocalBusiness',
  '@id': URL_SITE + '#entreprise',
  name: E.nom,
  description: 'Cadeaux personnalisés avec votre photo ou votre prénom : mugs, t-shirts, broderie, gravure sur verre, bois, couteaux et miroirs. Expédition sous 48 h partout en France.',
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
const PHOTO_PRODUIT = { mug: 'mug-fenetre', tshirt: 'tshirt-enfant', serviette: 'serviettes-brodees' };
const schemaProduit = (p) => ({
  '@type': 'Product', name: p.nom, description: p.description, image: URL_SITE + 'photos/' + PHOTO_PRODUIT[p.id] + '-800.webp', brand: { '@type': 'Brand', name: E.nom },
  offers: { '@type': 'Offer', price: p.prix, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: abs(p.slug + '/') },
});

/* ---------------- les apercus en direct ---------------- */
function apercu(r, p) {
  const ruban = `<span class="ruban" aria-hidden="true">${esc(p.nom.replace(' enfant', ''))}</span>`;
  if (p.apercu === 'mug') return `<figure class="apercu apercu-mug" data-apercu="mug">${ruban}
    ${img(r, 'mug-fenetre', 'Mug blanc posé près d’une fenêtre, avec votre personnalisation', { eager: true, sizes: '(min-width: 900px) 46vw, 100vw' })}
    <div class="zone"><img class="zone-photo" data-zone-photo alt="" hidden><span class="zone-texte" data-zone-texte>${esc(p.exemple)}</span></div>
  </figure>`;
  // Le t-shirt est dessine : sa couleur change, le motif et le prenom s'impriment dessus.
  if (p.apercu === 'tshirt') return `<figure class="apercu apercu-tshirt" data-apercu="tshirt">${ruban}
    <svg class="tshirt" viewBox="0 0 400 440" role="img" aria-label="Aperçu du t-shirt personnalisé">
      <defs><linearGradient id="pli" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".18" stop-color="#000" stop-opacity="0"/><stop offset=".82" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs>
      <path class="tissu" d="M138 22 C156 46 244 46 262 22 L334 48 L392 124 L340 164 L308 138 L308 424 L92 424 L92 138 L60 164 L8 124 L66 48 Z"/>
      <path d="M138 22 C156 46 244 46 262 22 L334 48 L392 124 L340 164 L308 138 L308 424 L92 424 L92 138 L60 164 L8 124 L66 48 Z" fill="url(#pli)"/>
      <path class="col" d="M138 22 C154 58 246 58 262 22"/>
      <path class="couture" d="M92 138 L66 48 M308 138 L334 48"/>
    </svg>
    <div class="zone"><img class="zone-photo" data-zone-photo alt="" hidden><span class="zone-motif" data-zone-motif>${motifSvg(MOTIFS[0])}</span><span class="zone-texte" data-zone-texte>${esc(p.exemple)}</span></div>
  </figure>`;
  return `<figure class="apercu apercu-serviette" data-apercu="serviette">${ruban}
    <div class="serviette"><div class="serviette-pli"></div><div class="serviette-face"><span class="zone-texte" data-zone-texte>${esc(p.exemple)}</span></div></div>
  </figure>`;
}

function reglages(p) {
  const ecriture = `<fieldset class="groupe"><legend>L’écriture</legend><div class="boutons-choix">
        <label class="choix-bouton"><input type="radio" name="ecriture" value="Manuscrite" checked><span class="e-main">Manuscrite</span></label>
        <label class="choix-bouton"><input type="radio" name="ecriture" value="Bâton"><span class="e-baton">Bâton</span></label>
      </div></fieldset>`;
  const texte = `<label class="champ"><span>${p.id === 'serviette' ? 'Prénom ou texte à broder' : 'Ajoutez votre texte'}</span><span class="champ-ligne"><input type="text" name="texte" maxlength="${p.max}" value="${esc(p.exemple)}" autocomplete="off" spellcheck="false" data-champ-texte><small>${p.max} caractères max.</small></span></label>`;
  let corps = '';
  if (p.id === 'mug') corps = `${texte}
      <label class="depot"><input type="file" name="photo" accept="image/*" data-champ-photo>${I.photo}<span data-depot-nom>Ajouter votre photo (facultatif)</span></label>
      ${ecriture}`;
  if (p.id === 'tshirt') corps = `${texte}
      <fieldset class="groupe"><legend>Choisissez votre visuel</legend><div class="visuels">
        ${MOTIFS.map((m, i) => `<label class="visuel" title="${m[1]}"><input type="radio" name="motif" value="${m[1]}" data-motif="${m[0]}"${i ? '' : ' checked'}>${motifSvg(m)}<i class="invisible">${m[1]}</i></label>`).join('')}
        <label class="visuel visuel-import"><input type="file" name="photo" accept="image/*" data-champ-photo>${I.plus}<span data-depot-nom>Importer mon image</span></label>
      </div></fieldset>
      <div class="deux-col">
        <fieldset class="groupe"><legend>Couleur du t-shirt</legend><div class="pastilles">${COULEURS_TSHIRT.map(([v, t, h, sombre], i) => `<label class="pastille" title="${t}"><input type="radio" name="coloris" value="${t}" data-couleur="${h}" data-sombre="${sombre}"${i ? '' : ' checked'}><span style="background:${h}"></span><i class="invisible">${t}</i></label>`).join('')}</div></fieldset>
        <fieldset class="groupe"><legend>Taille</legend><div class="boutons-choix tailles">${TAILLES_ENFANT.map((t, i) => `<label class="choix-bouton"><input type="radio" name="taille" value="${t}"${i === 2 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>
      </div>
      ${ecriture}`;
  if (p.id === 'serviette') corps = `<fieldset class="groupe"><legend>Taille</legend><div class="boutons-choix">${p.variantes.map(([t, px], i) => `<label class="choix-bouton"><input type="radio" name="variante" value="${esc(t)}" data-prix="${px}"${i ? '' : ' checked'}><span>${esc(t)} <b>${prix(px)}</b></span></label>`).join('')}</div></fieldset>
      ${texte}
      <fieldset class="groupe"><legend>Coloris</legend><div class="pastilles">${COLORIS.map(([v, t, h], i) => `<label class="pastille" title="${t}"><input type="radio" name="coloris" value="${t}" data-couleur="${h}"${i === 5 ? ' checked' : ''}><span style="background:${h}"></span><i class="invisible">${t}</i></label>`).join('')}</div></fieldset>
      ${ecriture}`;
  return `<form class="reglages" data-produit data-id="${p.id}" data-nom="${esc(p.nom)}" data-prix="${p.prix}" data-url="${p.slug}/">
      <section class="etape">
        <h2><span class="num">1</span> Personnalisez votre ${esc(p.nom.split(' ')[0].toLowerCase())}</h2>
        ${corps}
      </section>
      <section class="etape etape-achat">
        <h2><span class="num">2</span> Ajoutez-le au panier</h2>
        <div class="achat">
          <div class="quantite"><span>Quantité</span><button type="button" data-qte="-1" aria-label="Un de moins">${I.moins}</button><input type="number" name="qte" value="1" min="1" max="50" inputmode="numeric" aria-label="Quantité"><button type="button" data-qte="1" aria-label="Un de plus">${I.plus}</button></div>
          <button class="bouton bouton-rouge" type="submit">${I.panier} Ajouter au panier</button>
          <button class="bouton bouton-ligne" type="button" data-favori aria-pressed="false">${I.coeur} <span data-favori-texte>Ajouter aux favoris</span></button>
        </div>
        <p class="note">L’aperçu vous donne l’idée du rendu : je vous contacte si un détail doit être ajusté.</p>
      </section>
    </form>`;
}

/* ---------------- gabarit ---------------- */
const NAV = [
  ['', 'Accueil', I.maison],
  ['#categories', 'Cadeaux personnalisés', I.cadeau],
  ['gravure-et-objets/', 'Gravure', I.eclat],
  ['serviette-brodee/', 'Broderie', I.broderie],
  ['t-shirt-enfant-personnalise/', 'Textile personnalisé', I.tshirt],
  ['mug-personnalise/', 'Mugs', I.mug],
  ['#contact', 'Contact', I.mail],
];

function page(chemin, { titre, description, corps, schemas = [], classe = '', actif = '' }) {
  const r = '../'.repeat(chemin.split('/').filter(Boolean).length);
  const accueil = r || './';
  const lien = (h) => (h === '' ? accueil : h.startsWith('#') && chemin === '' ? h : accueil + h);
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
<meta name="theme-color" content="#111113">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23e30b2c'/%3E%3Ctext x='16' y='23' font-size='20' font-weight='700' text-anchor='middle' fill='%23fff' font-family='Arial'%3EG%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Figtree:wght@400;600;700&family=Pacifico&family=Baloo+2:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/style.css?v=${V}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [ENTITE, ...schemas] })}</script>
</head>
<body class="${classe}" data-racine="${accueil}">
<a class="evitement" href="#contenu">Aller au contenu</a>

<div class="infos">
  <div class="cadre infos-in">
    <p class="info">${I.camion}<span><b>Expédition sous 48 h</b>partout en France</span></p>
    <p class="info">${I.bouclier}<span><b>Paiement 100 % sécurisé</b></span></p>
    <p class="info">${I.etoile}<span><b>Créations</b>personnalisées</span></p>
    <a class="info info-tel" href="tel:${E.tel}">${I.casque}<span>Service client<b>${E.telAffiche}</b></span></a>
  </div>
</div>
<header class="entete">
  <div class="cadre entete-in">
    <a class="marque" href="${accueil}" aria-label="${esc(E.nom)}, accueil"><img src="${r}photos/logo-blanc.webp" alt="${esc(E.nom)}" width="${PHOTOS['logo-blanc'].l}" height="${PHOTOS['logo-blanc'].h}"><span>Le spécialiste de la personnalisation</span></a>
    <form class="recherche" role="search" data-recherche>
      <input type="search" name="q" placeholder="Rechercher un produit, une idée cadeau…" aria-label="Rechercher un produit ou une idée cadeau" autocomplete="off">
      <button type="submit" aria-label="Rechercher">${I.loupe}</button>
      <ul class="resultats" data-resultats hidden></ul>
    </form>
    <div class="actions">
      <button type="button" class="action" data-ouvrir="favoris">${I.coeur}<span class="action-nom">Mes favoris</span><span class="compte" data-compte-favoris>0</span></button>
      <button type="button" class="action" data-ouvrir="panier">${I.panier}<span class="action-nom">Mon panier</span><span class="compte" data-compte-panier>0</span></button>
    </div>
  </div>
</header>
<nav class="nav" aria-label="Navigation principale">
  <div class="cadre nav-in">
    ${NAV.map(([h, t, ic]) => `<a href="${lien(h)}"${h === actif && !h.startsWith('#') ? ' class="actif" aria-current="page"' : ''}>${ic}${t}</a>`).join('\n    ')}
  </div>
</nav>

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
      <a href="tel:${E.tel}">${I.casque} ${E.telAffiche}</a>
      <a href="mailto:${E.email}">${I.mail} ${E.email}</a>
    </div>
  </div>
</section>

<section class="lettre">
  <div class="cadre lettre-in">
    <div class="lettre-titre">${I.mail}<p><b>Restez informé !</b>Nouveautés, promotions, idées cadeaux…</p></div>
    <form class="lettre-form" data-lettre>
      <input type="email" name="email" placeholder="Votre adresse e-mail" aria-label="Votre adresse e-mail" required autocomplete="email">
      <button type="submit">S’inscrire</button>
      <p class="lettre-note" data-lettre-note hidden>Merci ! Ceci est un aperçu : l’inscription sera branchée à la mise en ligne.</p>
    </form>
    <div class="reseaux"><p>Suivez-nous sur<b>les réseaux !</b></p><a href="${E.facebook}" target="_blank" rel="noopener" aria-label="Gravophoto sur Facebook">${I.fb}</a></div>
  </div>
</section>

<footer class="pied">
  <div class="cadre pied-in">
    <span>© ${new Date().getFullYear()} ${esc(E.nom)} · ${esc(E.accroche)}</span>
    <span><a href="${r}cgv/">CGV</a> · <a href="${r}mentions-legales/">Mentions légales</a> · <a href="${r}confidentialite/">Confidentialité</a>${PROD ? ' · <a href="https://locweb.fr" target="_blank" rel="noopener">Site réalisé par LocWeb</a>' : ''}</span>
  </div>
</footer>

<div class="voile" data-voile hidden></div>
<aside class="tiroir" data-tiroir="panier" aria-label="Votre panier" aria-hidden="true" inert>
  <div class="tiroir-tete"><h2>Votre panier</h2><button type="button" class="fermer" data-fermer aria-label="Fermer le panier">×</button></div>
  <div class="tiroir-corps" data-lignes></div>
  <div class="tiroir-pied">
    <div class="seuil"><p data-seuil-texte></p><div class="seuil-barre"><span data-seuil-barre></span></div></div>
    <p class="total"><span>Total</span><b data-total>0 €</b></p>
    <button class="bouton bouton-rouge" type="button" data-payer>Payer par carte</button>
    <p class="note" data-note-paiement hidden>Ceci est un aperçu : le paiement par carte sera branché à la mise en ligne, rien n’est débité ni envoyé.</p>
  </div>
</aside>
<aside class="tiroir" data-tiroir="favoris" aria-label="Vos favoris" aria-hidden="true" inert>
  <div class="tiroir-tete"><h2>Mes favoris</h2><button type="button" class="fermer" data-fermer aria-label="Fermer les favoris">×</button></div>
  <div class="tiroir-corps" data-favoris></div>
</aside>

<script type="application/json" id="index-recherche">${JSON.stringify(RECHERCHE).replace(/</g, '\\u003c')}</script>
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

const titreSection = (ic, t, id = '') => `<h2 class="titre-section"${id ? ` id="${id}"` : ''}><span class="trait" aria-hidden="true"></span>${ic}<span>${t}</span><span class="trait" aria-hidden="true"></span></h2>`;
const atouts = () => `<ul class="atouts">${ATOUTS.map(([ic, a, b]) => `<li>${ic}<span><b>${a}</b>${b}</span></li>`).join('')}</ul>`;

/* ===================================================================
   PAGES
   =================================================================== */
const PAGES = [];
const ajouter = (ch, o) => PAGES.push([ch, o]);

const DIAPOS = [
  { photo: 'fond-cadeaux', titre: 'Des cadeaux uniques,', em: 'à votre image !', texte: 'Gravure, broderie, impression et personnalisation pour toutes les occasions.', bouton: 'Je personnalise mon cadeau', lien: 'mug-personnalise/' },
  { photo: 'mug-fenetre', titre: 'Votre photo sur un mug,', em: 'dès 12 € !', texte: 'Votre photo et votre texte, vous voyez le résultat en direct avant de commander.', bouton: 'Je crée mon mug', lien: 'mug-personnalise/' },
  { photo: 'fond-noel', titre: 'Noël approche :', em: 'pensez personnalisé !', texte: 'Un prénom, une photo, un message : le cadeau qu’on ne trouve nulle part ailleurs.', bouton: 'Voir les idées cadeaux', lien: '#occasions' },
];

ajouter('', {
  titre: 'Gravophoto — Cadeaux personnalisés : gravure, broderie, mugs et t-shirts',
  description: 'Mugs, t-shirts, serviettes brodées, gravure sur verre, bois, couteaux et miroirs : vos cadeaux personnalisés avec votre photo ou votre prénom. Expédition sous 48 h.',
  schemas: [{ '@type': 'WebSite', url: URL_SITE, name: E.nom, inLanguage: 'fr-FR' }],
  classe: 'accueil',
  actif: '',
  corps: (r, lien) => `
<section class="carrousel" data-carrousel aria-roledescription="carrousel" aria-label="À la une">
  ${DIAPOS.map((d, i) => `<div class="diapo${i ? '' : ' active'}" aria-roledescription="diapositive" aria-label="${i + 1} sur ${DIAPOS.length}"${i ? ' inert' : ''}>
    ${img(r, d.photo, '', { eager: i === 0, sizes: '100vw', cls: 'diapo-fond' })}
    <div class="cadre diapo-texte">
      ${i ? '<p class="diapo-titre">' : '<h1 class="diapo-titre">'}${d.titre}<em>${d.em}<svg viewBox="0 0 300 18" aria-hidden="true"><path d="M4 14 Q 150 -2 296 10"/></svg></em>${i ? '</p>' : '</h1>'}
      <p class="diapo-chapo">${d.texte}</p>
      <a class="bouton bouton-rouge bouton-grand" href="${lien(d.lien)}">${I.crayon} ${d.bouton} ${I.droite}</a>
    </div>
  </div>`).join('\n  ')}
  <button type="button" class="fleche fleche-g" data-prec aria-label="Diapositive précédente">${I.gauche}</button>
  <button type="button" class="fleche fleche-d" data-suiv aria-label="Diapositive suivante">${I.droite}</button>
  <div class="points-diapo">${DIAPOS.map((_, i) => `<button type="button" data-aller="${i}" aria-label="Diapositive ${i + 1}"${i ? '' : ' aria-current="true"'}></button>`).join('')}</div>
</section>

<section class="section">
  <div class="cadre">
    ${titreSection(I.cadeau, 'Nos catégories de produits', 'categories')}
    <div class="categories">
      ${CATEGORIES.map(([n, sous, ph, u]) => `<a class="categorie" href="${lien(u)}"><figure>${img(r, ph, '', { sizes: '(min-width: 1100px) 15vw, 45vw' })}</figure><span class="categorie-nom"><span>${n}${sous ? `<small>(${sous})</small>` : ''}</span><i>${I.droite}</i></span></a>`).join('\n      ')}
    </div>
    ${atouts()}
  </div>
</section>

<section class="section section-occasions">
  <div class="cadre">
    ${titreSection(I.cadeau, 'Idées cadeaux par occasion', 'occasions')}
    <div class="occasions">
      ${OCCASIONS.map(([n, ic, ph, u]) => `<a class="occasion" href="${lien(u)}"><figure>${img(r, ph, '', { sizes: '(min-width: 1100px) 16vw, 45vw' })}</figure><span class="occasion-nom">${ic}${n}</span></a>`).join('\n      ')}
    </div>
  </div>
</section>`,
});

for (const p of PRODUITS) {
  ajouter(p.slug + '/', {
    titre: `${p.titre} — Gravophoto`,
    description: p.description,
    schemas: [schemaProduit(p), { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: URL_SITE }, { '@type': 'ListItem', position: 2, name: p.nom, item: abs(p.slug + '/') }] }],
    classe: 'fiche',
    actif: p.slug + '/',
    corps: (r, lien) => `
<div class="cadre">
  <nav class="fil" aria-label="Fil d’Ariane"><a href="${lien('')}">${I.maison}Accueil</a>${I.droite}<span>${esc(p.rayon[0])}</span>${I.droite}<span aria-current="page">${esc(p.nom)}</span></nav>
</div>
<section class="cadre fiche-in">
  <div class="fiche-visuel">${apercu(r, p)}</div>
  <div class="fiche-texte">
    <div class="fiche-tete">
      <div><h1>${esc(p.nom)}</h1><p class="chapo">${esc(p.texte)}</p></div>
      <p class="fiche-prix"><span data-prix-affiche>${prix(p.prix)}</span><small>TTC</small></p>
    </div>
    <div class="fiche-corps">
      ${reglages(p)}
      <ul class="garanties">${p.points.map(([a, b], i) => `<li>${[I.etoile, I.tshirt, I.crayon, I.camion][i]}<span><b>${esc(a)}</b>${esc(b)}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>
<div class="cadre">${atouts()}</div>`,
  });
}

ajouter('gravure-et-objets/', {
  titre: 'Gravure sur verre, bois, couteaux et miroirs, objets personnalisés — Gravophoto',
  description: 'Gravure sur verre, couteaux, bois, miroirs et pendentifs, housses de coussin, boules de Noël personnalisées : demandez votre prix à Gravophoto.',
  actif: 'gravure-et-objets/',
  corps: (r, lien) => `
<div class="cadre">
  <nav class="fil" aria-label="Fil d’Ariane"><a href="${lien('')}">${I.maison}Accueil</a>${I.droite}<span aria-current="page">Gravure et objets</span></nav>
</div>
<section class="section section-serree">
  <div class="cadre">
    <h1 class="titre-page">Gravure <em>et objets personnalisés</em></h1>
    <p class="chapo">Chaque pièce se prépare à la demande : dites-moi ce que vous voulez graver ou personnaliser, je vous réponds avec le prix.</p>
    <div class="objets">
      ${SUR_DEMANDE.map((o) => `<article class="objet" id="${o.id}"><figure>${img(r, o.photo, o.alt)}</figure><div class="objet-texte"><h2>${esc(o.nom)}</h2><p>${esc(o.texte)}</p><a class="bouton bouton-rouge" href="${mailDemande(o.nom)}">Demander le prix</a></div></article>`).join('\n      ')}
    </div>
    <div class="aussi" id="aussi">
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
