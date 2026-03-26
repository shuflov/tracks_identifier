import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const CSV_PATH = path.join(__dirname, 'tracks.csv');

const trackSchema = {
  type: 'OBJECT',
  properties: {
    species: { type: 'STRING' },
    scientificName: { type: 'STRING' },
    family: { type: 'STRING' },
    confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
    imageUrl: { type: 'STRING' },
    notes: { type: 'STRING', maxLength: 50 }
  },
  required: ['species', 'scientificName', 'family', 'confidence']
};

function initCSV() {
  if (!fs.existsSync(CSV_PATH)) {
    const header = 'timestamp,species,scientificName,family,confidence,imageUrl,notes\n';
    fs.writeFileSync(CSV_PATH, header);
  }
}

function saveTrackToCSV(track) {
  const row = [
    track.timestamp,
    `"${track.species}"`,
    `"${track.scientificName}"`,
    `"${track.family}"`,
    track.confidence,
    track.imageUrl || '',
    `"${track.notes || ''}"`
  ].join(',') + '\n';
  
  fs.appendFileSync(CSV_PATH, row);
}

function readTracksFromCSV() {
  if (!fs.existsSync(CSV_PATH)) {
    return [];
  }
  
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.trim().split('\n');
  
  if (lines.length <= 1) return [];
  
  const tracks = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const parts = line.split(',');
    if (parts.length >= 5) {
      tracks.push({
        id: `track-${i}`,
        timestamp: parts[0] || '',
        species: parts[1]?.replace(/"/g, '') || '',
        scientificName: parts[2]?.replace(/"/g, '') || '',
        family: parts[3]?.replace(/"/g, '') || '',
        confidence: parts[4] || 'medium',
        imageUrl: parts[5] || '',
        notes: parts[6]?.replace(/"/g, '') || ''
      });
    }
  }
  
  return tracks.reverse();
}

app.post('/api/identify', async (req, res) => {
  const { image, mimeType, apiKey } = req.body;
  
  if (!image || !mimeType) {
    return res.status(400).json({ success: false, error: 'Image data is required' });
  }
  
  if (!apiKey) {
    return res.status(400).json({ success: false, error: 'API key is required' });
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Analyze the provided image containing an animal track. 
Focus on species common in Slovakia and Central Europe (countries like Slovakia, Czech Republic, Austria, Hungary, Poland).
Identify the animal based on its tracks. 

Provide a JSON response with these exact fields:
- species: common name (e.g., "Red Fox", "Roe Deer", "Wild Boar")
- scientificName: latin name (e.g., "Vulpes vulpes", "Capreolus capreolus")
- family: animal family (e.g., Canidae, Cervidae, Suidae)
- confidence: "low", "medium", or "high" based on how certain you are
- imageUrl: URL to an example image of this animal (search the web and provide a direct image URL from Wikipedia or similar reliable source)
- notes: brief notes about the track (max 50 characters)

CRITICAL: The response must be ONLY valid JSON, no additional text.`;
    
    const result = await model.generateContent([
      { inlineData: { data: image, mimeType } },
      { text: prompt }
    ]);
    
    const responseText = result.response.text();
    
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response');
      }
    }
    
    const track = {
      id: `track-${Date.now()}`,
      timestamp: new Date().toISOString(),
      species: parsed.species || 'Unknown',
      scientificName: parsed.scientificName || '',
      family: parsed.family || '',
      confidence: parsed.confidence || 'medium',
      imageUrl: parsed.imageUrl || '',
      notes: (parsed.notes || '').slice(0, 50)
    };
    
    saveTrackToCSV(track);
    
    res.json({ success: true, track });
    
  } catch (error) {
    console.error('Error identifying track:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to identify track' 
    });
  }
});

app.get('/api/tracks', (req, res) => {
  try {
    const tracks = readTracksFromCSV();
    res.json({ success: true, tracks });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to read tracks' 
    });
  }
});

app.get('/api/csv', (req, res) => {
  try {
    if (!fs.existsSync(CSV_PATH)) {
      return res.status(404).send('No tracks recorded yet');
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tracks.csv');
    res.send(fs.readFileSync(CSV_PATH, 'utf-8'));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

initCSV();

app.listen(PORT, () => {
  console.log(`Tracks Identifier API running on http://localhost:${PORT}`);
});