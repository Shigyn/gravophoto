// Gravophoto : carrousel, recherche, apercu en direct, panier et favoris.
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var euros = function (n) { return n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0 }) + ' €'; };
  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var racine = document.body.getAttribute('data-racine') || './';
  // La memoire peut etre refusee (navigation privee) : tout marche quand meme le temps de la page.
  var lire = function (k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  var garder = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sans memoire */ } };

  // Sur telephone, le menu defile : la rubrique ouverte reste en vue.
  var actif = $('.nav a.actif');
  if (actif) actif.parentNode.scrollLeft = Math.max(0, actif.offsetLeft - 16);

  /* ---------- le carrousel de l'accueil ---------- */
  var car = $('[data-carrousel]');
  if (car) {
    var diapos = car.querySelectorAll('.diapo'), points = car.querySelectorAll('[data-aller]'), i = 0, minuterie = null;
    var aller = function (j) {
      i = (j + diapos.length) % diapos.length;
      diapos.forEach(function (d, k) { d.classList.toggle('active', k === i); if (k === i) d.removeAttribute('inert'); else d.setAttribute('inert', ''); });
      points.forEach(function (p, k) { if (k === i) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current'); });
    };
    var lancer = function () { if (calme) return; clearInterval(minuterie); minuterie = setInterval(function () { aller(i + 1); }, 6500); };
    $('[data-prec]', car).addEventListener('click', function () { aller(i - 1); lancer(); });
    $('[data-suiv]', car).addEventListener('click', function () { aller(i + 1); lancer(); });
    points.forEach(function (p) { p.addEventListener('click', function () { aller(Number(p.getAttribute('data-aller'))); lancer(); }); });
    car.addEventListener('mouseenter', function () { clearInterval(minuterie); });
    car.addEventListener('mouseleave', lancer);
    car.addEventListener('focusin', function () { clearInterval(minuterie); });
    var x0 = null;
    car.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    car.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { aller(i + (dx < 0 ? 1 : -1)); lancer(); }
    }, { passive: true });
    lancer();
  }

  /* ---------- la recherche ---------- */
  var sans = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var index = [];
  try { index = JSON.parse($('#index-recherche').textContent); } catch (e) { index = []; }
  var rech = $('[data-recherche]');
  if (rech) {
    var champ = rech.q, liste = $('[data-resultats]', rech);
    var trouver = function () {
      var mots = sans(champ.value).split(/\s+/).filter(Boolean);
      if (!mots.length) return [];
      return index.filter(function (x) { var t = sans(x.t + ' ' + x.k); return mots.every(function (m) { return t.indexOf(m) >= 0; }); }).slice(0, 6);
    };
    var montrer = function () {
      var res = trouver();
      if (!champ.value.trim()) { liste.hidden = true; return; }
      liste.innerHTML = res.length ? res.map(function (x) { return '<li><a href="' + esc(racine + x.u) + '">' + esc(x.t) + '</a></li>'; }).join('')
        : '<li class="aucun">Rien trouvé : <a href="' + esc(racine) + '#contact">demandez-moi</a>, je réalise aussi à la demande.</li>';
      liste.hidden = false;
    };
    champ.addEventListener('input', montrer);
    champ.addEventListener('focus', montrer);
    document.addEventListener('click', function (e) { if (!rech.contains(e.target)) liste.hidden = true; });
    rech.addEventListener('keydown', function (e) { if (e.key === 'Escape') liste.hidden = true; });
    rech.addEventListener('submit', function (e) {
      e.preventDefault();
      var res = trouver();
      if (res.length) location.href = racine + res[0].u; else montrer();
    });
  }

  /* ---------- l'apercu en direct ---------- */
  var form = $('[data-produit]');
  var apercu = $('[data-apercu]');
  var vignette = '';
  if (form && apercu) {
    var zoneTexte = $('[data-zone-texte]', apercu);
    var zonePhoto = $('[data-zone-photo]', apercu);
    var zoneMotif = $('[data-zone-motif]', apercu);
    var champTexte = $('[data-champ-texte]', form);
    var champPhoto = $('[data-champ-photo]', form);
    var prixAffiche = $('[data-prix-affiche]');
    var qte = form.qte;

    // Venu d'une idee cadeau : le texte est deja propose.
    var propose = new URLSearchParams(location.search).get('texte');
    if (propose) champTexte.value = propose.slice(0, Number(champTexte.getAttribute('maxlength')) || 24);

    var majTexte = function () {
      zoneTexte.textContent = champTexte.value.trim();
      zoneTexte.style.fontSize = '';
      // Un texte long reste dans la zone imprimable.
      var cadre = zoneTexte.parentNode.clientWidth * 0.94;
      var taille = parseFloat(getComputedStyle(zoneTexte).fontSize);
      while (zoneTexte.scrollWidth > cadre && taille > 9) { taille -= 1; zoneTexte.style.fontSize = taille + 'px'; }
    };
    var maj = function () {
      var f = new FormData(form);
      if (f.get('ecriture')) apercu.setAttribute('data-ecriture', f.get('ecriture') === 'Bâton' ? 'baton' : 'main');
      var coul = $('input[name="coloris"]:checked', form);
      if (coul) { apercu.style.setProperty('--tissu', coul.getAttribute('data-couleur')); apercu.toggleAttribute('data-sombre', coul.getAttribute('data-sombre') === '1'); }
      var motif = $('input[name="motif"]:checked', form);
      if (motif && zoneMotif) {
        var src = motif.parentNode.querySelector('svg');
        zoneMotif.innerHTML = src ? src.outerHTML : '';
      }
      var varia = $('input[name="variante"]:checked', form);
      if (varia) { form.setAttribute('data-prix', varia.getAttribute('data-prix')); prixAffiche.textContent = euros(Number(varia.getAttribute('data-prix'))); }
      majTexte();
    };
    form.addEventListener('input', maj);
    form.addEventListener('change', maj);
    window.addEventListener('resize', majTexte);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(majTexte);
    maj();

    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-qte]');
      if (!b) return;
      qte.value = Math.min(50, Math.max(1, (Number(qte.value) || 1) + Number(b.getAttribute('data-qte'))));
    });

    if (champPhoto) {
      champPhoto.addEventListener('change', function () {
        var fichier = champPhoto.files[0];
        if (!fichier) return;
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
        zonePhoto.src = URL.createObjectURL(fichier);
        $('[data-depot-nom]', form).textContent = fichier.name;
        // Sur le t-shirt, l'image importee remplace le motif.
        form.querySelectorAll('input[name="motif"]').forEach(function (m) { m.checked = false; });
        if (zoneMotif) zoneMotif.innerHTML = '';
        champPhoto.closest('label').classList.add('choisi');
      });
      form.addEventListener('change', function (e) {
        if (e.target.name !== 'motif') return;
        zonePhoto.hidden = true; apercu.removeAttribute('data-avec-photo');
        champPhoto.closest('label').classList.remove('choisi');
        champPhoto.value = ''; vignette = '';
        if (form.getAttribute('data-id') === 'tshirt') $('[data-depot-nom]', form).textContent = 'Importer mon image';
        maj();
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var details = [];
      ['variante', 'coloris', 'taille', 'motif'].forEach(function (cle) { if (f.get(cle)) details.push(f.get(cle)); });
      if (f.get('texte')) details.push('« ' + f.get('texte').trim() + ' »');
      if (f.get('ecriture')) details.push('écriture ' + f.get('ecriture').toLowerCase());
      if (champPhoto && champPhoto.files[0]) details.push('avec votre image');
      ajouterPanier({
        id: form.getAttribute('data-id'),
        nom: form.getAttribute('data-nom'),
        prix: Number(form.getAttribute('data-prix')),
        details: details.join(', '),
        vignette: vignette,
        qte: Math.max(1, Number(qte.value) || 1),
      });
    });
  }

  /* ---------- les tiroirs (panier, favoris) ---------- */
  var voile = $('[data-voile]');
  var ouvert = null;
  var ouvrir = function (nom) {
    fermer();
    ouvert = $('[data-tiroir="' + nom + '"]');
    voile.hidden = false;
    ouvert.setAttribute('data-ouvert', '');
    ouvert.setAttribute('aria-hidden', 'false');
    ouvert.inert = false;
    document.documentElement.style.overflow = 'hidden';
    $('[data-fermer]', ouvert).focus();
  };
  function fermer() {
    if (!ouvert) return;
    voile.hidden = true;
    ouvert.removeAttribute('data-ouvert');
    ouvert.setAttribute('aria-hidden', 'true');
    ouvert.inert = true;
    ouvert = null;
    document.documentElement.style.overflow = '';
  }
  document.querySelectorAll('[data-ouvrir]').forEach(function (b) { b.addEventListener('click', function () { ouvrir(b.getAttribute('data-ouvrir')); }); });
  document.querySelectorAll('[data-fermer]').forEach(function (b) { b.addEventListener('click', fermer); });
  voile.addEventListener('click', fermer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });

  /* ---------- le panier ---------- */
  var CLE = 'gravophoto_panier', SEUIL = 50;
  var lignes = lire(CLE);
  var tiroir = $('[data-tiroir="panier"]');
  var total = function () { return lignes.reduce(function (s, l) { return s + l.prix * l.qte; }, 0); };
  var afficherPanier = function () {
    var nb = lignes.reduce(function (s, l) { return s + l.qte; }, 0);
    $('[data-compte-panier]').textContent = nb;
    $('[data-lignes]', tiroir).innerHTML = lignes.length ? lignes.map(function (l, i) {
      return '<div class="ligne">' +
        (l.vignette ? '<img src="' + l.vignette + '" alt="" width="56" height="56">' : '') +
        '<div class="ligne-texte"><b>' + esc(l.nom) + '</b><span>' + esc(l.details) + '</span>' +
        '<div class="ligne-qte"><button type="button" data-moins="' + i + '" aria-label="Retirer un exemplaire">−</button><span>' + l.qte + '</span><button type="button" data-plus="' + i + '" aria-label="Ajouter un exemplaire">+</button></div></div>' +
        '<b class="ligne-prix">' + euros(l.prix * l.qte) + '</b></div>';
    }).join('') : '<p class="vide">Votre panier est vide.</p>';
    var t = total();
    $('[data-total]', tiroir).textContent = euros(t);
    $('[data-seuil-texte]', tiroir).textContent = t >= SEUIL ? 'Livraison offerte !' : 'Plus que ' + euros(SEUIL - t) + ' pour la livraison offerte';
    $('[data-seuil-barre]', tiroir).style.width = Math.min(100, t / SEUIL * 100) + '%';
    $('[data-payer]', tiroir).disabled = !lignes.length;
    $('[data-note-paiement]', tiroir).hidden = true;
  };
  function ajouterPanier(ligne) {
    var meme = lignes.filter(function (l) { return l.id === ligne.id && l.details === ligne.details; })[0];
    if (meme) meme.qte += ligne.qte; else lignes.push(ligne);
    garder(CLE, lignes);
    afficherPanier();
    ouvrir('panier');
  }
  tiroir.addEventListener('click', function (e) {
    var plus = e.target.closest('[data-plus]'), moins = e.target.closest('[data-moins]');
    if (plus) lignes[Number(plus.getAttribute('data-plus'))].qte += 1;
    if (moins) {
      var i = Number(moins.getAttribute('data-moins'));
      lignes[i].qte -= 1;
      if (!lignes[i].qte) lignes.splice(i, 1);
    }
    if (plus || moins) { garder(CLE, lignes); afficherPanier(); }
    if (e.target.closest('[data-payer]')) $('[data-note-paiement]', tiroir).hidden = false;
  });
  afficherPanier();

  /* ---------- les favoris ---------- */
  var CLE_F = 'gravophoto_favoris';
  var favoris = lire(CLE_F);
  var boiteF = $('[data-favoris]');
  var boutonF = $('[data-favori]');
  var afficherFavoris = function () {
    $('[data-compte-favoris]').textContent = favoris.length;
    boiteF.innerHTML = favoris.length ? favoris.map(function (f, i) {
      return '<div class="ligne"><div class="ligne-texte"><a href="' + esc(racine + f.url) + '"><b>' + esc(f.nom) + '</b></a><span>dès ' + euros(f.prix) + '</span></div><button type="button" class="retirer" data-retirer="' + i + '">Retirer</button></div>';
    }).join('') : '<p class="vide">Pas encore de favori : touchez « Ajouter aux favoris » sur un produit.</p>';
    if (boutonF && form) {
      var est = favoris.some(function (f) { return f.id === form.getAttribute('data-id'); });
      boutonF.setAttribute('aria-pressed', String(est));
      $('[data-favori-texte]', boutonF).textContent = est ? 'Dans vos favoris' : 'Ajouter aux favoris';
    }
  };
  boiteF.addEventListener('click', function (e) {
    var b = e.target.closest('[data-retirer]');
    if (!b) return;
    favoris.splice(Number(b.getAttribute('data-retirer')), 1);
    garder(CLE_F, favoris); afficherFavoris();
  });
  if (boutonF && form) boutonF.addEventListener('click', function () {
    var id = form.getAttribute('data-id');
    var deja = favoris.some(function (f) { return f.id === id; });
    favoris = deja ? favoris.filter(function (f) { return f.id !== id; }) : favoris.concat([{ id: id, nom: form.getAttribute('data-nom'), prix: Number(form.getAttribute('data-prix')), url: form.getAttribute('data-url') }]);
    garder(CLE_F, favoris); afficherFavoris();
  });
  afficherFavoris();

  /* ---------- la lettre d'information (apercu) ---------- */
  var lettre = $('[data-lettre]');
  if (lettre) lettre.addEventListener('submit', function (e) { e.preventDefault(); $('[data-lettre-note]', lettre).hidden = false; lettre.reset(); });
})();
