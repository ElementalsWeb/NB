const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
const axios = require('axios').default;
const fs = require('fs');
const FormData = require('form-data');
const app = express();

const PORT = process.env.PORT || 3000;
const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;

const threeAdminToken = '2e113be6-bbfb-48c6-998a-7efa10593f29';
const orgId = '62e2af29-9c24-48f3-ad7b-ddac67694a2a';
const envUrl = 'https://preview.threekit.com';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).send({ message: 'server healthy!' });
});

app.post('/api/email', async (req, res) => {
  const data = req.body;
  const response = await axios.post(
    'https://api.postmarkapp.com/email/withTemplate/',
    data,
    {
      headers: { 'X-Postmark-Server-Token': POSTMARK_TOKEN },
    }
  );
  if (response.status !== 200)
    res.status(500).json({ message: 'error connecting to postmark' });
  res.status(200).send(response.data);
});

app.get('/api/safeImage', function (req, res) {
  const url = req.query.url;
  const name = url.split('/')[url.split('/').length - 1];

  fetch(url)
    .then((data) => {
      return data.arrayBuffer();
    })
    .then((buffer) => {
      const fileName = name;

      const abc = new File([buffer], fileName, { type: 'image' });
      const formData = new FormData();
      formData.set('files', abc, fileName);

      const requestOptions = {
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${threeAdminToken}`,
        },
      };

      fetch(
        `${envUrl}/api/catalog/assets/upload?orgId=${orgId}`,

        requestOptions
      )
        .then((resp) => resp.json())
        .then((data) => {
          const id = data[0].jobId;
          loadAssetId({ status: 'pending', data });

          function loadAssetId({ status, data }) {
            if (status === 'pending') {
              const jobRequestOptions = {
                method: 'GET',
                headers: {
                  authorization: `Bearer ${threeAdminToken}`,
                },
              };

              fetch(
                `${envUrl}/api/catalog/jobs/${id}?orgId=${orgId}`,
                jobRequestOptions
              )
                .then((resp) => resp.json())
                .then((data) => {
                  // do stuff with files and body
                  if (status === 'pending') {
                    setTimeout(() => {
                      loadAssetId({ status: data.job.status, data });
                    }, 300);
                  } else {
                    loadAssetId({ status: data.job.status, data });
                  }
                });
            } else if (status === 'stopped' && data) {
              return res.json({ status: 'OK', result: data });
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
});
// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve the deployed worker explicitly, with update-friendly headers.
app.get('/sw.js', (_req, res) => {
  res.set({
    'Content-Type': 'application/javascript; charset=utf-8',
    'Service-Worker-Allowed': '/',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.sendFile(path.join(__dirname, 'build', 'sw.js'), (error) => {
    if (error && !res.headersSent) {
      res.status(error.statusCode || 500).send('// Service Worker unavailable');
    }
  });
});

app.use(express.static(path.join(__dirname, 'build')));
app.use('/images', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('listening on port: ', PORT));
