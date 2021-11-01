require('dotenv').config();
const express = require('express')
const upload = require("./utils/multer");
const {cloudinary} = require("./utils/cloudinary");

const app = express()
const port = 3000

app.use(express.json({limit: "50m"}));
app.use(express.urlencoded({limit: "50mb", extended: false}));

app.get('/images', async (req, res, next) => {

    try{
        const images = await cloudinary.api.resources();
        res.status(200).json(images);
    } catch(error){
        res.status(error.error.http_code).json(error);
    }

})

app.get('/images/:public_id', async (req, res, next) => {

    const { public_id } = req.params;

    try{
        const image = await cloudinary.api.resource(public_id);
        res.status(200).json(image);
    } catch(error){
        res.status(error.error.http_code).json(error);
    }

})

app.post('/images/multi', upload.array('images'), async(req, res, next) => {

    const data = [];

    for(let file of req.files){
        const result = await cloudinary.uploader.upload(file.path);
        data.push(result);
    }

    return res.status(200).json(data);
})

app.post('/images', upload.single('image'), async(req, res, next) => {
    console.log("file details: ", req.file);

    const result = await cloudinary.uploader.upload(req.file.path);

    console.log(result)

    const post_details = {
        title: req.body.title,
        image: result.public_id
    }

    return res.status(200).json({ post_details });
})

app.listen(port, () => console.log(`This is the beginning of the Node File Upload App`))