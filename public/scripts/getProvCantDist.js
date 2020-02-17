function getCanton(){
	var parameters = { "provincia": document.getElementById("prov").value};
	var cantones;
	$.get('/getCantones',parameters,function(data) {
		cantones = data;
	   }).done(function(res){       
		  var selectCant = document.getElementById("cant");
		  selectCant.innerHTML="<option value='0'>Sin filtro</option>";
		  cantones.rows.forEach(row => {
			  selectCant.innerHTML+="<option value='"+row.ID+"'>"+row.Nombre+"</option>";
		  });
		  document.getElementById("dist").innerHTML="<option value='0'>Sin filtro</option>";
	  });

}


function getDistrito(){
	var parameters = { "provincia": document.getElementById("prov").value, "canton": document.getElementById("cant").value};
	var distritos;
	$.get('/getDistritos',parameters,function(data) {
		distritos = data;
	   }).done(function(res){       
		  var selectCant = document.getElementById("dist");
		  selectCant.innerHTML="<option value='0'>Sin filtro</option>";
		  distritos.rows.forEach(row => {
			  selectCant.innerHTML+="<option value='"+row.ID+"'>"+row.Nombre+"</option>";
		  });
	  });

}

function getAsada()
{
	var provincia = document.getElementById("prov");
	var canton = document.getElementById("cant");
	var distrito = document.getElementById("dist");
	var asadas = document.getElementById("asada");
	for(var i = 1; i < asadas.children.length; i++)
	{
		asadas[i].hidden = !(asadas[i].attributes.provincia.value == provincia.value && asadas[i].attributes.canton.value == canton.value && asadas[i].attributes.distrito.value == distrito.value);
	}
}