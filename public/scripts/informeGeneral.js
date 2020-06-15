var provincias = []
var cantones = []
var distritos = []
var asadas = []
var tipoInforme = 1
var previousBtn = null

function cambiarTipoInformeGeneral(pTipoInforme, button)
{
    tipoInforme = pTipoInforme
    if(previousBtn)
    {
        previousBtn.classList.remove("tipoInforme")
    }
    previousBtn = button
    button.classList.add("tipoInforme")

    switch(pTipoInforme)
    {
        case 1: //provincia
        {
            provincias = []
            document.getElementById("canton-select").hidden = true;
            document.getElementById("distrito-select").hidden = true;
            document.getElementById("asada-select").hidden = true;
            break;
        } //end case
        case 2: //canton
        {
            provincias = []
            cantones = []
            document.getElementById("canton-select").hidden = false;
            document.getElementById("distrito-select").hidden = true;
            document.getElementById("asada-select").hidden = true;
            break;
        } //end case
        case 3: //distrito
        {
            distritos = []
            document.getElementById("canton-select").hidden = false;
            document.getElementById("distrito-select").hidden = false;
            document.getElementById("asada-select").hidden = true;
            break;
        } //end case
        case 4: //asada
        {
            asadas = []
            document.getElementById("canton-select").hidden = false;
            document.getElementById("distrito-select").hidden = false;
            document.getElementById("asada-select").hidden = false;
            break;
        } //end case
        default:
        {
            tipoInforme = 1
            provincias = []
            document.getElementById("canton-select").hidden = true;
            document.getElementById("distrito-select").hidden = true;
            document.getElementById("asada-select").hidden = true;
            break;
        } //end default
    } //end switch
    document.getElementById("selectedInforme").innerHTML = "";
} //end cambiarTipoInformeGeneral

function add2Informe()
{
    switch(tipoInforme)
    {
        case 1: //provincia
        {
            provincias.push(document.getElementById("prov").value)
            //Obtenido de: https://developer.mozilla.org/es/docs/Web/API/HTMLTableElement/insertRow
            var tableRef = document.getElementById("selectedInforme");
            var newRow   = tableRef.insertRow();
            var newCell  = newRow.insertCell(0);
            var newText  = document.createTextNode(document.getElementById("prov").selectedOptions[0].innerText);
            newCell.appendChild(newText);
            break;
        } //end case
        case 2: //canton
        {
            provincias.push(document.getElementById("prov").value)
            cantones.push(document.getElementById("cant").value)
            //Obtenido de: https://developer.mozilla.org/es/docs/Web/API/HTMLTableElement/insertRow
            var tableRef = document.getElementById("selectedInforme");
            var newRow   = tableRef.insertRow();
            var newCell  = newRow.insertCell(0);
            var newText  = document.createTextNode(document.getElementById("prov").selectedOptions[0].innerText + '-' + document.getElementById("cant").selectedOptions[0].innerText);
            newCell.appendChild(newText);
            break;
        } //end case
        case 3: //distrito
        {
            distritos.push(document.getElementById("dist").value)
            //Obtenido de: https://developer.mozilla.org/es/docs/Web/API/HTMLTableElement/insertRow
            var tableRef = document.getElementById("selectedInforme");
            var newRow   = tableRef.insertRow();
            var newCell  = newRow.insertCell(0);
            var newText  = document.createTextNode(document.getElementById("prov").selectedOptions[0].innerText + '-' + document.getElementById("cant").selectedOptions[0].innerText + '-' + document.getElementById("dist").selectedOptions[0].innerText);
            newCell.appendChild(newText);
            break;
        } //end case
        case 4: //asada
        {
            asadas.push(`"${document.getElementById("asada").value}"`)
            var tableRef = document.getElementById("selectedInforme");
            var newRow   = tableRef.insertRow();
            var newCell  = newRow.insertCell(0);
            var newText  = document.createTextNode(document.getElementById("asada").selectedOptions[0].innerText);
            newCell.appendChild(newText);
        } //end case
        default:
        {
            break;
        } //end default
    } //end switch
} //end add2Informe

function removeFromInforme()
{
    switch(tipoInforme)
    {
        case 1: //provincia
        {
            provincias.pop()
            break;
        } //end case
        case 2: //canton
        {
            provincias.pop()
            cantones.pop()
            break;
        } //end case
        case 3: //distrito
        {
            distritos.pop()
            break;
        } //end case
        case 4: //asada
        {
            asadas.pop()
        } //end case
        default:
        {
            break;
        } //end default
    } //end switch
    document.getElementById("selectedInforme").deleteRow(-1);
} //end removeFromInforme

function requestInformeGeneral()
{
    document.getElementById("informeBody").innerHTML = ""
    var parameters =`{ "tipoInforme":${tipoInforme.toString()}, "provincias":[${provincias.toString()}], "cantones":[${cantones.toString()}], "distritos":[${distritos.toString()}], "asadas":[${asadas.toString()}] }`;
    
    Swal.fire(
    {
        title: "Cargando...",
        allowOutsideClick: () => !Swal.isLoading(),
        onBeforeOpen: ()=>
        {
            Swal.showLoading();
            $.post("/getInformeUsuarioGeneral", {"object":parameters}, function(data)
            {
                if(data.error)
                {
                    Swal.fire(
                    {
                        title: 'Error',
                        icon: 'error',
                        text: 'Ocurrió un error al generar el informe',
                        confirmButtonColor: '#1D2D51'
                    }) //end sweetFailure
                } //end if
                else
                {
                    Swal.fire(
                    {
                        title: 'Éxito',
                        icon: 'success',
                        text: 'El informe se generó exitosamente',
                        confirmButtonColor: '#1D2D51'
                    }) //end sweetSuccess
                    .then((result)=>
                    {
                        var tableRef = document.getElementById("informeBody");
                        
                        data.informeIRSSAS.forEach(function(consulta)
                        {
                            var newRow = tableRef.insertRow(-1);
                            //newRow.setAttribute("class", "row")
                            newRow.insertCell(-1).appendChild(document.createTextNode(consulta.nombre));
                            newRow.insertCell(-1).appendChild(document.createTextNode(consulta.poblacion));
                            newRow.insertCell(-1).appendChild(document.createTextNode(consulta.saneamiento.toFixed(0)));
                            newRow.insertCell(-1).appendChild(document.createTextNode(consulta.recursoHidrico.toFixed(0)));
                            newRow.insertCell(-1).appendChild(document.createTextNode(consulta.educacion.toFixed(0)));
                            newRow.insertCell(-1).appendChild(document.createTextNode(100 - consulta.desarrolloSoc.toFixed(0)));
                            newRow.insertCell(-1).appendChild(document.createTextNode(consulta.riesgoEvNat.toFixed(0)));
                            newRow.insertCell(-1).appendChild(document.createTextNode(consulta.irssas.toFixed(0)));
                        }) //end forEach
                        document.getElementById("informe").hidden = false;
                    }) //end then
                } //end else
            }) // end post
        }, //end onBeforeOpen
    }) //end sweetLoading
} //end requestInformeGeneral