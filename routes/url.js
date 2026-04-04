const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { nanoid } = require('nanoid');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'urls.json');

async function readUrls() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeUrls(urls) {
  await fs.writeFile(DATA_PATH, JSON.stringify(urls, null, 2), 'utf8');
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// GET /urls - Get all URLs
router.get('/urls', async (req, res, next) => {
  try {
    const urls = await readUrls();
    const baseUrl = `http://localhost:${process.env.PORT || 3000}`;
    const result = urls.map(u => ({
      code: u.code,
      originalUrl: u.originalUrl,
      shortUrl: `${baseUrl}/${u.code}`,
      createdAt: u.createdAt
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /shorten - Create short URL
router.post('/shorten', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL. Must start with http:// or https://' });
    }

    const urls = await readUrls();

    // Check if URL already exists
    const existing = urls.find(u => u.originalUrl === url);
    if (existing) {
      return res.json({
        code: existing.code,
        originalUrl: existing.originalUrl,
        shortUrl: `http://localhost:${process.env.PORT || 3000}/${existing.code}`,
        createdAt: existing.createdAt
      });
    }

    const code = nanoid(6);
    const newUrl = {
      code,
      originalUrl: url,
      createdAt: new Date().toISOString()
    };

    urls.push(newUrl);
    await writeUrls(urls);

    res.status(201).json({
      code: newUrl.code,
      originalUrl: newUrl.originalUrl,
      shortUrl: `http://localhost:${process.env.PORT || 3000}/${newUrl.code}`,
      createdAt: newUrl.createdAt
    });
  } catch (err) {
    next(err);
  }
});

// GET /:code - Redirect to original URL
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const urls = await readUrls();
    const urlEntry = urls.find(u => u.code === code);

    if (!urlEntry) {
      return res.status(404).json({ error: 'Short URL code not found' });
    }

    res.redirect(urlEntry.originalUrl);
  } catch (err) {
    next(err);
  }
});

// DELETE /urls/:code - Delete short URL
router.delete('/urls/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const urls = await readUrls();
    const index = urls.findIndex(u => u.code === code);

    if (index === -1) {
      return res.status(404).json({ error: 'Short URL code not found' });
    }

    urls.splice(index, 1);
    await writeUrls(urls);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
