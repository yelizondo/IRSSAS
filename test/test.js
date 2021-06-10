const axios = require('axios');
let assert = require('assert');

// Data for components
const nuevos1 = [
    { nombre: 'Nuevo 1', valor: 30.0 },
    { nombre: 'Nuevo 2', valor: 33.0 },
    { nombre: 'Nuevo 3', valor: 34.0 } 
];

const actualizados1 = [
    { nombre: 'Act 2', valor: 11.0, id: 2 }
];

const borrados1 = [
    { id: 3 } 
];

// Data for subcomponents
const nuevos2 = [
    { nombre: 'Nuevo 1', valor: 30.0 },
    { nombre: 'Nuevo 2', valor: 33.0 },
    { nombre: 'Nuevo 3', valor: 34.0 } 
];

const actualizados2 = [
    { nombre: 'Act 2', valor: 11.0, id: 2 }
];

const borrados2 = [
    { id: 3 } 
];

const URL = 'www.irssas.xyz';

describe('Unit tests', function() {
	describe('saveComponentes', function() {
		it('Should accept if returns HTTP status code 200', function() {
			return axios.get(URL+'/saveComponente?nuevos=${nuevos1}&actualizados=${actualizados1}&borrados=${borrados1}', {
				validateStatus: function (status) {
					return status < 400;
				}  
			})
			.then(function (response) {
				assert.ok(true);	
			})
			.catch(function (error) {
				assert.ok(false);	
			});
		});
	});
  
	describe('saveSubComponente', function() {
		it('Should accept if returns HTTP status code 200', function() {
			return axios.get(URL+'/savesubcomponente?nuevos=${nuevos2}&actualizados=${actualizados2}&borrados=${borrados2}', {
				validateStatus: function (status) {
					return status < 400;
				}  
			})
			.then(function (response) {
				assert.ok(true);	
			})
			.catch(function (error) {
				assert.ok(false);	
			});
		});	
	});

	describe('createAsada', function() {
		it('Debe dar un error 4xx ya que los datos del request son incorrectos o están vacíos', function() {
			return axios.get(URL+'/createasada?ID=&Nombre=AsadaPrueba&Distrito_ID=30B4&Latitud=23.345434&Longitud=-86.234321&'
						 +'Telefono=87654321&Poblacion=700&Url=no&cantAbonados=-34&Ubicacion=Perez Zeledon', {
				validateStatus: function (status) {
					return status >= 400 && status < 500;
				}			 
			})
			.then(function (response) {
				assert.ok(false);
			})
			.catch(function (error) {
				assert.ok(true);
			});
		});	
	});

	describe('guardarFormulario', function() {
		it('Debe dar un error 4xx ya que los datos del request son incorectos o están vacíos', function() {
			return axios.get(URL+'/guardarFormulario?anno=2020&asada=11123&respuestas=[]&indicadores=[]&', {
				validateStatus: function() {
					return status >= 400 && status < 500;	
				}
			})
			.then(function (reponse) {
				assert.ok(false);
			})
			.catch(function (error) {
				assert.ok(true);
			});
		});
	});
});