const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executepy');
const { executeJava } = require('./executeJava');
const { executeC } = require('./executeC');

const app = express();

const inputPath = path.join(__dirname,"inputs");

if (!fs.existsSync(inputPath)) {
  fs.mkdirSync(inputPath,{recursive: true});
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/run', async (req, res) => {
    const { language = "cpp", code, input } = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code not allowed" });
    }

    try {
        const filepath = await generateFile(language, code);

        const jobId = path.basename(filepath).split(".")[0];
        const inPath = path.join(inputPath,`${jobId}.txt`);
        await fs.writeFileSync(inPath,input);

        if (language === 'cpp') {
            const output = await executeCpp(filepath,inPath);
            console.log(output);

            return res.json({ filepath, output });
        }
        else if (language === 'python') {
            const output = await executePy(filepath,inPath);

            return res.json({ filepath, output });
        }
        else if (language === 'java') {
            const output = await executeJava(filepath,inPath);
            return res.json({ filepath, output });
        }

        else if(language === 'c'){
            const output = await executeC(filepath,inPath);
            return res.json({filepath,output});
        }
    } catch (error) {
        console.log('Err2:', error);
        return res.status(500).json({ success: false, output: error });
    }
});



app.listen(8080, () => {
    console.log("Listening at port 8080");
});