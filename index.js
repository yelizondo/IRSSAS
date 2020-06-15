
// importar bibliotecas
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const path = require('path');
const app = express();
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
//var correos = require('./public/scripts/script');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'irssastec@gmail.com',
    pass: 'tcaesriyfcqldfuk'
  }
});

global.transporter = transporter;




const PORT = process.env.PORT || 8000

//llamar funciones de controller.js

const {getCrudComponente, saveComponente, getCrudSubcomponente, saveSubComponente, getCrudIndicador, getIndicador, deleteIndicador, updateIndicador, newIndicador, createIndicador, getCrudAsadasR,getCrudAsadasU, getPresentAsada, saveAsada, newAsada, createAsada, deleteAsada, crudFormularios, sendForm, getCrudUsuario, saveUsuario, getUsuariosAsadas,setUsuariosAsada, guardarFormulario, cargarFormulario, getContacto, updateEstado, changePassword,forgetPassword, getListaAsociaciones, nuevaAsociacion, nuevaAsociacionGuardar, editarAsociacion, editarAsociacionGuardar, eliminarAsociacion, sendSolicitudRegistroAsada, aceptarRechazarSolicitudRegistroAsada, getAyudaPregunta, deleteNotificacion, getAyudaRiesgo, getInformeUsuarioGeneral} = require('./routes/cruds');
const {getHomePage, login, getMain, getVisor, getComponente, logout, getSites, grafico, getRiesgo, getAsada, getInfoGeneral, generarInforme, histFormulario, getAnno, getRespuestas, comparaMapas, statsComponentes,statsSubcomponentes, getCantones, getDistritos, getEstadisticas, getMapa, getManualData, getManualUsuario, getManualDataDescargar, getRutas, getRutasData, solicitudRegistroAsada, validarUsuario, getVerSolicitudRegistroAsada,getEstadisticasGenerales,generarInformeMejora, getInformeMejora, sendCorreosNotificacionesAdmin, getInfoAsada, getAllSubcomponentes, getStatsSubcomponentesAsada, loginPage} = require('./routes/controller');


//conexion de BD
const db = mysql.createConnection ({
    host     : '35.184.65.113',//35.184.65.113
    user     : 'root',
    password : 'jdsakfidsajfklsñad56798416374',//jdsakfidsajfklsñad56798416374
    database : 'asadas_test',//asadas
    port : '3306'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
    db.query("SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';")
});
global.db = db;


// configuracion de Express
app.set('port', PORT); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(fileUpload()); 
// creacion de express-session
app.use(require('express-session')({
 
        name: '_es_demo', 
        secret: 'Ak1323e2sndwk_JEKFO', 
        resave: false, 
        saveUninitialized: false 
 
    }));



// rutas con sus respectivas funciones
app.get('/', getHomePage);
app.post('/', [login, getMain]);
app.get('/visor', getVisor);
app.get('/main', getMain);
app.get('/logout', logout);
app.get('/getSites', getSites);
app.get('/getComponente', getComponente);
app.get('/componente', getCrudComponente);
app.get('/subcomponente', getCrudSubcomponente);
app.get('/indicador', getCrudIndicador);
app.get('/asadas', getCrudAsadasR);
app.get('/asadas/:id', getCrudAsadasU);
app.get('/presentacionAsadas', getPresentAsada);
app.get('/saveasada', saveAsada);
app.get('/usuario', getCrudUsuario);
app.get('/saveUsuario', saveUsuario);
app.get('/saveComponente', saveComponente);
app.get('/savesubcomponente', saveSubComponente);
app.get('/indicador/:id', getIndicador);
app.get('/deleteindicador', deleteIndicador);
app.get('/updateindicador', updateIndicador);
app.get('/newindicador', newIndicador);
app.post('/createindicador', createIndicador);
app.get('/usuario', getCrudUsuario);
app.get('/newasada',newAsada);
app.post('/createasada',createAsada);
app.get('/deleteasada', deleteAsada);
app.get('/grafico', grafico);
app.get('/getRiesgo', getRiesgo);
app.get('/getAsada', getAsada);
app.get('/crudFormularios', crudFormularios);
app.get('/infoGeneral', getInfoGeneral);
app.get('/generarInforme', generarInforme);
app.post('/sendForm', sendForm);
app.get('/changeAsadaUser', getUsuariosAsadas);
app.get('/setUsuariosAsada',setUsuariosAsada);
app.get('/histFormulario', histFormulario);
app.get('/getAnno', getAnno);
app.get('/getRespuestas',getRespuestas);
app.get('/comparaMapas', comparaMapas);
app.get('/statsComponentes',statsComponentes);
app.get('/statsSubcomponentes/:id',statsSubcomponentes);
app.get('/getCantones', getCantones);
app.get('/getDistritos', getDistritos);
app.get('/getEstadisticas',getEstadisticas);
app.get('/guardarFormulario',guardarFormulario);
app.get('/cargarFormulario',cargarFormulario);
app.get('/mapa',getMapa);
app.get('/contacto',getContacto);
app.get('/updateEstado', updateEstado);
app.get('/changePassword', changePassword);
app.get('/forgetPassword', forgetPassword);
app.get('/solicitudRegistroAsada', solicitudRegistroAsada);
app.get('/validarUsuario', validarUsuario);
app.post('/sendSolicitudRegistroAsada', sendSolicitudRegistroAsada);
app.get('/asociaciones', getListaAsociaciones);
app.get('/asociaciones/crear', nuevaAsociacion);
app.post('/asociaciones/crear', nuevaAsociacionGuardar);
app.get('/asociaciones/editar/:asociacion', editarAsociacion);
app.post('/asociaciones/editar/:asociacion', editarAsociacionGuardar);
app.get('/asociaciones/eliminar/:asociacion', eliminarAsociacion);
app.get('/manual', getManualUsuario);
app.get('/manual.pdf', getManualData);
app.get('/manual/descargar', getManualDataDescargar);
app.get('/rutas', getRutas);
app.get('/rutas/data', getRutasData);
app.get('/verSolicitudRegistroAsada', getVerSolicitudRegistroAsada);
app.post('/verSolicitudRegistroAsada/respuesta', aceptarRechazarSolicitudRegistroAsada);
app.get('/getAyudaPregunta', getAyudaPregunta);
app.post('/deleteNotificacion', deleteNotificacion);
app.get('/verEstadisticasGenerales', getEstadisticasGenerales);
app.get('/getAyudaRiesgo/:idRiesgo', getAyudaRiesgo);
app.post('/getInformeUsuarioGeneral', getInformeUsuarioGeneral)

app.get('/generarInformeMejora', generarInformeMejora)
app.get('/generarInformeMejora/getInforme/:idAsada', getInformeMejora)

app.get('/getInfoAsada/:idAsada', getInfoAsada)
app.get('/getAllSubcomponentes', getAllSubcomponentes)

app.get('/getStatsSubcomponentes/:idAsada', getStatsSubcomponentesAsada)

app.get("/login", loginPage)

// llamada al puerto 
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    var correosRecordatorio = schedule.scheduleJob('0 48 13 26 5 *', function(){
      sendCorreosNotificacionesAdmin();
  });;
});

