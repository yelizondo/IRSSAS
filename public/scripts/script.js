var graficoB = graficoNuevo ("bar","bar-chart");
var graficoA = graficoNuevo ("radar","radar-chart");
var graficoC = graficoDona ("doughnut","doughnut-chart");



//Setea los parametro para los graficos
function aranna(value, tipo, anno, grafico,tipoGrafico){
	var parameters = { "id": value, "tipo": tipo, "anno": anno};
    $.get('/getRiesgo',parameters,function(data) {
    	var tipoRiesgo = getTipoRiesgo (data.riesgo[0].valor.toFixed(0));

		if(tipoGrafico != "doughnut")
		{	
			grafico.data.labels = data.componentes;
			grafico.data.datasets[0].label = data.nombre;
			grafico.data.datasets[0].data = data.valores.map(function(valor){return valor.toFixed(0)});	
		}
		else{	// caso para grafico dona
			grafico.data.datasets[0].data = [data.riesgo[0].valor.toFixed(0)];	// Valor de IRSSAS total
			grafico.options.elements.center.text = data.riesgo[0].valor.toFixed(0);
		}

		grafico.update();
		document.getElementById ("riesgo").value = data.riesgo[0].valor.toFixed(0);
		document.getElementById ("tipoRiesgo").value = (["Muy Alto", "Alto", "Medio", "Bajo", "Muy bajo"])[tipoRiesgo];
		pintarGrafico (grafico,tipoGrafico);
	});
};

//Obtiene asada para grafico
function graficoAranna(grafico,tipoGrafico)
{
	var url = new URL(document.URL);
	var param = url.searchParams.get("asada");
	document.getElementById("asada").value = param == null ? document.getElementById("asada").value : param;
	var value = document.getElementById("asada").value;
    aranna(value,"INDICADORXASADA",0,grafico,tipoGrafico)
};


// Template grafico dona
function graficoDona (tipo,idChart)
{
	return new Chart(document.getElementById(idChart),
	{
		type: tipo,
		data:
		{
			labels: null,
			datasets: [{label: null , data: null}],
		},
		options:
		{
			responsive: true,
			maintainAspectRatio: false,
			title:
			{
				display: false,
				text: 'IRSSAS Total'
			},
			legend: 				// Titulo del grafico
			{
				display: false,
				labels: 
				{
					boxWidth: 0		// colorbox del titulo
				}
			},
			tooltips: {enabled: false},		// Oculta tags y ID's en hover
			events: [],			// Desabilita cambio de color en hover
			animation:
			{
				animateRotate: true		// Animacion del grafico
			},
			elements: {			// Comprende el texto dentro del grafico
			    center: {
			    	text: "",
					fontStyle: 'Arial', // Default is Arial
					sidePadding: 20, // Default is 20 (as a percentage)
					minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
					lineHeight: 25 // Default is 25 (in px), used for when text wraps
			    }
			}
		}
	});
}


//Crear la plantilla segun el tipo
function graficoNuevo (tipo,idChart)
{
	return new Chart(document.getElementById(idChart),
	{
		type: tipo,
		data:
		{
			labels: null,
		
			datasets:
			[
				{
					label: null,
					fill: true,
					backgroundColor: "rgba(25,61,102,0.2)",	// Azul
					borderColor: "rgba(25,61,102,1)",	// Azul
					pointBorderColor: "#fff",
					pointBackgroundColor: "rgba(179,181,198,1)",	// Gris
					pointRadius: 8,
					pointHoverRadius: 12,
					data: null,
				}
			],
		},
		options:
		{
			responsive:true,
			title:
			{
				display: true,
				text: 'Nivel de Riesgo de la ASADA'
			},
			legend: 		// Titulos de los graficos. Es posible usar 'tipo == "radar" ? {} :' para seleccionar grafico.
			{
				display: true,
				labels: 
				{
					boxWidth: 0
				}
			},
			scales: tipo == "radar" ? {} :
			{
				xAxes:[
					{
						barThickness: 20,
						maxBarThickness: 100,
					}
				],
				yAxes:
				[
					{
						display: true,
						ticks:
						{
							beginAtZero: true,
							steps: 10,
							max: 100
						}
					}
				]
			},
		}
	});
}

function auxCambiarGrafico(grafico,tipoGrafico,idChart)
{
	grafico.destroy();
	if(tipoGrafico != "doughnut"){
		grafico = graficoNuevo (tipoGrafico,idChart);
	}
	else{		// Caso grafico dona
		grafico = graficoDona ("doughnut","doughnut-chart");
	}
	graficoAranna(grafico,tipoGrafico);
	return grafico;
}

function cambiarGrafico()
{
	graficoA = auxCambiarGrafico(graficoA,"radar","radar-chart");
	graficoB = auxCambiarGrafico(graficoB,"bar","bar-chart");
	graficoC = auxCambiarGrafico(graficoC,"doughnut","doughnut-chart");

}

function presentarAsada(){
    
    var asada = document.getElementById("asada").value;
    var values_list = asada.split(";");
    //console.log(values_list);
    
    $("div.present").html(
        "<br><p><b>" + values_list[0] + "</b></p><br>" + 
        "<p><b>UBICACIÓN:</b> " + values_list[1] + ", " + values_list[2] + ", " + values_list[3] + "</p><br>" + 
        "<p><b>SEÑAS ADICIONALES:</b> " + values_list[4] + "</p><br>" + 
        "<p><b>TELÉFONO:</b> " + values_list[5] + "</p><br>" +
        "<p><b>URL:</b> " + values_list[6] + "</p><br>" 
    );
};

function cambiarTipoInforme(){

    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
        $("#agregarAsada").hide();
        $("#borrarAsada").hide();
        $("#asadasInforme").hide();
    }
    else{
        $("#agregarAsada").show();        
        $("#borrarAsada").show();
        $("#asadasInforme").show();
    }
    $("#prueba").hide();
	$("#downloadpdf").hide();
};

function addAsadaToList(){
    var asada = document.getElementById("asada").value;
	
	if ($("#listaAsadas").val() != "")
		$("#listaAsadas").val($("#listaAsadas").val() + "|" + asada);
	else
		$("#listaAsadas").val(asada);
	
    var values_list = asada.split(",");
	values_list[1] = values_list[1].trim(values_list[1]);	

	if (!$("#asadasInforme").val().includes(values_list[1]))
		$("#asadasInforme").val($("#asadasInforme").val() + values_list[1] + "\n");

};

function deleteAsadaFromList(){
    var asada = document.getElementById("asada").value;
    var values_list = asada.split(",");

	if ($("#listaAsadas").val().split("|").length > 1)
		$("#listaAsadas").val($("#listaAsadas").val().replace("|" + asada, ""));
	else
		$("#listaAsadas").val("");

	values_list[1] = values_list[1].trim(values_list[1]);
	$("#asadasInforme").val($("#asadasInforme").val().replace(values_list[1] + "\n", ""));
	
};

function generarPDF(){
	$("#prueba").show();
    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
    
        var asada = document.getElementById("asada").value;
        var values_list = asada.split(",");

        $("#prueba").html(
			'<div id="'+values_list[0]+'">'+
            "<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
            "<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
            "<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
            "<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
            "<p>Población: " + values_list[8] + "</p><br>" + 
            "<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
            "<p>Teléfono: " + values_list[10] + "</p><br>" + 
            "<p>URL: " + values_list[11] + "</p><br>" +
            "<canvas id=\"radar-chart\"></canvas></div>"
        );

        var incluirGraf = $("input[name='grafico']:checked")[0];
        var incluirHist = $("input[name='hist']:checked")[0];


        if (incluirGraf != null){
			grafico = graficoNuevo();
			aranna(parseInt(values_list[0]),"INDICADORXASADA",0, values_list[0]);
		}

        /*
        if (incluirHist != null)
            pdfdoc.addImage(canvasImg, 'JPEG', 10, 110, 100, 100);    
        */
	   $("#prueba")[0].hidden = false
    }
    else{
		var lista = $("#listaAsadas").val().split("|");

		$("#prueba").html("");

		for (var i = 0; i < lista.length; i++){
			values_list = lista[i].split(",");
			
			for (var j = 0; j < values_list.length; j++){
				values_list[j] = values_list[j].trim(values_list[j]);	
			}

			$("#prueba").append(
				'<div id="'+values_list[0]+'">'+
				"<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
				"<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
				"<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
				"<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
				"<p>Población: " + values_list[8] + "</p><br>" + 
				"<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
				"<p>Teléfono: " + values_list[10] + "</p><br>" + 
				"<p>URL: " + values_list[11] + "</p><br>" +
				"<canvas id=\"radar-chart"+values_list[0]+"\"></canvas></div>"
			);

			var incluirGraf = $("input[name='grafico']:checked")[0];
			var incluirHist = $("input[name='hist']:checked")[0];

			if (incluirGraf != null){
				grafico = graficoNuevo(values_list[0]);
				aranna(parseInt(values_list[0]),"INDICADORXASADA",0, values_list[0]);
			}
		}
	}
	$("#downloadpdf").show();
};

function downloadPDF()
{
	var pdfdoc = new jsPDF();

	var specialElementHandlers = {
		'#ignoreContent': function (element, renderer) {
			return true;
		}
	};

	var asadas = document.getElementById("prueba");
	var file_name = 'Informe - ASADAS'
	asadas.childNodes.forEach((element,key) => {
		if(key < asadas.childNodes.length && key > 0) pdfdoc.addPage();

		pdfdoc.fromHTML(element.innerHTML, 10, 10, {
			'width': 190,
			'elementHandlers': specialElementHandlers
		});
		//Cambiar el fondo a blanco para el jpeg
		var ctx = element.lastChild.getContext("2d");
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, element.lastChild.width, element.lastChild.height);
		
		pdfdoc.addImage(element.lastChild, "JPEG", 10, 110, 190, 190);
		file_name += " - " + element.id;
	});
	pdfdoc.save(file_name + '.pdf');
}

function getAnnos(object){
    var val= object.value

    $.get('/getAnno',{"asada": val},function(data) {
      jsonsites = data;
     }).done(function(res){
		var select = document.getElementById("anno");
		select.innerHTML="<option value='0'>Seleccione un año</option>";
		select.innerHTML+="<option onclick='getRespuestas("+jsonsites.anno+",\"actual\")' value='"+jsonsites.anno+"'>"+jsonsites.anno+"</option>";
        jsonsites.annos.forEach(function(anno){
            select.innerHTML+="<option onclick='getRespuestas("+anno.anno+",\"historico\")' value='"+anno.anno+"'>"+anno.anno+"</option>";
		});
		$("#btnCrearFormulario")[0].hidden = false;
	 });
     var select = document.getElementById("componenttable");
     select.innerHTML="<tr></tr>";
	 document.getElementById("radar-chart-div").style.visibility = "hidden";

}

function getRespuestas(val,tipo){
    if(val!="0" && val!=""){
    $("#error").html("");
    var asada= document.getElementById("asada").value
    var tipo = ((tipo == "actual") ? 'INDICADORXASADA' : 'HISTORICORESPUESTA');
    aranna(asada,tipo,val);
    document.getElementById("radar-chart-div").style.visibility = "visible";
    $.get('/getRespuestas',{"asada": asada, "anno": val, "tipo": tipo},function(data) {
      jsonsites = data;
     }).done(function(res){
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr>";
        jsonsites.preguntas.forEach(function(pregunta){
            select.innerHTML+="<td>" + pregunta.id + ". " +pregunta.pregunta+"</td><td>"+pregunta.respuesta+"</td>";
        });
        select.innerHTML+="</tr>";

     });
    }
     else{
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr></tr>";
        $("#error").html(((val == "0") ? "No existen respuestas actuales de esta Asada" : 'No existen respuestas históricas de esta Asada'));
        document.getElementById("radar-chart-div").style.visibility = "hidden";
     }
}


function comparar(){
  layers[2].setStyle(null);
  layers2[2].setStyle(null);
  var parameters = { "tipo": "2", "anno": document.getElementById("anno1").value,  "anno2": document.getElementById("anno2").value};
  $.get('/getSites',parameters,function(data) {
      jsonsites = data.jsonsites1;
      jsonsites2 = data.jsonsites2;
     }).done(function(res){       
        layers[2].setStyle(styleFunction);
        layers2[2].setStyle(styleFunction2);
    });
};

function generarPDFInformeMejora(numAsada){
	if(numAsada == null)
	{
		$("#prueba").show();
		var asada = document.getElementById("asada").value;
		var values_list = asada.split(",");
		numAsada = values_list[0];
		$("#downloadpdf").show();
	}
	textosMejora = "";	            
	$.get(`./generarInformeMejora/getInforme/:${numAsada}`,{},function(data){
	}).done(function(mejoras){
		var parameters = { "id": numAsada, "tipo": "INDICADORXASADA", "anno": 0};
		$.get('/getRiesgo',parameters,function(data2) {
			$.get(`/getInfoAsada/:${numAsada}` , function(data3){
				$.get("/getAllSubcomponentes", function(data4){
					$.get("/getStatsSubcomponentes/" + numAsada, function(data5){
						console.log(data5.statsSubcomponentes);
						console.log("Entre a todos los gets")
						var tipoRiesgo = getTipoRiesgo (data2.riesgo[0].valor.toFixed(0));
						var tipo = (["Muy Alto", "Alto", "Medio", "Bajo", "Muy bajo"])[tipoRiesgo]
						textosMejora = textosMejora +
						"<h2>Datos generales: </h2><br>"+
						"<p><b>Fecha en que se generó este informe: </b>" + getCurrentDate() +"</p>" +
						"<p><b>Código y nombre de la ASADA: </b>" +data3.asadaInfo.ID+"-"+data3.asadaInfo.Nombre+"</p>" +
						"<p><b>Provincia: </b>" +data3.asadaInfo.Provincia+"</p>" +
						"<p><b>Cantón: </b>" +data3.asadaInfo.Canton+"</p>" +
						"<p><b>Distrito: </b>" +data3.asadaInfo.Distrito+"</p>" +
						"<p><b>Población atendida: </b>" +data3.asadaInfo.Poblacion+" habitantes</p>" +
						"<p><b>El resultado de la evaluación del IRSSAS es: </b>" +data2.riesgo[0].valor.toFixed(0)+"%</p>" +
						"<p><b>Riesgo: </b>" + tipo +"</p>" + 
						"<h2>Comentarios generales: </h2><br>"+ 
						"<p>Este documento es recomendativo generado a partir de la autoevaluación realizada en su ASADA utilizando como base las respuestas al formulario IRSSAS.</p>"+
						"<p>Es una guía de acciones generales que le permitirán direccionar sus esfuerzos en pro de la mejora y desempeño de su ASADA, considerando los objetivos de desarrollo sostenible y la legislación nacional.</p>"+
						"<p>El mismo puede servir como insumo de diagnóstico preliminar de la gestión de su ASADA, con el cual podría acceder a cooperación y financiamiento.</p>"+
						"<p>También es útil para planificar a corto y mediano plazo las acciones e inversiones en su acueducto, además de priorizar las intervenciones.</p>"+
						"<p>Se recomienda revisar cada uno de los componentes y subcomponentes del IRSSAS que se muestran a continuación, con el fin de tomar las medidas necesarias para reducir el riesgo. </p>";
						var count = 0;
						var index = 0;
						var textos =[
									"La gestión de este subcomponente  permite disminuir el impacto de la contaminación en el recurso hídrico.  Para tal fin se recomiendan las siguientes acciones:",
									"La gestión adecuada del componente de los residuos sólidos disminuye la contaminación del suelo y también de los cuerpos de agua, aunque la misma no es responsabilidad directa de la ASADA, su mala gestión afectará la sostenibilidad de la prestación del servicio.  Para tal fin se recomiendan las siguientes acciones:",
									"La gestión del componente de protección del recurso hídrico es esencial para garantizar la prestación del servicio de agua, algunas de las acciones propuestas requieren la estrecha cooperación con otras instituciones gubernamentales, academia, sectores privados y ONGs. Para tal fin se recomiendan las siguientes acciones:",
									"La gestión del componente del agua potable incluye el análisis de los componentes del acueducto, los cuales deben funcionar adecuadamente para la prestación del servicio de agua y saneamiento, algunas de las acciones propuestas requieren inversión en infraestructura y gestión técnica.  A continuación, se muestran las acciones para fortalecer esta gestión.",
									"La gestión del componente administrativo financiero incluye la valoración de la morosidad y la liquidez,  estos dos son esenciales para garantizar la prestación del servicio de agua y saneamiento.  A continuación, se muestran acciones para fortalecer esta gestión.",
									"Este indicador elaborado por el MIDEPLAN muestra a nivel promedio la situación socioeconómica de los diferentes distritos del país, el significado de los valores de IDS se muestran a continuación.",
									"Las comunidades que han sido educadas ambientalmente tienden a presentar mejores niveles de protección del recurso hídrico y manejo de residuos sólidos, por tal razón, se recomiendan ejecutar las siguientes acciones.",
									"El riesgo en la prestación del servicio de agua y saneamiento aumenta por la presencia de eventos naturales.  Los mismos no  pueden evitarse, sin embargo, la prevención y la mitigación son dos herramientas indispensables para disminuir la vulnerabilidad de estos riesgos.  A continuación se muestran algunas acciones generales que la ASADA puede realizar."
									];
						data4.AllSubcomponentes.forEach(Sub =>
							{
								textosMejora = textosMejora + "<hr/>"+"<h4>Subcomponente: "+Sub.Nombre+": Nivel de Riesgo " + data5.statsSubcomponentes[index].valor.toFixed(0) +"%</h4>" +"<p>" + textos[index] + "</p>";
								mejoras.mejoras.forEach(mejora=>
									{
										if(mejora.SUBCOMPONENTE == Sub.ID)
										{
											console.log(mejora);
											textosMejora = textosMejora + 
											"<p style='white-space: pre-line'>"+mejora.TEXTO_MEJORA+"</p><br>";
											count = count + 1;
										}
										console.log(count);
										
									});
									if(count==0)
									{
										textosMejora = textosMejora + "<p>No se presentan recomendaciones para este subcomponente</p><br>";
									}
									count = 0;
									index = index + 1;
							});
						
							
							$("#prueba").html(
								"<div id="+numAsada+">"+
								"<h2>Informe de Mejora</h2><br>"
								+ textosMejora +"</div>"
							
						
								);
					
					
					
					});
					
				});
				
			});
			
		});
		
		
	});

	
};



function getCurrentDate()
{   
    var today = new Date();
    if(today.getMonth()<= 10)
    {
        var date = today.getDate() +'-0'+(today.getMonth()+1)+'-'+today.getFullYear();
    }
    else{
        var date = today.getDate() +'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    }
    
    console.log(date);
    return date;
};


function downloadInformeMejora(){
	var pdfdoc = new jsPDF();
	var indicadores = document.getElementById("prueba");
	var specialElementHandlers = {
		'#ignoreElement': function (element, renderer) {
			return true;
		}
	};
	//indicadores.childNodes.forEach((element,key) => {
		//if(key < indicadores.childNodes.length && key > 0) pdfdoc.addPage();
		pdfdoc.fromHTML(indicadores.innerHTML, 10, 10, {
			'width': 190,
			'elementHandlers': specialElementHandlers,
		});
	//});
	pdfdoc.save('informe-mejora.pdf');
	
};

function getEstadisticas(){
	var parameters = { "provincia": document.getElementById("prov").value, "canton": document.getElementById("cant").value, "distrito": document.getElementById("dist").value, "orden": document.getElementById("ord").value};
	var distritos;
	console.log(document.getElementById("dist").value);
	$.get('/getEstadisticas',parameters,function(data) {
		distritos = data;
	   }).done(function(res){       
		  var selectCant = document.getElementById("componenttable");
		  selectCant.innerHTML="";
		  var totalAsadas = document.getElementById("totalAsadas");
		  totalAsadas.textContent = "Total de ASADAS: " + distritos.rows.length;
		  distritos.rows.forEach(consulta => {
			  selectCant.innerHTML+="<tr><td>"+consulta.Nombre+"</td><td>"+
			  ""+consulta.Distrito+"</td><td>"+consulta.Canton+"</td><td>"+consulta.Provincia+"</td><td>"+
			  ""+consulta.valor.toFixed(0)+`</td><td class='text-center'><a href='/statsSubcomponentes/${consulta.Asada_ID}' ><i class='fas fa-info-circle' style='color: #325276' `+
			  `></i></a></td></tr>`;
		  });
	  });
}

function getTipoRiesgo (valor)
{

    if (valor < 47.0)
    {
      return 4	// usar color azul
    }
    else if (valor < 57.0)
    {
      return 3 // Usa color celeste
    }
    else if (valor < 67.0)
    {
      return 2 // Usa color verde
    }
    else if (valor < 77.0)
    {
      return 1 // Usa color amarillo
    }
    else
    {
      return 0	// Usa color rojo
    }
}

function pintarGrafico (graficoObj,tipoGrafico)
{
	var colores = ['rgba(234, 77, 70, 0.7)','rgba(232, 215, 75, 0.7)','rgba(72, 118, 90, 0.7)','rgba(22, 155, 220, 0.7)','rgba(22, 87, 205, 0.7)'];
	var riesgo = document.getElementById ("riesgo");
	graficoObj.data.datasets[0].backgroundColor = tipoGrafico == "radar" ? colores[getTipoRiesgo (riesgo.value)] : []
	graficoObj.data.datasets[0].pointBackgroundColor = []
	for (var i = 0; i < graficoObj.data.datasets[0].data.length; i++)
	{
		if (tipoGrafico == "radar")
		{
			graficoObj.data.datasets[0].pointBackgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);
		}
		else
		{
			graficoObj.data.datasets[0].backgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);

			if(tipoGrafico == "doughnut"){
				graficoObj.options.elements.center.color = colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])];
			}
		}
	}
	graficoObj.update();
}

// Plugin para texto dentro de grafico dona
// Recuperado de: https://stackoverflow.com/questions/20966817/how-to-add-text-inside-the-doughnut-chart-using-chart-js#43026361
Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      var ctx = chart.chart.ctx;

      // Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var maxFontSize = centerConfig.maxFontSize || 75;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      var words = txt.split(' ');
      var line = '';
      var lines = [];

      // Break words up into multiple lines if necessary
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (var n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  }
});