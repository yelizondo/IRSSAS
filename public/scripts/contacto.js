


var provincia;
var canton;
var distrito;



function FiltrarProvincia() {
    provincia = document.getElementById("prov").value;
    getCanton();
    if (provincia == 0)
        $(".panel").show();
    else {
        $(".panel").hide();
        $("div").find(`[data-provincia='${provincia}']`).show();
    }
}

function FiltrarCanton(id) {
    canton = document.getElementById("cant").value;
    getDistrito();
    if (canton == 0)
        FiltrarProvincia();
    else {
        $(".panel").hide();
        $("div").find(`[data-provincia='${provincia}']`).filter(`[data-canton='${canton}']`).show();
    }
}

function FiltrarDistrito(id) {
    distrito = document.getElementById("dist").value;
    if (distrito == 0)
        FiltrarCanton();
    else {
        $(".panel").hide();
        $("div").find(`[data-provincia='${provincia}']`).filter(`[data-canton='${canton}']`).filter(`[data-distrito='${distrito}']`).show();
    }
}