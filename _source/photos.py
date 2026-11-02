# Prepare les photos de l'apercu Gravophoto (LocWeb, 2026-11-02).
# Unsplash (licence libre), comme toujours avant paiement ; ses vraies photos
# prendront leur place a la mise en ligne.
# Usage : python -I _source/photos.py <dossier des photos Unsplash HD> <logo.png>
import os, sys, json
from PIL import Image, ImageOps

SRC, LOGO = sys.argv[1], sys.argv[2]
ICI = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(ICI, '..', 'photos')
os.makedirs(DST, exist_ok=True)

# nom : (id Unsplash, recadrage en fractions gauche, haut, droite, bas)
PHOTOS = {
    'mug-fenetre': ('1616241673111-508b4662c707', (.12, .18, .95, .90)),
    'tshirt-enfant': ('1622290291468-a28f7a7dc6a8', None),
    'serviettes-brodees': ('1766727923661-35e86cf71b46', None),
    'coussins': ('1553114552-c4ece3a33c93', None),
    'gravure-bois': ('1600181897467-dcdadfe88cd4', None),
    'gravure-verres': ('1730646121756-80c8704b170d', None),
    'miroir-led': ('1644916925115-97ef330ab793', None),
    'pendentif': ('1588575788949-dc6e8d9f76c9', None),
    'boule-noel': ('1576437681128-bef30e414bd1', None),
    'cadeau-mains': ('1512909006721-3d6018887383', None),
}

dims = {}
for nom, (src, cadre) in PHOTOS.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src + '.jpg'))).convert('RGB')
    if cadre:
        g, h, d, b = cadre
        im = im.crop((round(im.width * g), round(im.height * h), round(im.width * d), round(im.height * b)))
    for larg in (1600, 800):
        c = im if im.width <= larg else im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
        c.save(os.path.join(DST, f'{nom}-{larg}.webp'), 'WEBP', quality=78, method=6)
    big = Image.open(os.path.join(DST, f'{nom}-1600.webp'))
    dims[nom] = {'l': big.width, 'h': big.height}
    print(f'{nom:24s} {big.width}x{big.height}')

# Son logo, a la taille de l'en-tete.
lg = Image.open(LOGO).convert('RGBA')
lg = lg.resize((640, round(lg.height * 640 / lg.width)), Image.LANCZOS)
lg.save(os.path.join(DST, 'logo.webp'), 'WEBP', quality=90, method=6)
dims['logo'] = {'l': lg.width, 'h': lg.height}

# Image de partage 1200x630 : le cadeau.
im = Image.open(os.path.join(SRC, '1512909006721-3d6018887383.jpg')).convert('RGB')
h = round(im.width * 630 / 1200); y = max(0, round(im.height * .5 - h / 2))
im.crop((0, y, im.width, y + h)).resize((1200, 630), Image.LANCZOS).save(os.path.join(DST, 'partage.jpg'), quality=82)
json.dump(dims, open(os.path.join(ICI, 'photos.json'), 'w'), indent=0)
