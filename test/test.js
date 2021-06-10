const axios = require('axios');
let assert = require('assert');

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp);

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



const actualizados = [
    "nombre"
];

const updates = [
    "NNDA"
];

beforeEach(function () {
	chai.request(URL).get(`saveasada?actualizados=${actualizados}&updates=${updates}&id=20212A`);
});

beforeEach(function() {
	chai.request(URL).get(`deleteindicador?borrados=['1151A']`);
})

describe('Integration tests', function () {
	describe('Información de asada', function () {
		it('Consistencia entre edición y lectura: Debe leer el nombre NNDA', function() {
			return chai.request(URL).get(`/getInfoAsada/20212A`)
			.then(function (res) {
				expect(res).to.have.status(400);
				expect(res).to.have.property('error');
				expect(res.asadaInfo.Nombre).to.be.equal('NNDA');
				expect(res).not.to.have.property('indicador');
			});
		});
	});

	describe('Consistencia de indicadores', function () {
		it('Consistencia entre eliminación y lectura: No debe encontrarlo', function () {
			return chai.request(URL).get(`/indicador/1151A`)
			.then(function (res) {
				expect(res).to.have.status(400);
				expect(res).to.have.property('indicador');
			});
		});
	});

	describe('Visualizar estadísticas', function () {
		it('Asegura el funcionamiento de las liberías para visualización: debe dar 2xx', function() {
			return chai.request(URL).get(`/getInfoAsada/20212A`)
			.then(function (res) {
				expect(res).to.have.status(400);
				expect(res).to.have.property('error');
				expect(res).not.to.have.property('indicador');
			});
		});
	});

	describe('Comparar mapas de asadas por años',function () {
		it('Asegura el funcionamiento de las librerías para los mapas: debe ser 2xx', function() {
			return chai.request(URL).get(`/indicador/1151A`)
			.then(function (res) {
				expect(res).to.have.status(400);
				expect(res).not.to.have.property('indicador');
			});
		});
	});
});