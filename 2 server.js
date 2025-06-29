const express = require('express');
const axios   = require('axios');
const FormData= require('form-data');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;
const API_URL = 'https://www.call2all.co.il/ym/api';

// מְתוֹךְ express – לקבל JSON ו-form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// לשרת את index.html ו-JS/CSS סטטי
app.use(express.static(path.join(__dirname)));

// פונקציית proxy ל־API של ימות־המשיח
async function apiCall(fn, fields={}, file=null) {
  const form = new FormData();
  form.append('ApiFunction', fn);
  Object.entries(fields).forEach(([k,v])=>{
    if (v!=null) form.append(k, v);
  });
  if (file) {
    // file.buffer + file.originalname אם היינו משתמשים ב־multer
    form.append('file', file.buffer, { filename: file.originalname });
  }
  const res = await axios.post(`${API_URL}/${fn}`, form, {
    headers: form.getHeaders()
  });
  return res.data;
}

// 1) התחברות
app.post('/api/Login', async (req, res) => {
  try {
    const out = await apiCall('Login', {
      username: req.body.username,
      password: req.body.password
    });
    res.send(out);
  } catch(e) {
    res.status(500).send(e.toString());
  }
});

// 2) ListFolder (מצב חי)
app.post('/api/ListFolder', async (req, res) => {
  try {
    const out = await apiCall('ListFolder', {
      token: req.body.token,
      path:    req.body.path
    });
    res.send(out);
  } catch(e) {
    res.status(500).send(e.toString());
  }
});

// 3) UploadFile (יצירת / עדכון קובץ .ini)
app.post('/api/UploadFile', async (req, res) => {
  try {
    const out = await apiCall('UploadFile', {
      token: req.body.token,
      path:  req.body.path
    }, req.files?.file || null);
    res.send(out);
  } catch(e) {
    res.status(500).send(e.toString());
  }
});

// 4) DeleteFile
app.post('/api/DeleteFile', async (req, res) => {
  try {
    const out = await apiCall('DeleteFile', {
      token: req.body.token,
      path:  req.body.path
    });
    res.send(out);
  } catch(e) {
    res.status(500).send(e.toString());
  }
});

// 5) DeleteFolder
app.post('/api/DeleteFolder', async (req, res) => {
  try {
    const out = await apiCall('DeleteFolder', {
      token: req.body.token,
      path:  req.body.path
    });
    res.send(out);
  } catch(e) {
    res.status(500).send(e.toString());
  }
});

// 6) CopyFolder (שכפול)
app.post('/api/CopyFolder', async (req, res) => {
  try {
    const out = await apiCall('CopyFolder', {
      token: req.body.token,
      path:  req.body.src,
      dest:  req.body.dest
    });
    res.send(out);
  } catch(e) {
    res.status(500).send(e.toString());
  }
});

app.listen(PORT, ()=>console.log(`🎉 Server listening on port ${PORT}`));