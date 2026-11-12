# Photos ajoutees le 2026-11-12 pour la mise en page voulue par Sebastien (ses deux maquettes) :
# categories (couteaux) et idees cadeaux par occasion, fonds de l'accueil, logo blanc pour l'en-tete noir.
# Unsplash (licence libre) avant paiement, comme toujours.
# Usage : python -I _source/photos2.py <dossier des photos Unsplash HD>
import os, sys, json
from PIL import Image, ImageOps

SRC = sys.argv[1]
ICI = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(ICI, '..', 'photos')

PHOTOS = {
    'couteau': '1613857099378-82352299b436',
    'anniversaire': '1607482369189-a53b6e71fa48',
    'fleurs': '1582794543139-8ac9cb0f7b11',
    'alliances': '1622398925373-3f91b1e275f5',
    'ourson': '1556012018-50c5c0da73bf',
    'cadeau-papa': '1635166304779-8ebcfe8e57bd',
    'fond-cadeaux': '1545608444-f045a6db6133',
    'fond-noel': '1575383359917-e585c563a8e3',
}
dims = json.load(open(os.path.join(ICI, 'photos.json')))
for nom, src in PHOTOS.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src + '.jpg'))).convert('RGB')
    for larg in (1600, 800):
        c = im if im.width <= larg else im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
        c.save(os.path.join(DST, f'{nom}-{larg}.webp'), 'WEBP', quality=78, method=6)
    big = Image.open(os.path.join(DST, f'{nom}-1600.webp'))
    dims[nom] = {'l': big.width, 'h': big.height}
    print(f'{nom:16s} {big.width}x{big.height}')

# Le logo en blanc (le noir devient blanc, le rouge reste) pour l'en-tete noir de la maquette.
lg = Image.open(os.path.join(DST, 'logo.webp')).convert('RGBA')
px = lg.load()
# Son logo a un fond blanc : le gris devient du blanc plus ou moins transparent, le rouge reste.
for y in range(lg.height):
    for x in range(lg.width):
        r, g, b, a = px[x, y]
        if r > 150 and max(r, g, b) - min(r, g, b) > 90:
            continue
        lum = (r + g + b) / 3
        px[x, y] = (255, 255, 255, int(a * (255 - lum) / 255))
lg.save(os.path.join(DST, 'logo-blanc.webp'), 'WEBP', quality=90, method=6)
dims['logo-blanc'] = {'l': lg.width, 'h': lg.height}
json.dump(dims, open(os.path.join(ICI, 'photos.json'), 'w'), indent=0)
