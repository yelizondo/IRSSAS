let asadas = {};
let borrados = {};
function deleteAsada(row_id){
    Swal.fire({
        title: '¿Desea eliminar la ASADA de esta asociación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            let ID = $(`#asada_row_id_${row_id}_ID`).html();
            let nombre = $(`#asada_row_id_${row_id}_name`).html();
            $(`#asada_row_id_${row_id}`).remove();
            $('#asadaID').append(`<option value="${ID}">${nombre}</option>`)
            borrados[ID] = {ID: ID, Nombre: nombre};
            delete asadas[ID];
        }
    });
}

function insertAsociacion(){
    Swal.fire({
        title: '¿Desea guardar la asociación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            let lista = Object.keys(asadas);
            if(lista.length === 0){
                Swal.fire({
                    title: 'No se han agregado ASADAS a la asociación',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            if(!$('#Nombre').val()){
                Swal.fire({
                    title: 'La asociación no tiene un nombre',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            console.log(lista);
            let nombre = $('#Nombre').val();
            $.post('/asociaciones/crear',{nombre: nombre, asadas: JSON.stringify(lista)},function(data){})
            .done(function(res){
                Swal.fire({
                    title: `Se ha guardado la asociación "${nombre}" con éxito`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'De acuerdo'
                }).then((result) => {
                    window.location.replace("/asociaciones");
                });
            })
            .fail(function(res){
                Swal.fire('Error', 'Los cambios no fueron aplicados', 'error');
            });
        }
    });
}
function editarAsociacion(){
    Swal.fire({
        title: '¿Desea guardar la asociación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            let lista = Object.keys(asadas);
            let listaBorradas = Object.keys(borrados);
            if($('#asada_table_body').children().length==0){
                Swal.fire({
                    title: 'No se han agregado ASADAS a la asociación',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            if(!$('#Nombre').val()){
                Swal.fire({
                    title: 'La asociación no tiene un nombre',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            console.log(lista);
            let nombre = $('#Nombre').val();
            let url = window.location.href;
            if(url.endsWith('/')){
                url = url.substr(0, url.length-1);
            }
            let asociacion = url.substr(url.lastIndexOf('/')+1);
            $.post(`/asociaciones/editar/${asociacion}`,{nombre: nombre, asadas: JSON.stringify(lista), borrados: JSON.stringify(listaBorradas)},function(data){})
            .done(function(res){
                Swal.fire({
                    title: `Se ha actualizado la asociación "${nombre}" con éxito`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'De acuerdo'
                }).then((result) => {
                    window.location.replace(`/asociaciones/editar/${asociacion}`);
                });
            })
            .fail(function(res){
                Swal.fire('Error', 'Los cambios no fueron aplicados', 'error');
            });
        }
    });
}
$(document).ready(function () {
    $('#btn-add-asada').click(function(e){
        e.preventDefault();
        let ID = $('#asadaID').val();
        let nombre = $('#asadaID option:selected').text();
        $('#asadaID option:selected').remove();
        let row = `<tr id="asada_row_id_${ID}">
                        <td id="asada_row_id_${ID}_ID">${ID}</td>
                        <td id="asada_row_id_${ID}_name">${nombre}</td>
                        <td><button class="btn" onclick="location.href='/asadas/${ID}';"><i class="fas fa-info-circle" style="color: #325276"></i></button></td>
                        <td><button class="btn" onclick="deleteAsada('${ID}');"><i class="fas fa-trash text-danger"></i></button></td></td>
                    </tr>`;
        $('#asada_table_body').append(row);
        delete borrados[ID];
        asadas[ID] = {ID: ID, Nombre: nombre};
    });
    $('#savebutton').click(function(e){
        insertAsociacion();
    });
    $('#savebutton-editar').click(function(e){
        editarAsociacion();
    });
});


