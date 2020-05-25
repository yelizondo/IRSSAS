var grafico = graficoNuevo ();

function aranna(value, tipo, anno, idchart = ""){
	var parameters = { "id": value, "tipo": tipo, "anno": anno};
    $.get('/getRiesgo',parameters,function(data) {
		var tipoRiesgo = getTipoRiesgo (data.riesgo[0].valor.toFixed(0));
		grafico.data.labels = data.componentes;
		grafico.data.datasets[0].label = data.nombre;
		grafico.data.datasets[0].data = data.valores.map(function(valor){return valor.toFixed(0)});
		grafico.update();
		pintarGrafico (grafico);
		document.getElementById ("riesgo").value = data.riesgo[0].valor.toFixed(0);
		document.getElementById ("tipoRiesgo").textContent = (["Muy Alto", "Alto", "Intermedio", "Bajo", "Muy bajo"])[tipoRiesgo];
	});
};

function graficoAranna()
{
	var url = new URL(document.URL);
	var param = url.searchParams.get("asada");
	document.getElementById("asada").value = param == null ? document.getElementById("asada").value : param;
	var value = document.getElementById("asada").value;
    aranna(value,"INDICADORXASADA",0)
};

function graficoNuevo (asada = "")
{
	return new Chart(document.getElementById("radar-chart"+asada), {
		type: (document.getElementById ("tipoGrafico") == null ? "bar" : document.getElementById ("tipoGrafico").value),
		data: {
		labels: null,
	
		datasets: [
			{
			label: null,
			fill: true,
			backgroundColor: "rgba(25,61,102,0.2)",
			borderColor: "rgba(25,61,102,1)",
			pointBorderColor: "#fff",
			pointBackgroundColor: "rgba(179,181,198,1)",
			pointRadius: 6,
			pointHoverRadius: 10,
			data: null
			}]
	
		},
		options: {
			title: {
				display: true,
				text: 'Nivel de Riesgo de la ASADA'
			},
			scale: //Extraido de: https://stackoverflow.com/questions/39249722/set-min-max-and-number-of-steps-in-radar-chart-js
			{
				ticks:
				{
					beginAtZero: true,
					max: 100,
					min: 0,
					stepSize: 10
				}
			}
	}});
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
        select.innerHTML="";
        jsonsites.annos.forEach(function(anno){
            select.innerHTML+="<option value='"+anno.anno+"'>"+anno.anno+"</option>";
        });
        document.getElementById("buttonAnno").value= jsonsites.anno;
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
            select.innerHTML+="<td>"+pregunta.pregunta+"</td><td>"+pregunta.respuesta+"</td>";
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

function generarPDFInformeMejora(){
	$("#prueba").show();
    var asada = document.getElementById("asada").value;
	var values_list = asada.split(",");
	textosMejora = "";	
	//var indicadores = ["<h4> Existe sistema de tratamiento individual de aguas negras en la comunidad</h4><br>" ,"<h4> Existe presencia de aguas grises en los caños de recolección de agua lluvia</h4><br>" ,"<h4> Población cuenta con alcantarillado pluvial</h4><br>" ,"<h4> La población tiene Planta de tratamiento de aguas residuales</h4><br>" ,"<h4> Porcentaje de  liquidez para invertir en mejoras del acueducto</h4><br>" ,"<h4> % Cobertura de recolección de residuos sólidos no valorizables</h4><br>" ,"<h4> Existe recolección de residuos valorizables </h4><br>" ,"<h4> Producción per cápita de residuos sólidos</h4><br>","<h4> Inversión anual en Gestión Integral de Residuos Sólidos por persona por año en el cantón ($/persona/año) </h4><br>","<h4> Inversión anual en la limpieza de vías y áreas comunes por persona en el cada cantón ($/persona/año) </h4><br>","<h4> La ubicación de la captación está en área protegida o en zona de conservación</h4><br>" ,"<h4> Está demarcada la zona de protección legalmente</h4><br>" ,"<h4> Se cuenta con información del balance hídrico</h4><br>" ,"<h4> Consumo promedio de agua de la comunidad expresado en unidades de litros por persona por día </h4><br>" ,"<h4> La ASADA posee plan de atención integral de riesgos</h4><br>" ,"<h4> Cuentan con programas para adaptación al cambio climático</h4><br>" ,"<h4> Posee registros de aforos de las fuentes de abastecimiento</h4><br>" ,"<h4> Se diagnóstica el riesgo en los componentes del acueducto mediante la herramienta SERSA </h4><br>","<h4> La ASADA posee sistema de desinfección </h4><br>","<h4> Posee planta potabilizadora </h4><br>","<h4> Posee la ASADA sello de calidad sanitaria</h4><br>" ,"<h4> Porcentaje (%) de Morosidad en el pago del servicio de agua</h4><br>" ,"<h4> Porcentaje (%) de agua no contabilizada </h4><br>" ,"<h4> Índice de Desarrollo Social en MIDEPLAN </h4><br>" ,"<h4> Posee distinción de Bandera Azul ecológica (en la comunidad, microcuencas y municipalidades)</h4><br>" ,"<h4> Los operadores han desarrollado programas de educación ambiental para la comunidad y los imparten regularmente (una vez al año)</h4><br>" ,"<h4> ¿Posee su acueducto riesgo de inundación</h4><br>" ,"<h4> Posee su acueducto riesgo de deslizamientos </h4><br>","<h4> Posee su acueducto riesgos volcánicos </h4><br>","<h4> Su acueducto está ubicado zonas sísmicas </h4><br>"];
	var lorem = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec dictum magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent ut augue id purus egestas porta. Suspendisse potenti. Nam id aliquet eros, vel pretium risus. Sed at sem id libero maximus viverra et ut sapien. Fusce et venenatis nulla. Ut nec porta mi, in euismod nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam convallis sodales augue. Pellentesque facilisis, quam quis porta commodo, purus tortor tempor sem, quis pharetra leo turpis at arcu. Quisque consequat, sapien non ornare congue, elit mi pellentesque est, vel elementum lectus erat vitae tortor. Suspendisse ex justo, pretium ut convallis non, congue a elit. </p><br>"
	var count = 0;
	$.get(`./generarInformeMejora/getInforme/:${values_list[0]}`,{},function(data){
		//console.log(data);
	}).done(function(mejoras){
		//console.log(typeof(mejoras));
		//console.log(mejoras);
		mejoras.mejoras.forEach(mejora=>
		{

			console.log(mejora.TEXTO_MEJORA);
			textosMejora = textosMejora + 
			"<h4>"+mejora.Nombre+"</h4>" +
			"<p><b>Mi Respuesta:</b>" + mejora.Texto +"</p>"+
			"<p> <b>Recomendación:</b>"+mejora.TEXTO_MEJORA+"</p><br>";
			count = count + 1;
		});
		$("#prueba").html(
			"<div id="+values_list[0]+">"+
			"<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" 
			+ lorem + textosMejora +"</div>"
		
	
			);
		
	});       

	$("#downloadpdf").show();
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
			'elementHandlers': specialElementHandlers
		});
	//});
	pdfdoc.save('informe-mejora.pdf');
	
};

function getEstadisticas(){
	var parameters = { "provincia": document.getElementById("prov").value, "canton": document.getElementById("cant").value, "distrito": document.getElementById("dist").value, "orden": document.getElementById("ord").value};
	var distritos;
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
			  ""+consulta.valor.toFixed(2)+"</td><td><i class='glyphicon glyphicon-leaf' style='color: #325276' "+
			  `onclick="location.href='/statsSubcomponentes/${consulta.Asada_ID}'"></i></td></tr>`;
		  });
	  });
}

function getTipoRiesgo (valor)
{
    
    if (valor < 47.0)
    {
      return 4
    }
    else if (valor < 57.0)
    {
      return 3
    }
    else if (valor < 67.0)
    {
      return 2
    }
    else if (valor < 77.0)
    {
      return 1
    }
    else
    {
      return 0
    }
}

function pintarGrafico (graficoObj)
{
	var colores = ['rgba(234, 77, 70, 0.7)','rgba(232, 215, 75, 0.7)','rgba(72, 118, 90, 0.7)','rgba(22, 155, 220, 0.7)','rgba(22, 87, 205, 0.7)'];
	var riesgo = document.getElementById ("riesgo");
	var tipoGrafico = document.getElementById ("tipoGrafico");
	graficoObj.data.datasets[0].backgroundColor = tipoGrafico != null && tipoGrafico.value == "radar" ? colores[getTipoRiesgo (riesgo.value)] : []
	graficoObj.data.datasets[0].pointBackgroundColor = []
	for (var i = 0; i < graficoObj.data.datasets[0].data.length; i++)
	{
		if (tipoGrafico != null && tipoGrafico.value == "radar")
		{
			graficoObj.data.datasets[0].pointBackgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);
		}
		else
		{
			graficoObj.data.datasets[0].backgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);
		}
	}
	graficoObj.update();
}