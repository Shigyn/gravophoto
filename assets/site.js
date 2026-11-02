// Gravophoto : menu telephone, apercu en direct, panier.
(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mobile');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var ouvert = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Ouvrir le menu' : 'Fermer le menu');
      menu.hidden = ouvert;
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) burger.click(); });
  }

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var euros = function (n) { return n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0 }) + ' €'; };

  /* L'apercu en direct : le texte, la photo, le coloris, l'ecriture. */
  var form = document.querySelector('[data-produit]');
  var apercu = document.querySelector('[data-apercu]');
  var vignette = '';
  if (form && apercu) {
    var zoneTexte = apercu.querySelector('[data-zone-texte]');
    var zonePhoto = apercu.querySelector('[data-zone-photo]');
    var champTexte = form.querySelector('[data-champ-texte]');
    var champPhoto = form.querySelector('[data-champ-photo]');
    var prixAffiche = form.querySelector('[data-prix-affiche]');

    var majTexte = function () {
      zoneTexte.textContent = champTexte.value.trim();
      zoneTexte.style.fontSize = '';
      // Un texte long reste dans la zone imprimable.
      var cadre = zoneTexte.parentNode.clientWidth * 0.92;
      var taille = parseFloat(getComputedStyle(zoneTexte).fontSize);
      while (zoneTexte.scrollWidth > cadre && taille > 10) {
        taille -= 1;
        zoneTexte.style.fontSize = taille + 'px';
      }
    };
    var maj = function () {
      var f = new FormData(form);
      if (f.get('ecriture')) apercu.setAttribute('data-ecriture', f.get('ecriture') === 'Bâton' ? 'baton' : 'main');
      var coul = form.querySelector('input[name="coloris"]:checked');
      if (coul) apercu.style.setProperty('--tissu', coul.getAttribute('data-couleur'));
      var varia = form.querySelector('input[name="variante"]:checked');
      if (varia) {
        form.setAttribute('data-prix', varia.getAttribute('data-prix'));
        prixAffiche.textContent = euros(Number(varia.getAttribute('data-prix')));
      }
      majTexte();
    };
    form.addEventListener('input', maj);
    form.addEventListener('change', maj);
    window.addEventListener('resize', majTexte);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(majTexte);
    maj();

    if (champPhoto) {
      champPhoto.addEventListener('change', function () {
        var fichier = champPhoto.files[0];
        if (!fichier) return;
        var url = URL.createObjectURL(fichier);
        zonePhoto.onload = function () {
          zonePhoto.hidden = false;
          apercu.setAttribute('data-avec-photo', '');
          majTexte();
          // Une petite vignette pour le panier, le fichier reste sur l'appareil.
          var c = document.createElement('canvas');
          c.width = c.height = 96;
          var cote = Math.min(zonePhoto.naturalWidth, zonePhoto.naturalHeight);
          c.getContext('2d').drawImage(zonePhoto, (zonePhoto.naturalWidth - cote) / 2, (zonePhoto.naturalHeight - cote) / 2, cote, cote, 0, 0, 96, 96);
          vignette = c.toDataURL('image/jpeg', 0.7);
        };
        zonePhoto.src = url;
        form.querySelector('[data-depot-nom]').textContent = fichier.name;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var details = [];
      ['variante', 'coloris', 'theme', 'taille'].forEach(function (cle) { if (f.get(cle)) details.push(f.get(cle)); });
      if (f.get('texte')) details.push('« ' + f.get('texte').trim() + ' »');
      if (f.get('ecriture')) details.push('écriture ' + f.get('ecriture').toLowerCase());
      if (champPhoto && champPhoto.files[0]) details.push('avec votre photo');
      ajouter({
        id: form.getAttribute('data-id'),
        nom: form.getAttribute('data-nom'),
        prix: Number(form.getAttribute('data-prix')),
        details: details.join(', '),
        vignette: vignette,
        qte: 1,
      });
    });
  }

  /* Le panier. La memoire peut etre refusee (navigation privee) : il marche quand meme le temps de la page. */
  var CLE = 'gravophoto_panier';
  var lignes = [];
  try { lignes = JSON.parse(localStorage.getItem(CLE)) || []; } catch (e) { lignes = []; }
  var tiroir = document.querySelector('[data-tiroir]');
  var voile = document.querySelector('[data-voile]');
  var SEUIL = 50;

  var total = function () { return lignes.reduce(function (s, l) { return s + l.prix * l.qte; }, 0); };
  var memoriser = function () {
    try { localStorage.setItem(CLE, JSON.stringify(lignes)); } catch (e) { /* sans memoire, le panier vit le temps de la page */ }
  };
  var afficher = function () {
    var nb = lignes.reduce(function (s, l) { return s + l.qte; }, 0);
    var compte = document.querySelector('[data-compte]');
    compte.textContent = nb;
    compte.hidden = !nb;
    var corps = tiroir.querySelector('[data-lignes]');
    corps.innerHTML = lignes.length ? lignes.map(function (l, i) {
      return '<div class="ligne">' +
        (l.vignette ? '<img src="' + l.vignette + '" alt="" width="56" height="56">' : '') +
        '<div class="ligne-texte"><b>' + esc(l.nom) + '</b><span>' + esc(l.details) + '</span>' +
        '<div class="ligne-qte"><button type="button" data-moins="' + i + '" aria-label="Retirer un exemplaire">−</button><span>' + l.qte + '</span><button type="button" data-plus="' + i + '" aria-label="Ajouter un exemplaire">+</button></div></div>' +
        '<b class="ligne-prix">' + euros(l.prix * l.qte) + '</b></div>';
    }).join('') : '<p class="vide">Votre panier est vide.</p>';
    var t = total();
    tiroir.querySelector('[data-total]').textContent = euros(t);
    tiroir.querySelector('[data-seuil-texte]').textContent = t >= SEUIL ? 'Livraison offerte !' : 'Plus que ' + euros(SEUIL - t) + ' pour la livraison offerte';
    tiroir.querySelector('[data-seuil-barre]').style.width = Math.min(100, t / SEUIL * 100) + '%';
    tiroir.querySelector('[data-payer]').disabled = !lignes.length;
    tiroir.querySelector('[data-note-paiement]').hidden = true;
  };
  var ouvrir = function () {
    voile.hidden = false;
    tiroir.setAttribute('data-ouvert', '');
    tiroir.setAttribute('aria-hidden', 'false');
    tiroir.inert = false;
    document.documentElement.style.overflow = 'hidden';
    tiroir.querySelector('[data-fermer-panier]').focus();
  };
  var fermer = function () {
    voile.hidden = true;
    tiroir.removeAttribute('data-ouvert');
    tiroir.setAttribute('aria-hidden', 'true');
    tiroir.inert = true;
    document.documentElement.style.overflow = '';
  };
  function ajouter(ligne) {
    var meme = lignes.filter(function (l) { return l.id === ligne.id && l.details === ligne.details; })[0];
    if (meme) meme.qte += 1; else lignes.push(ligne);
    memoriser();
    afficher();
    ouvrir();
  }

  document.querySelector('[data-ouvrir-panier]').addEventListener('click', ouvrir);
  tiroir.querySelector('[data-fermer-panier]').addEventListener('click', fermer);
  voile.addEventListener('click', fermer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && tiroir.hasAttribute('data-ouvert')) fermer(); });
  tiroir.addEventListener('click', function (e) {
    var plus = e.target.closest('[data-plus]');
    var moins = e.target.closest('[data-moins]');
    if (plus) lignes[Number(plus.getAttribute('data-plus'))].qte += 1;
    if (moins) {
      var i = Number(moins.getAttribute('data-moins'));
      lignes[i].qte -= 1;
      if (!lignes[i].qte) lignes.splice(i, 1);
    }
    if (plus || moins) { memoriser(); afficher(); }
    if (e.target.closest('[data-payer]')) tiroir.querySelector('[data-note-paiement]').hidden = false;
  });
  afficher();
})();
