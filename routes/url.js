const express = require('express');
const router = express.Router();
const validUrl = require('valid-url')
const shortid = require('shortid')

// import the Url model
const Url = require('../models/URL')

//Get index page
router.get('/', (req, res) => {
    //random generated code
    const path = shortid.generate();
    res.render('index', {
        path: path
    });
})

//Post index page
router.post('/', async (req, res) => {
    let baseUrl = "http://localhost:4000",
        url = req.body.url,
        path = req.body.path;

    //check url entered by user is valid or not
    if (validUrl.isUri(url)) {
        try {
            //check if the path is available or not
            await Url.findOne({
                path
            }, async (err, doc) => {
                if (err) {
                    return res.render('index', {
                        error: 'Server Error.',
                        path: path,
                        url: url
                    })
                }
                //path exists so return
                if (doc) {
                    return res.render('index', {
                        error: 'This path is already taken.',
                        path: path,
                        url: url
                    })
                }
                //all good
                if (!doc) {
                    //join path with the base url
                    const shortUrl = `${baseUrl}/${path}`
                    //storing information to database
                    url = new Url({
                        url,
                        shortUrl,
                        path
                    })
                    await url.save()
                    return res.render('index', {
                        success: shortUrl,
                        path: shortid.generate()
                    })        
                }
            })
        }
        //exception handler
        catch (err) {
            return res.render('index', {
                error: 'Server Error!',
                path: path,
                url: url
            })
        }
    } else {
        return res.render('index', {
            error: 'Invalid url!',
            path: path,
            url: url
        })
    }
})

//Get result page
router.get('/:path', async (req, res) => {
    let path = req.params.path
    try {
        // find a document match to the code in req.params.code
        const url = await Url.findOne({
            path: path
        })
        if (url) {
            // when valid we perform a redirect
            return res.redirect(url.url)
        } else {
            // else return a not found 404 status
            return res.status(404).json('No URL Found')
        }

    }
    // exception handler
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
})


//exports
module.exports = router;