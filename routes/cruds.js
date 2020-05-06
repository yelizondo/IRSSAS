module.exports = {
    // crear nueva asada

    getCrudAsadasR: (req, res) => {
        if (req.session.value == 1) {

            let query = "select a.ID,a.Nombre,p.Nombre as Provincia,c.Nombre as Canton,d.Nombre as Distrito,ai.Ubicacion, a.Estado as Estado from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID order by Provincia ASC, Canton ASC, Distrito ASC, a.Nombre ASC;";
            // execute query
            db.query(query, function (err, rows, fields) {
                if (!err) {
                    res.render('pages/crudAsadasR.ejs', { "rows": rows, "usuario": req.session.usuario })
                }
                else {
                    console.log('getCrudAsadasR. Error while performing Query.');
                    res.redirect('/');
                }
            });
        }
        else
            res.redirect('/');
    },

    getCrudAsadasU: (req, res) => {
        if (req.session.value == 1) {
            let query = "select a.ID,a.Latitud,a.Longitud,a.Nombre,p.Nombre as Provincia, a.Distrito_id,c.Nombre as Canton,d.Nombre as Distrito,ai.Ubicacion,ai.Telefono,ai.Poblacion,ai.Url,ai.cantAbonados, ai.Celular from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID and a.ID = '" + req.params.id + "' ;";
            let query2 = 'select concat(p.Nombre, " - ", c.Nombre, " - ", d.Nombre) as Distrito, d.Codigo from DISTRITO d inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID;';
            // execute query
            db.query(query, function (err, rows, fields) {
                if (!err) {
                    db.query(query2, function (err2, rows2, fields2) {
                        if (!err2) {
                            res.render('pages/crudAsadasU.ejs', { "asada": rows[0], "distritos": rows2, "usuario": req.session.usuario})
                        }
                        else {
                            console.log('getCrudAsadasU. Error while performing Query. ', err2);
                            res.redirect('/');
                        }
                    });
                }
                else {
                    console.log('getCrudAsadasU. Error while performing Query. ', err);
                    res.redirect('/');
                }
            });
        }
        else
            res.redirect('/');
    },


    getPresentAsada: (req, res) => {

        let query = "select a.ID,a.Nombre,p.Nombre as Provincia,c.Nombre as Canton,d.Nombre as Distrito,ai.Ubicacion,ai.Telefono,ai.Url from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID;";
        // execute query
        db.query(query, function (err, rows, fields) {
            if (!err) {
                res.render('pages/presentacionAsadas.ejs', { "rows": [], "asadas": rows, "usuario": req.session.usuario })
            }
            else {
                console.log('getPresentAsada. Error while performing Query.');
                res.redirect('/');
            }
        });

    },

    saveAsada: (req, res) => {
        if (req.session.value == 1) {

            var actualizados = req.query.actualizados;
            var updates = req.query.updates;
            var id_asada = req.query.id;

            let updateAsada;
            //hago los querys, valido si es int o varchar, se hace inner join al update, para trabajar lo 2 al mismo tiempo
            for (var i = 0; i < actualizados.length; i++) {
                updateAsada = "update ASADA a, ASADAINFO ai set ";
                updateAsada = updateAsada + actualizados[i] + " = '" + updates[i] + "' where a.ID = '" + id_asada + "' and ai.Asada_ID= '" + id_asada + "' ;";
                db.query(updateAsada);
            }



        }
        else
            res.redirect('/');
    },




    getCrudComponente: (req, res) => {
        if (req.session.value == 1) {

            let query = "select * from COMPONENTE;";
            // execute query
            db.query(query, function (err, rows, fields) {
                if (!err) {
                    res.render('pages/crudComponentes.ejs', { "rows": rows, "usuario": req.session.usuario })
                }
                else {
                    console.log('getCrudComponente. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');
    },

    saveComponente: (req, res) => {
        if (req.session.value == 1) {

            var nuevos = req.query.nuevos;
            var actualizados = req.query.actualizados;
            var borrados = req.query.borrados;


            if (!(borrados === undefined)) {
                borrados.forEach(function (element) {
                    db.query("delete from COMPONENTE where id=" + element + " ;");
                });
            }

            if (!(actualizados === undefined)) {

                actualizados.forEach(function (element) {
                    db.query("update COMPONENTE set nombre='" + element.nombre + "', valor=" + element.valor + " where id= " + element.id + ";");
                });
            }

            if (!(nuevos === undefined)) {
                nuevos.forEach(function (element) {
                    db.query("insert into COMPONENTE(nombre, valor) values('" + element.nombre + "'," + element.valor + " );");
                });
            }

            db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
            res.redirect('/componente');
        }
    },

    getCrudSubcomponente: (req, res) => {
        if (req.session.value == 1) {

            let query = "select s.*,c.nombre as Componente from SUBCOMPONENTE s inner join COMPONENTE c on s.componente_ID=c.ID;";
            let query2 = "select * from COMPONENTE;"
            // execute query
            db.query(query, function (err, rows, fields) {
                if (!err) {
                    db.query(query2, function (err2, rows2, fields2) {
                        if (!err) {
                            res.render('pages/crudSubcomponentes.ejs', { "rows": rows, "usuario": req.session.usuario, "comps": rows2 });
                        }
                        else {
                            console.log('getCrudSubcomponente. Error while performing Query.');
                            res.redirect('/');
                        }
                    });
                }
                else {
                    console.log('getCrudSubcomponente. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');
    },

    saveSubComponente: (req, res) => {
        if (req.session.value == 1) {

            var nuevos = req.query.nuevos;
            var actualizados = req.query.actualizados;
            var borrados = req.query.borrados;


            if (!(borrados === undefined)) {
                borrados.forEach(function (element) {
                    db.query("delete from SUBCOMPONENTE where id=" + element + " ;");
                });
            }

            if (!(actualizados === undefined)) {

                actualizados.forEach(function (element) {
                    db.query("update SUBCOMPONENTE set nombre='" + element.nombre + "', valor=" + element.valor + ", componente_ID=" + element.componente + ", siglas='" + element.siglas + "' where id= " + element.id + ";");
                });
            }

            if (!(nuevos === undefined)) {
                nuevos.forEach(function (element) {
                    db.query("insert into SUBCOMPONENTE(nombre, valor, componente_ID, siglas, cantpreguntas) values('" + element.nombre + "'," + element.valor + ", " + element.componente + ", '" + element.siglas + "', 0  );");
                });
            }

            db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    getCrudIndicador: (req, res) => {
        if (req.session.value == 1) {

            let query = "select i.ID, i.Codigo, i.Nombre, i.Valor*100 as Valor ," +
                "s.Nombre as Subcomponente from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID order by 2 ASC;";
            // execute query
            db.query(query, function (err, rows, fields) {
                if (!err) {
                    res.render('pages/crudIndicadoresR.ejs', { "rows": rows, "usuario": req.session.usuario });

                }
                else {
                    console.log('getCrudIndicador. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');
    },

    getIndicador: (req, res) => {
        if (req.session.value == 1) {

            let query = "select c.*,s.Nombre as Subcomponente, m.Nombre as Medida , i.Codigo, i.Nombre, i.Subcomponente_ID," +
                " i.Valor*100 as Valor , i.ID from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID inner join " +
                " MEDIDA m on i.Medida_ID=m.ID left join INDICADORINFO c on c.Indicador_ID=i.ID where i.id= " + req.params.id + " ;";
            // execute query
            let query2 = "select s.* from SUBCOMPONENTE s;"

            db.query(query, function (err, rows, fields) {
                if (!err) {
                    db.query(query2, function (err2, rows2, fields2) {
                        if (!err2) {
                            res.render('pages/crudIndicadoresU.ejs', { "indicador": rows[0], "usuario": req.session.usuario, "subs": rows2 });
                        } else {
                            console.log('getIndicador. Error while performing Query.');
                            res.redirect('/');
                        }
                    });
                }
                else {
                    console.log('getIndicador. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');
    },

    deleteIndicador: (req, res) => {
        if (req.session.value == 1) {

            var borrados = req.query.borrados;
            if (!(borrados === undefined)) {
                borrados.forEach(function (element) {
                    db.query("update SUBCOMPONENTE, INDICADOR i inner join SUBCOMPONENTE s on s.ID=i.Subcomponente_ID  set s.CantPreguntas=s.CantPreguntas-1 where i.ID=" + element + " ;");
                    db.query("delete from INDICADOR where id=" + element + " ;");
                });
            }

            db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    updateIndicador: (req, res) => {
        if (req.session.value == 1) {

            var actualizacion = req.query.actualizacion;
            var valores = req.query.valores;
            var id = req.query.indicador;
            var aux;


            if (!(actualizacion === undefined)) {

                for (var i = actualizacion.length - 1; i >= 0; i--) {
                    aux = valores[i];
                    if (actualizacion[i] == "Nombre")
                        db.query("update INDICADOR set " + actualizacion[i] + "= '" + valores[i] + "' where ID=" + id + " ;");

                    else if (actualizacion[i] == "Subcomponente") {


                        db.query("select i.Codigo, s.ID from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID where s.ID=" + valores[i] + " order by 1 DESC;",
                            function (err, rows, fields) {
                                if (!err) {
                                    if (rows.length != 0) {

                                        var k = rows[0].Codigo.split("-");
                                        db.query("update INDICADOR set Codigo= '" + k[0] + "-" + (parseInt(k[1]) + 1) + "' where ID=" + id + " ;");
                                        return true;
                                    }
                                    else {

                                        db.query("select Siglas from SUBCOMPONENTE where ID=" + aux + " ;", function (err2, rows2, fields2) {
                                            if (!err2) {
                                                db.query("update INDICADOR set Codigo= '" + rows2[0].Siglas + "-1' where ID=" + id + " ;");
                                            }
                                        });
                                    }

                                } else {

                                }
                            });

                        db.query("update SUBCOMPONENTE, INDICADOR i inner join SUBCOMPONENTE s on s.ID=i.Subcomponente_ID  set s.CantPreguntas=s.CantPreguntas-1 where i.ID=" + id + " ;");
                        db.query("update INDICADOR set Subcomponente_ID= '" + valores[i] + "' where ID=" + id + " ;");
                        db.query("update SUBCOMPONENTE set cantpreguntas= cantpreguntas+1 where id=" + valores[i] + " ;");
                    }

                    else {
                        db.query("update IndicadorInfo set " + actualizacion[i] + "= '" + valores[i] + "' where Indicador_ID=" + id + " ;");
                    }
                }

            }

            db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.Valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
        }
    },

    newIndicador: (req, res) => {
        if (req.session.value == 1) {

            let query = "select * from MEDIDA ;";
            let query2 = "select * from SUBCOMPONENTE;"

            db.query(query, function (err, rows, fields) {
                if (!err) {
                    db.query(query2, function (err2, rows2, fields2) {
                        if (!err2) {
                            res.render('pages/crudIndicadoresC.ejs', { "usuario": req.session.usuario, "subs": rows2, "meds": rows });
                        } else {

                            res.redirect('/');
                        }
                    });
                }
                else {
                    console.log('newIndicador. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');
    },

    createIndicador: (req, res) => {
        var codigo = "";
        var aux = req.body.Subcomponente_ID.split("-");
        function getCode(aux, cb) {
            db.query("select i.Codigo, s.ID from INDICADOR i inner join SUBCOMPONENTE s on i.Subcomponente_ID=s.ID where s.ID=" + aux[1] + " order by 1 DESC;",
                function (err, rows, fields) {
                    if (!err) {
                        if (rows.length != 0) {
                            var k = rows[0].Codigo.split("-");
                            cb(k[0] + "-" + (parseInt(k[1]) + 1));
                        }
                        else {
                            cb(aux[0].replace("\r\n", "") + "-1");
                        }

                    } else {

                    }
                });
        }
        getCode(aux, function (code) {
            db.query("insert into INDICADOR(Codigo,Subcomponente_ID,Medida_ID,Nombre,Valor) values('" + code + "'," + aux[1] + "," + req.body.Medida_ID + ",'" + req.body.Nombre + "',0);", function (err, rows, fields) {
                if (req.body.Medida_ID != "1")
                    db.query("insert into LINEAL(Indicador_ID,Pendiente,Ordenada) select ID," + req.body.Pendiente + "," + req.body.Ordenada + " from INDICADOR where Codigo='" + code + "' ;");
                if (req.body.Medida_ID == "4") {
                    var x = parseInt(req.body.contador);
                    for (var i = 1; i <= x; i++) {
                        db.query("insert into NOMINAL(Indicador_ID,Simbolo,Valor,Porcentaje) select ID,'" + req.body["Nominal-1-" + i] + "'," + req.body["Nominal-2-" + i] + "," + req.body["Nominal-3-" + i] + " from INDICADOR where Codigo='" + code + "' ;");
                    }
                }
                var query = "insert into INDICADORINFO(Indicador_ID,Descripcion,Formula,Fuente,URL,Responsable,Periodo,Observaciones,Frecuencia) " +
                    " select ID,'" + req.body.Descripcion + "','" + req.body.Formula + "','" + req.body.Fuente + "','" + req.body.Url + "','" + req.body.Responsable + "','" + req.body.Periodo + "','" + req.body.Observaciones + "','" + req.body.Frecuencia + "' " +
                    " from INDICADOR where Codigo='" + code + "' ;"
                db.query(query);
                db.query("update SUBCOMPONENTE set cantpreguntas=cantpreguntas+1 where ID=" + aux[1] + " ;", function (err2, rows2, fields2) {
                    if (!err2) {
                        db.query("update INDICADOR i, SUBCOMPONENTE s, COMPONENTE c  set i.valor=(c.valor*s.valor)/(s.cantpreguntas*10000) where i.ID>0 and i.Subcomponente_ID=s.ID and s.Componente_ID=c.ID;");
                    }
                });

            });
        });
        res.redirect('/indicador');
    },

    getCrudUsuario: (req, res) => {
        if (req.session.value == 1) {

            let query = "select * from USUARIO;";
            // execute query
            db.query(query, function (err, rows, fields) {
                if (!err) {
                    res.render('pages/crudUsuarios.ejs', { "rows": rows, "usuario": req.session.usuario })
                }
                else {
                    console.log('getCrudUsuario. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');
    },

    newAsada: (req, res) => {
        if (req.session.value == 1) {

            let query = "select concat(p.Nombre, ' - ', c.Nombre, ' - ', d.Nombre) as Distrito, d.Codigo from DISTRITO d inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on  p.ID=c.Provincia_ID where d.Provincia_ID=p.ID ;";

            db.query(query, function (err, rows, fields) {
                if (!err) {
                    res.render('pages/crudAsadasC.ejs', { "usuario": req.session.usuario, "distritos": rows });
                }
                else {
                    console.log('newAsada. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');

    },


    createAsada: (req, res) => {
        let query = "insert into ASADA(ID,Nombre,Distrito_ID,Latitud,Longitud) values('" + req.body.ID + "','" + req.body.Nombre + "'," + req.body.Distrito_ID + ",'" + req.body.Latitud + "','" + req.body.Longitud + "') ;";
        db.query(query, function (err, rows, fields) {
            if (!err) {
                let query2 = "insert into ASADAINFO(Asada_ID,Ubicacion,Telefono,Poblacion,Url,cantAbonados) values((SELECT ID FROM ASADA WHERE DISTRITO_ID = " + req.body.Distrito_ID + " ORDER BY 1 DESC LIMIT 1 ),'" + req.body.Ubicacion + "'," +
                    "'" + req.body.Telefono + "','" + req.body.Poblacion + "','" + req.body.Url + "','" + req.body.cantAbonados + "') ;";
                db.query(query2);
            }
            else {
                console.log('createAsada. Error while performing Query.');
                res.redirect('/asadas');
            }
        });
        res.redirect('/asadas');
    },


    deleteAsada: (req, res) => {
        if (req.session.value == 1) {

            var borrados = req.query.borrados;
            if (!(borrados === undefined)) {
                borrados.forEach(function (element) {
                    db.query("delete from ASADA where id='" + element + "' ;");
                });
            }
        }
    },

    updateEstado: (req, res) => {
        if (req.session.value == 1) {

            var id = req.query.id;
            var estado = req.query.estado;

            db.query(`UPDATE ASADA SET Estado = ${estado} WHERE ID='${id}'`, function (err) {
                res.send(!err);
            });
        }
    },

    changePassword: (req, res) => {

        var usuario = req.query.usuario;
        var clave = req.query.clave;
        var clavenueva = req.query.clavenueva;

        db.query(`SELECT COUNT(*) AS CANTIDAD FROM USUARIO WHERE USUARIO = '${usuario}'`, function (err, rows) {
            if (!err) {
                if (rows[0].CANTIDAD == 0)
                    res.send("El usuario no existe");
                else {
                    db.query(`SELECT COUNT(*) AS CANTIDAD FROM USUARIO WHERE USUARIO = '${usuario}' AND CONTRASENNA = '${clave}'`, function (err2, rows2) {
                        if (!err2) {
                            if (rows2[0].CANTIDAD == 0)
                                res.send("La clave actual es incorrecta");
                            else {
                                db.query(`UPDATE USUARIO SET CONTRASENNA = '${clavenueva}' WHERE USUARIO = '${usuario}'`, function (err3) {
                                    if (err3)
                                        res.send(err3);
                                    else
                                        res.send(true);
                                });
                            }
                        }
                        else
                            res.send("changePassword. Error while performing Query");
                    });
                }
            }
            else
                res.send("changePassword. Error while performing Query");
        });
    },

    forgetPassword: (req, res) => {
        var usuario = req.query.usuario;
        db.query(`SELECT COUNT(*) AS CANTIDAD FROM USUARIO WHERE USUARIO = '${usuario}'`, function (err, rows) {
            if (!err) {
                if (rows[0].CANTIDAD == 0)
                    res.send("El usuario no existe");
                else {
                    let code = Math.floor(Math.random() * 10000).toString(10).padStart(4, "0");
                    db.query(`UPDATE USUARIO SET CONTRASENNA = '${code}' WHERE USUARIO = '${usuario}'`, function (err2) {
                        if (!err2) {
                            var mailOptions = {
                                from: 'guaposdecomu@gmail.com',
                                to: usuario,
                                subject: 'Recuperación de contraseña',
                                text: `La nueva contraseña es: ${code}`
                            };
                            transporter.sendMail(mailOptions, function (error) {
                                if (error)
                                    res.send(error);
                                else
                                    res.send(true);
                            });
                        }
                        else
                            res.send(err2);
                    });
                }
            }
            else
                res.send("forgetPassword. Error while performing Query");
        });

    },

    crudFormularios: (req, res) => {
        if (req.session.value == 1) {
            let query = "select i.ID as ID , Codigo , SUBCOMPONENTE_ID , MEDIDA_ID , Nombre , Valor, MINIMO, MAXIMO from INDICADOR i left join RANGOXINDICADOR ri on (i.ID = ri.INDICADOR_ID);";
            let query2 = "select * from NOMINAL;";
            let query3 = "select a.ID,a.Nombre,p.ID as Provincia,c.ID as Canton,d.ID as Distrito from ASADA a inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID "
            let query4 = "select * from PROVINCIA  order by nombre;"

            if (req.session.usuario.Tipo == 2)
                query3 += " and a.ID='" + req.session.usuario.Asada_ID + "' ;";
            db.query(query, function (err, rows, fields) {
                if (!err)
                {
                    db.query(query2, function (err2, rows2, fields2)
                    {
                        if (!err2)
                        {
                            db.query(query3, function (err3, rows3, fields3)
                            {
                                if (!err3)
                                {
                                    db.query(query4, function (err4, rows4, fields)
                                    {
                                        if (!err4)
                                        {
                                            res.render('pages/crudFormularios.ejs', { "usuario": req.session.usuario, "indicadores": rows, "nominales": rows2, "asadas": rows3, "prov": rows4 });
                                        }
                                        else
                                        {
                                            console.log("crudFormularios. Error while performing query4.\n" + err4)
                                            res.redirect('/');
                                        }
                                    })
                                }
                                else
                                {
                                    console.log("crudFormularios. Error while performing query3.\n" + err3)
                                    res.redirect('/');
                                }
                            });
                        }
                        else
                        {
                            console.log("crudFormularios. Error while performing query2.\n" + err2)
                            res.redirect('/');
                        }
                    });
                }
                else
                {
                    console.log("crudFormularios. Error while performing query.\n" + err)
                    res.redirect('/');
                }
            });
        }
        else
        {
            res.redirect('/');
        }
    },

    sendForm: (req, res) => {
        var contador = 0.0;
        db.query("select * from LINEAL;", function (err, rows, fields) {
            if (!err) {
                req.body.asada = req.body.asada === undefined ? req.session.usuario.Asada_ID : req.body.asada;
                IDs = [];
                var lista = req.body.ocultos.split(",");
                rows.forEach(function (row) {
                    IDs.push(row.INDICADOR_ID + "");
                }) //end forEach
                keys = Object.keys(req.body);
                keys.pop();
                keys.pop();
                keys.pop();

                db.query("insert into HISTORICORESPUESTA select * from INDICADORXASADA where Asada_ID = '" + req.body.asada + "';");
                db.query("delete from HISTORICORESPUESTA where Asada_ID = '" + req.body.asada + "' and anno = '" + req.body.anno + "';");
                db.query("delete from INDICADORXASADA where Asada_ID = '" + req.body.asada + "';");

                var query = "insert into INDICADORXASADA (anno, Indicador_ID, Asada_ID, Valor, Texto) values ";
                for (var i = 0; i < keys.length; i++) {
                    if (i > 0) {
                        query += ", ";
                    }
                    query += "('" + req.body.anno + "','" + keys[i] + "','" + req.body.asada + "','";
                    var x = IDs.indexOf(keys[i]);
                    if (x != -1) {
                        var exp = parseFloat(req.body[keys[i]]) * parseFloat(rows[x].Pendiente) + parseFloat(rows[x].Ordenada)
                        query += "" + (1 / (1 + Math.pow(Math.E, exp)));
                    } //end if
                    else {
                        query += req.body[keys[i]]
                    } //end else
                    query += "','" + lista[i + 1] + "')"
                } //end for
                query += ";"
                db.query(query, function (err, rows, fields) {
                    if (err)
                    {
                        console.log("sendForm. Error while performing query.\n" + err);
                    } //end if
                    res.redirect("/grafico?asada=" + req.body.asada);
                }); //end query
            } //end if
            else {
                res.redirect('/');
            }
        }); //end query
    },

    saveUsuario: (req, res) => {
        if (req.session.value == 1) {
            var nuevos = req.query.nuevos;
            var actualizados = req.query.actualizados;
            var borrados = req.query.borrados;

            if (!(borrados === undefined)) {
                borrados.forEach(function (element) {
                    db.query("delete from USUARIO where id= " + element + ";");
                });
            }

            if (!(actualizados === undefined)) {
                actualizados.forEach(function (element) {
                    db.query("update USUARIO set nombre='" + element.nombre + "', usuario='" + element.usuario + "', contrasenna='" + element.contrasenna + "', tipo='" + element.tipo + "' where id= " + element.id + ";");
                });
            }

            if (!(nuevos === undefined)) {
                nuevos.forEach(function (element) {
                    db.query("insert into USUARIO(nombre, usuario, contrasenna, tipo) values('" + element.nombre + "', '" + element.usuario + "', '" + element.contrasenna + "', '" + element.tipo + "');");
                });
            }
        }
    },

    getUsuariosAsadas: (req, res) => {
        if (req.session.value == 1) {
            db.query("select u.*,ua.Asada_ID,a.Nombre as Asada from USUARIO u left join USUARIOXASADA ua on u.ID=ua.Usuario_ID left join ASADA a on ua.Asada_ID=a.ID where u.tipo=2;", function (err, rows, fields) {
                if (!err) {
                    db.query("select a.ID, a.Nombre from ASADA a;", function (err2, rows2, fields2) {
                        res.render('pages/crudUsuariosAsadas.ejs', { "usuario": req.session.usuario, "usuarios": rows, "asadas": rows2 });
                    });
                } else {
                    console.log("Error while performing Query.")
                    res.redirect("/");
                }
            });
        } else {
            res.redirect("/");
        }
    },

    setUsuariosAsada: (req, res) => {
        function cargar(usuario, asada) {
            db.query("insert into USUARIOXASADA values (" + usuario + ",'" + asada + "');", function (err, rows, fields) {
                if (err) {
                    let query = "update USUARIOXASADA set Asada_ID='" + asada + "' where Usuario_ID=" + usuario + " ;";
                    db.query(query, function (err2, rows2, fields2) {
                    });
                }
            });
        }
        var rows = req.query.UsuarioAsada;
        for (var i = 0; i < rows.length; i++) {
            var usuario = rows[i].Usuario_ID;
            var asada = rows[i].Asada_ID;
            cargar(usuario, asada);
        }
    },

    guardarFormulario: (req, res) => {
        db.query("delete from TEMPRESPUESTAFORM where ANNO = '" + req.query.anno + "' and ASADA_ID = '" + req.query.asada + "'");
        var query = "insert into TEMPRESPUESTAFORM (ANNO, INDICADOR_ID, ASADA_ID, TEXTO) values "
        var flag = false;
        for (var i = 1; i < req.query.respuestas.length; i++) {
            if (req.query.respuestas[i] != "") {
                if (flag) {
                    query += ", "
                } //end if
                query += "('" + req.query.anno + "', '" + req.query.indicadores[i] + "', '" + req.query.asada + "', '" + req.query.respuestas[i] + "')";
                flag = true;
            } //end if
        } //end for
        query += ";"
        var response = { "exito": flag, "error": null };
        if (flag) {
            db.query(query, function (err, rows, fields) {
                response.error = err;
                res.send(response);
            }) //end query
        } //end if
        else {
            response.error = "No hay preguntas que guardar";
            res.send(response);
        } //end else
    }, //end guardarFormulario

    cargarFormulario: (req, res) => {
        var query = "select INDICADOR_ID, TEXTO from TEMPRESPUESTAFORM where ASADA_ID = '" + req.query.asada + "' and ANNO = '" + req.query.anno + "';"
        db.query(query, function (err, rows, fields) {
            res.send(rows);
        }) //end query
    }, //end cargarFormulario

    getContacto: (req, res) => {
        let query = "select a.ID,a.Nombre,p.ID as Provincia,c.ID as Canton,d.ID as Distrito,ai.Ubicacion,ai.Telefono from ASADA a left join ASADAINFO ai on a.ID=ai.Asada_ID inner join DISTRITO d on a.distrito_id=d.Codigo inner join CANTON c on d.Canton_ID=c.ID inner join PROVINCIA p on p.ID=c.Provincia_ID where d.Provincia_ID=p.ID order by Provincia ASC, Canton ASC, Distrito ASC, a.Nombre ASC;";
        let query2 = "select ID, Nombre from PROVINCIA";
        let query3 = "select ID, Nombre from CANTON";
        let query4 = "select ID, Nombre from DISTRITO";

        // execute query
        db.query(query, function (err, rows, fields) {
            if (!err) {
                db.query(query2, function (err2, rows2, fields2) {
                    if (!err2) {
                        res.render('pages/contacto.ejs', { "rows": rows, "provincias": rows2 })

                    }
                    else {
                        console.log('getContacto. Error while performing Query. ', err2);
                        res.redirect('/');
                    }
                });
            }
            else {
                console.log('getContacto. Error while performing Query.');
                res.redirect('/');
            }
        });
    },

    sendSolicitudRegistroAsada: (req, res) =>
    {
        var insertarAsada = "insert into SOLICITUDASADA (nombre, distrito_id, latitud, longitud, asociacion) values (?, ?, ?, ?, ?);";
        var insertarAsadaValues = [req.body.nombre, req.body.distrito, req.body.latitud, req.body.longitud, req.body.asociacion];

        var id_asada = 0;
        var insertarAsadaInfo = "insert into SOLICITUDASADAINFO (asada_id, ubicacion, telefono, poblacion, url, cantAbonados, celular) values (?, ?, ?, ?, ?, ?, ?);";
        var insertarAsadaInfoValues = [id_asada, req.body.ubicacion, req.body.telefono, req.body.poblacion, req.body.url, req.body.cantAbonados, req.body.celular];

        var insertarUsuario = "insert into SOLICITUDUSUARIO (nombre, usuario, asada_id) values (?, ?, ?);";
        var insertarUsuarioValues = [req.body.administrador, req.body.usuario, id_asada];
        
        db.beginTransaction(function(error)
        {
            if(error)
            {
                console.log("solicitudAsada. Error while performing beginTransaction.\n" + error);
                res.send({"error": true});
            } //end if
            db.query(insertarAsada, insertarAsadaValues, function(err, rows, fields)
            {
                if(err)
                {
                    console.log("solicitudAsada. Error while performing query insertarAsada.\n" + err);
                    db.rollback();
                    res.send({"error": true});
                } //end if
                else
                {
                    id_asada = rows.insertId;
                    insertarAsadaInfoValues[0] = id_asada;
                    db.query(insertarAsadaInfo, insertarAsadaInfoValues, function(err2, rows2, fields2)
                    {
                        if(err2)
                        {
                            console.log("solicitudAsada. Error while performing query insertarAsadaInfo.\n" + err2);
                            db.rollback();
                            res.send({"error": true});
                        } //end if
                        else
                        {
                            insertarUsuarioValues[2] = id_asada;
                            db.query(insertarUsuario, insertarUsuarioValues, function(err3, rows3, fields3)
                            {
                                if(err3)
                                {
                                    console.log("solicitudAsada. Error while performing query insertarUsuario.\n" + err3);
                                    db.rollback();
                                    res.send({"error": true});
                                } //end if
                                else
                                {
                                    var mailOptions = {
                                        from: 'irssastec@gmail.com',
                                        to: req.body.usuario,
                                        subject: 'Solicitud de registro de ASADA',
                                        text: `Buenas, ${req.body.administrador}\nSu solicitud está siendo procesada por los administradores de la aplicación.\nSaludos cordiales`
                                    };
                                    transporter.sendMail(mailOptions, function (error) {
                                        if (error)
                                        {
                                            console.log("solicitudAsada. Error enviando correo.\n" + error);
                                            db.rollback();
                                            res.send({"error": true});
                                        } //end if
                                        else
                                        {
                                            db.commit();
                                            res.send({"error": false});
                                        } //end else
                                    }); //end sendMail
                                } //end else
                            }) //end insertarUsuario
                        } //end else
                    }) //end insertarAsadaInfo
                } //end else
            }); //end insertarAsada
        }); //end transaction
    }, //end sendSolicitudRegistroAsada

    aceptarRechazarSolicitudRegistroAsada: (req, res)=>
    {
        var updateSolicitudAsada = "update SOLICITUDASADA set pendiente = ? where id = ?;";
        var updateSolicitudAsadaValues = [req.body.respuesta, req.body.idSolicitud];
        db.query("START TRANSACTION;", function(error, row, field)
        {
            db.query(updateSolicitudAsada, updateSolicitudAsadaValues, function(err, rows, fields)
            {
                if(err)
                {
                    console.log("aceptarRechazarSolicitudRegistroAsada. Error while performing updateSolicitudAsada.\n" + err);
                    db.query("rollback;");
                    res.send({"error": true});
                } //end if
                else if(req.body.respuesta == 0)
                {
                    respuestaSolicitudCorreo(req.body.respuesta, req.body.usuario, req.body.administrador, res);
                } //end if
                else
                {
                    var insertarAsada = "insert into ASADA (nombre, distrito_id, latitud, longitud) values (?, ?, ?, ?);"
                    var insertarAsadaValues = [req.body.nombre, req.body.distrito, req.body.latitud, req.body.longitud];

                    var insertarAsadaInfo = "insert into ASADAINFO (asada_id, ubicacion, telefono, poblacion, url, cantAbonados, celular) values ((SELECT ID FROM ASADA WHERE DISTRITO_ID = " + req.body.distrito + " ORDER BY 1 DESC LIMIT 1 ), ?, ?, ?, ?, ?, ?);"
                    var insertarAsadaInfoValues = [req.body.ubicacion, req.body.telefono, req.body.poblacion, req.body.url, req.body.cantAbonados, req.body.celular];

                    const password = Math.random().toString(36).slice(2);
                    var insertarUsuario = "insert into USUARIO (nombre, usuario, contrasenna, tipo) values (?, ?, ?, ?)";
                    var insertarUsuarioValues = [req.body.administrador, req.body.usuario, password, "2"]

                    var insertarUsuarioxAsada = "insert into USUARIOXASADA (usuario_id, asada_id) values (?, (SELECT ID FROM ASADA WHERE DISTRITO_ID = " + req.body.distrito + " ORDER BY 1 DESC LIMIT 1 ))"

                    db.query(insertarAsada, insertarAsadaValues, function(err2, rows2, fields2)
                    {
                        if(err2)
                        {
                            console.log("aceptarRechazarSolicitudRegistroAsada. Error while performing insertarAsada.\n" + err2);
                            db.query("rollback;");
                            res.send({"error": true});
                        } //end if
                        else
                        {
                            db.query(insertarAsadaInfo, insertarAsadaInfoValues, function(err3, rows3, fields3)
                            {
                                if(err3)
                                {
                                    console.log("aceptarRechazarSolicitudRegistroAsada. Error while performing insertarAsadaInfo.\n" + err3);
                                    db.query("rollback;");
                                    res.send({"error": true});
                                } //end if
                                else
                                {
                                    db.query(insertarUsuario, insertarUsuarioValues, function(err4, rows4, fields4)
                                    {
                                        if(err4)
                                        {
                                            console.log("aceptarRechazarSolicitudRegistroAsada. Error while performing insertarUsuario.\n" + err4);
                                            db.query("rollback;");
                                            res.send({"error": true});
                                        } //end if
                                        else
                                        {
                                            db.query(insertarUsuarioxAsada, rows4.insertId, function(err5, rows5, fields5)
                                            {
                                                if(err5)
                                                {
                                                    console.log("aceptarRechazarSolicitudRegistroAsada. Error while performing insertarUsuario.\n" + err5);
                                                    db.query("rollback;");
                                                    res.send({"error": true});
                                                } //end if
                                                else
                                                {
                                                    respuestaSolicitudCorreo(req.body.respuesta, req.body.usuario, req.body.administrador, res, password);
                                                } //end else
                                            }) //end insertarUsuarioxAsada
                                        } //end else
                                    }) //end insertarUsuario
                                } //end else
                            }) //end insertarAsadaInfo
                        } //end else
                    }) //end insertarAsada
                } // end else
            }); //end updateSolicitudAsada
        }); //end transaction
    }, //end aceptarRechazarSolicitudRegistroAsada

    getListaAsociaciones: (req, res) => {
        if (req.session.value == 1) {
            let query = 'select * from ASOCIACION';
            // execute query
            db.query(query, function (err, rows, fields) {
                if (!err) {
                    res.render('pages/crudAsociaciones.ejs', { "rows": rows, "usuario": req.session.usuario })
                }
                else {
                    console.log('getListaAsociaciones. Error while performing Query.');
                    res.redirect('/');
                }
            });
        }
        else
            res.redirect('/');
    },
    nuevaAsociacion: (req, res) => {
        if (req.session.value == 1) {

            let query = `select T.ID, T.Nombre from
                        (select A.ID as ID, A.Nombre as Nombre, AA.ASADA_ID as AID 
                            from ASADA A left join ASOCIACIONXASADA AA on (A.ID = AA.ASADA_ID)) T
                        where T.AID is null`;

            db.query(query, function (err, rows, fields) {
                if (!err) {
                    res.render('pages/crudAsociacionesCrear.ejs', { "usuario": req.session.usuario, "asadas": rows });
                }
                else {
                    console.log('nueva Asociacion. Error while performing Query.');
                    res.redirect('/');
                }

            });

        }
        else
            res.redirect('/');

    },
    nuevaAsociacionGuardar: (req, res) => {
        let {nombre, asadas} = req.body;
        asadas = JSON.parse(asadas);
        if (req.session.value == 1) {
            db.beginTransaction(function(err){
                if(err){
                    console.log(err);
                    return res.status(409).send("Failed");
                }
                let query = "insert into ASOCIACION (Nombre, CantidadMiembros) values (?, ?)";
                db.query(query, [nombre, asadas.length],(err, result)=>{
                    if(err){
                        console.log(err);
                        db.rollback((err)=>{});
                        return res.status(409).send("Failed");
                    }
                    let inserted_id = result.insertId;
                    asadas.forEach((asada, idx)=>{
                        query = "insert into ASOCIACIONXASADA values (?, ?)";
                        db.query(query, [inserted_id, asada],(err, result)=>{
                            if(err){
                                console.log(err);
                                db.rollback((err)=>{});
                                return res.status(409).send("Failed");
                            }
                            if(idx == (asadas.length)-1){
                                db.commit(function(err) {
                                    if (err) {
                                        console.log(err);
                                        db.rollback((err)=>{});
                                        return res.status(409).send("Failed");
                                    }
                                    return res.status(200).send('OK');
                                });
                            }
                        
                        });
                    });
                });
            });
        }
        else
            return res.status(402).send("Not authorized");

    },
    editarAsociacion: (req, res) => {
        const asociacion = req.params.asociacion;
        if (req.session.value == 1) {

            let query_asadas = `select T.ID, T.Nombre from
                        (select A.ID as ID, A.Nombre as Nombre, AA.ASADA_ID as AID 
                            from ASADA A left join ASOCIACIONXASADA AA on (A.ID = AA.ASADA_ID)) T
                        where T.AID is null`;

            let query_asociacion = `select * from ASOCIACION where ID = ?`;

            let query_asociacion_asadas = `select A.ID, A.Nombre
                                           from ASADA A inner join ASOCIACIONXASADA AA on (A.ID=ASADA_ID)
                                           where ASOCIACION_ID=?`;

            db.query(query_asociacion_asadas, asociacion,function (err, lista_asadas_asociaciones, fields) {
                if (err || lista_asadas_asociaciones.length == 0) {
                    console.log('1: editar Asociacion. Error while performing Query. \n'+err);
                    return res.redirect('/asociaciones');
                }
                else {
                    db.query(query_asociacion, asociacion,function(err, asociacion, fields){
                        if(err){
                            console.log('2: nueva Asociacion. Error while performing Query. \n'+err);
                            return res.redirect('/asociaciones');
                        }
                        db.query(query_asadas, function(err, asadas, fields){
                            if(err){
                                console.log('3: nueva Asociacion. Error while performing Query. \n'+err);
                                return res.redirect('/asociaciones');
                            }
                            res.render('pages/crudAsociacionesEditar.ejs', { "usuario": req.session.usuario, "asadas": asadas, "asociacion": asociacion[0], "lista_asadas": lista_asadas_asociaciones });
                        });

                    });
                }

            });

        }
        else
            res.redirect('/');

    },
    editarAsociacionGuardar: (req, res) => {
        const asociacion = req.params.asociacion;
        let {nombre, asadas, borrados} = req.body;
        asadas = JSON.parse(asadas);
        borrados = JSON.parse(borrados);
        let data = {
            asociacion: asociacion,
            nombre: nombre,
            asadas: asadas,
            borrados: borrados,
            callback: actualizarAsociacion,
        };
        if(!(asociacion && nombre && asadas && borrados)){
            return res.status(400).send('Faltan parámetros');
        }
        if (req.session.value == 1) {
            db.beginTransaction(function(err){
                return borrarAsadasAsociaciones(res, data, actualizarAsociacionesAsadas);
            });
        }
        else
            return res.status(402).send("Not authorized");

    },
    eliminarAsociacion: (req, res) => {
        const asociacion = req.params.asociacion;
        if (req.session.value == 1) {
            var query = "delete from ASOCIACION where ID = ?";
            db.query(query, asociacion,function (err, rows, fields) {
                if(err){
                    console.log(err);
                    return res.status(409)
                }
                return res.status(200).send("OK");
            });
        }else{
            return res.status(402).send("Not authorized");
        }
    },

    getAyudaPregunta: (req, res) =>
    {
        if(req.session.value != 1)
        {
            res.status(402).send("Not authorized");
        } //end if
        else
        {
            var selectAyudaFormulario = "select ayuda, url from AYUDAFORMULARIO where indicador_id = ?;";
            db.query(selectAyudaFormulario, req.query.idPregunta, function(err, rows, fields)
            {
                if(err)
                {
                    console.log('getAyudaPregunta. Error while performing selectAyudaFormulario.\n' + err);
                    res.send({"error": true});
                } //end if
                else
                {
                    res.send({"error": false, "ayuda": rows[0].ayuda, "url": rows[0].url});
                } //end else
            }); //end selectAyudaFormulario
        } //end else
    },

    deleteNotificacion: (req, res) =>
    {
        if(req.session.value != 1)
        {
            res.status(402).send("Not authorized");
        } //end if
        else
        {
            db.beginTransaction(function(error)
            {
                if(error)
                {
                    db.rollback();
                    console.log('getAyudaPregunta. Error while performing selectAyudaFormulario.\n' + error);
                    res.send({"error": true});
                } //end if
                else
                {
                    var deleteNotificacion = "delete from SOLICITUDASADA where id = ?";
                    db.query(deleteNotificacion, req.body.idNotificacion, function(err, rows, fields)
                    {
                        if(err)
                        {
                            db.rollback();
                            console.log('deleteNotificacion. Error while performing deleteNotificacion.\n' + err);
                            res.send({"error": true});
                        } //end if
                        else
                        {
                            db.commit();
                            res.send({"error": false});
                        } //end else
                    }); //end deleteNotificacion
                } //end else
            }) //end beginTransaction
        } //end else
    }, //end deleteNotificacion

    getAyudaRiesgo : (req, res)=>{
        //if(req.session.value != 1)
        //{
        //    res.status(402).send("Not authorized");
        //} //end if
        //else
        //{
            /* console.log("Estoy en getayudaRiesgo");
            res.status(200).send({"error": false, "ayuda": "Hola"}); */
            var selectAyudaRiesgo = "select AYUDA from AYUDARIESGO where ID_RIESGO = ?;";
            db.query(selectAyudaRiesgo, [req.params.idRiesgo], function(err, rows, fields)
            {
                if(err)
                {
                    console.log('getAyudaRiesgo. Error while performing selectAyudaRiesgo.\n' + err);
                    res.status(400).send({"error": true});
                } //end if
                else
                {
                    console.log(rows[0].ayuda);
                    res.status(200).send({"error": false, "ayuda": rows[0].AYUDA});
                    
                } //end else
            }); //end selectAyudaRiesgo
        //} //end else

    },
};

function borrarAsadasAsociaciones(res, data, next){
    let query = 'delete from ASOCIACIONXASADA where ASADA_ID = ?';
    if(data.borrados.length>0){
        data.borrados.forEach((borrado, idx2)=>{
            db.query(query, borrado, (err, result)=>{
                if(err){
                    console.log(err);
                    db.rollback((err)=>{});
                    return res.status(409).send("Failed");
                }
                if(idx2 == (data.borrados.length)-1){
                    return next(res, data, data.callback);
                }
            });
        });
    }else{
        return next(res, data, data.callback);
    }
}

function actualizarAsociacionesAsadas(res, data, next){
    if(data.asadas.length>0){
        let nuevos = 0;
        data.asadas.forEach((asada, idx)=>{
            query = "insert into ASOCIACIONXASADA values (?, ?)";
            db.query(query, [data.asociacion, asada],(err, result)=>{
                if(err){
                    if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062){
                        console.log('Duplicated PK on ASOCIACIONXASADA')
                    }
                    else{
                        console.log(err);
                        db.rollback((err)=>{});
                        return res.status(409).send("Failed");
                    }
                    
                }else{
                    nuevos++;
                }
                if(idx == (data.asadas.length)-1){
                    return next(res, data, nuevos);
                }
            });
        });
    }else{
        return next(res, data, 0);
    }
    
}

function actualizarAsociacion(res, data, cantidad){
    query = "update ASOCIACION set Nombre=?, CantidadMiembros=CantidadMiembros+? where ID=?";
    db.query(query, [data.nombre, (-data.borrados.length + cantidad), data.asociacion],(err, result)=>{
        if(err){
            console.log(err);
            db.rollback((err)=>{});
            return res.status(409).send("Failed");
        }
        db.commit(function(err) {
            if (err) {
                console.log(err);
                db.rollback((err)=>{});
                return res.status(409).send("Failed");
            }
            return res.status(200).send('OK');
        });
    });
}

function respuestaSolicitudCorreo(respuesta, correo, nombre, res, password = "")
{
    var mailOptions = {
        from: 'irssastec@gmail.com',
        to: correo,
        subject: 'Solicitud de registro de ASADA',
        text: `Buenas, ${nombre}\nSu solicitud fue ${respuesta == 1 ? 'aceptada' : 'rechazada'} por los administradores de la aplicación.${respuesta == 1 ? `\nUsuario: ${correo}\nContraseña: ${password}` : ""}\nSaludos cordiales`
    };
    transporter.sendMail(mailOptions, function (error) {
        if (error)
        {
            console.log("aceptarRechazarSolicitudRegistroAsada. Error enviando correo.\n" + error);
            db.query("rollback;");
            res.send({"error": true});
        }
        else
        {
            db.query("commit;");
            res.send({"error": false});
        }
    });
}