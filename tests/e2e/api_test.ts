import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

async function run() {
  console.log("=== SAFEPAWS E2E API VALIDATION ===\n");
  
  const tempDir = os.tmpdir();
  const validImage = path.join(tempDir, 'valid.jpg');
  const nodogImage = path.join(tempDir, 'nodog.jpg');
  const lowQualityImage = path.join(tempDir, 'lowquality.jpg');
  
  // Minimal 1x1 JPEG base64
  const emptyJpeg = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');

  fs.writeFileSync(validImage, Buffer.from('mock_valid_dog'));
  fs.writeFileSync(nodogImage, Buffer.from('mock_no_dog'));
  fs.writeFileSync(lowQualityImage, Buffer.from('mock_low_quality'));
  
  const BASE_URL = 'http://127.0.0.1:8000/api/v1';
  let createdPetId = '';

  // 1. Registration
  console.log("1. Testing Registration...");
  const regRes = await fetch(`${BASE_URL}/pets/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Doggo',
      species: 'dog',
      breed: 'Pug',
      color: 'Fawn',
      age: '3',
      neighborhood: 'Downtown',
      owner_name: 'Sam',
      owner_phone: '555',
      consent_given: true
    })
  });
  const regData = await regRes.json();
  console.log(`Registration Response (${regRes.status}):`, regData);
  createdPetId = regData.id;

  // 2. Identify - Success
  console.log("\n2. Testing Identify (MATCH)...");
  let formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync(validImage)], { type: 'image/jpeg' }), 'valid.jpg');
  let idRes = await fetch(`${BASE_URL}/pets/identify`, { method: 'POST', body: formData });
  console.log(`Identify Match Response (${idRes.status}):`, await idRes.json());

  // 3. Identify - No Dog
  console.log("\n3. Testing Identify (NO DOG)...");
  formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync(nodogImage)], { type: 'image/jpeg' }), 'nodog.jpg');
  idRes = await fetch(`${BASE_URL}/pets/identify`, { method: 'POST', body: formData });
  console.log(`Identify No Dog Response (${idRes.status}):`, await idRes.json());

  // 4. Identify - Low Quality
  console.log("\n4. Testing Identify (LOW QUALITY)...");
  formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync(lowQualityImage)], { type: 'image/jpeg' }), 'lowquality.jpg');
  idRes = await fetch(`${BASE_URL}/pets/identify`, { method: 'POST', body: formData });
  console.log(`Identify Low Quality Response (${idRes.status}):`, await idRes.json());

  // 5. Create Sighting
  console.log("\n5. Testing Sighting Creation...");
  const sightRes = await fetch(`${BASE_URL}/sightings/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reporter_name: 'Test Reporter',
      location: '123 Main St',
      notes: 'I saw the dog',
    })
  });
  console.log(`Sighting Response (${sightRes.status}):`, await sightRes.json());

}

run().catch(console.error);
