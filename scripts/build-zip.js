import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageZip() {
  console.log('Packaging love-you-website.zip...');
  const zip = new JSZip();
  const sourceDir = path.resolve('love-you-website');

  function addFolderToZip(folderPath, zipFolder) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subZip = zipFolder.folder(item);
        addFolderToZip(fullPath, subZip);
      } else {
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(item, fileData);
      }
    }
  }

  // Create root folder inside zip: love-you-website/
  const rootZipFolder = zip.folder('love-you-website');
  addFolderToZip(sourceDir, rootZipFolder);

  // Also include files directly at top level for convenience
  addFolderToZip(sourceDir, zip);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Ensure public folder exists
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write to public/love-you-website.zip so it can be downloaded via browser
  fs.writeFileSync(path.join(publicDir, 'love-you-website.zip'), content);
  // Also write to root love-you-website.zip
  fs.writeFileSync(path.resolve('love-you-website.zip'), content);

  console.log('Successfully created love-you-website.zip (' + content.length + ' bytes)');
}

packageZip().catch(err => {
  console.error('Error creating zip:', err);
  process.exit(1);
});
