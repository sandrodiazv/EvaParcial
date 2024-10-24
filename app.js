const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const config = require('./public/scripts/config')
const port = 3000

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/login.html`)
})

app.get('/home', (req, res) => {
    res.sendFile(`${__dirname}/public/home.html`)
})

app.get('/nosotros', (req, res) => {
    res.sendFile(`${__dirname}/public/nosotros.html`)
})

app.get('/contactanos', (req, res) => {
    res.sendFile(`${__dirname}/public/contactanos.html`)
})

app.get('/politicas', (req, res) => {
    res.sendFile(`${__dirname}/public/politicas.html`)
})

//////////////////////////////////////////////////////////

app.post('/register', (req, res) => {
    if (`${req.body.username}` === 'sandro@gmail.com' && `${req.body.password}` === '123456') {
        const user = {
            username: `${req.body.username}`,
            password: `${req.body.password}`
        }
        jwt.sign({ user: user }, 'secretkey', { expiresIn: '200s' }, (err, token) => {
            // Almacenar el token en una cookie
            res.cookie('token', token, { httpOnly: true, maxAge: 200000 })
            res.redirect('/login.html')
        })
    } else {
        return res.status(401).json({
            auth: false,
            message: 'Credenciales incorrectas'
        })
    }
})

app.post('/login', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.redirect('/home.html')
        }
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    const token = req.cookies.token || (bearerHeader ? bearerHeader.split(' ')[1] : null)

    if (token) {
        req.token = token
        next()
    } else {
        res.status(401).send('Token no proporcionado')
    }
}

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/login.html')
})


//////////////////////////////////////////////////////////

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}, http://localhost:${port}`)
})