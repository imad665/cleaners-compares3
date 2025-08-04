const fs = require('fs');
const https = require('https');
const path = require('path');

const brandingImages: string[] = [
  'https://www.cleanerscompare.com/pics/6/avery.png',
  'https://www.cleanerscompare.com/pics/6/stamford.png',
  'https://www.cleanerscompare.com/pics/6/sdsave.png',
  'https://www.cleanerscompare.com/pics/6/barbanti.png',
  'https://www.cleanerscompare.com/pics/6/abac.png',
  'https://www.cleanerscompare.com/pics/6/bowe.png',
  'https://www.cleanerscompare.com/pics/6/seitz.png',
  'https://www.cleanerscompare.com/pics/6/coleandwilson.png',
  'https://www.cleanerscompare.com/pics/6/artmecc.png',
  'https://www.cleanerscompare.com/pics/6/rampi.png',
  'https://www.cleanerscompare.com/pics/6/eastpac.png',
  'https://www.cleanerscompare.com/pics/6/allpartsdrycleaning.png',
  'https://www.cleanerscompare.com/pics/6/linenconnect.png',
  'https://www.cleanerscompare.com/pics/6/richardhowarth.png',
  'https://www.cleanerscompare.com/pics/6/axcessit.png',
  'https://www.cleanerscompare.com/pics/6/unitsteam.png',
  'https://www.cleanerscompare.com/pics/6/hilden.png',
  'https://www.cleanerscompare.com/pics/6/cfbboilers.png',
  'https://www.cleanerscompare.com/pics/6/firbimatic.png',
  'https://www.cleanerscompare.com/pics/6/ags.png',
  'https://www.cleanerscompare.com/pics/6/unisec.png',
  'https://www.cleanerscompare.com/pics/6/sankosha.png',
  'https://www.cleanerscompare.com/pics/6/swiftchoice.png',
  'https://www.cleanerscompare.com/pics/6/goalwinners.png',
];

const downloadImage = (url: string, dest: string) => {
  return new Promise<void>((resolve, reject) => {
    https.get(url, (response: any) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${dest}`);
          resolve();
        });
      } else {
        reject(`❌ Failed to download ${url}. Status code: ${response.statusCode}`);
      }
    }).on('error', (err: Error) => {
      reject(`❌ Error downloading ${url}: ${err.message}`);
    });
  });
};

const downloadAllImages = async () => {
  const brandDir = path.join(__dirname, '../public/brands');
  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }

  for (const url of brandingImages) {
    const fileName = path.basename(url);
    const destPath = path.join(brandDir, fileName);
    try {
      await downloadImage(url, destPath);
    } catch (error) {
      console.error(error);
    }
  }
};

downloadAllImages();
