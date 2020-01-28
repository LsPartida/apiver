require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const computerName = require("computer-name");

let precio;
let sucursal;
let varprecio;
let vardescuento;
let descripcion;
let preciooferta;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 1,
  host: process.env.HOST,
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
app.get("/cons", (req, res) => {
  let sSql;
  let puntoventa;
  sSql = `SELECT IDPUNTOVENTA,IDSUCURSAL from gequipopc e WHERE EQUIPOPC='${computerName()}'`;

  pool.query(sSql, (err, rows) => {
    //Despues de la consulta
    sucursal = rows[0].IDSUCURSAL;
    sSql = `SELECT PRECIOPRED FROM gpuntoventa WHERE IDPUNTOVENTA=${rows[0].IDPUNTOVENTA} LIMIT 1`;
    // console.log({ sucursal, sSql });
    pool.query(sSql, (err, rows) => {
      //Despues de la consulta
      precio = rows[0].PRECIOPRED;
    });
    //Antes de la consulta
  });
  // Antes de la consulta
  res.status(200).send("OK");
});
app.post("/cons", (req, res) => {
  let resul = "";
  let idarticulo;
  varprecio = ` pespecial(au.PRECIO${precio},0,au.IDUNIDAD,a.LINEA01,a.IDARTICULO,auc.CODIGOBARRAS,${sucursal}) PRECIO1 `;
  vardescuento = ` despecial(au.PRECIO${precio},0,au.IDUNIDAD,a.LINEA01,a.IDARTICULO,auc.CODIGOBARRAS,${sucursal}) DESCUENTO `;
  sSql = `SELECT IDARTICULO,${varprecio},DESCRIPCION,${vardescuento} FROM garticulos a INNER JOIN garticulosunidades au USING(IDARTICULO) INNER JOIN garticulosunidadescodigos auc USING(IDARTICULO,IDUNIDAD) WHERE auc.ELIMINADO=FALSE and au.ELIMINADO=FALSE and a.ACTIVO=TRUE and au.VENTA=TRUE AND auc.CODIGOBARRAS='${req.body.CODIGOBARRAS}'`;
  console.log(sSql);
  if (req.body !== undefined) {
    pool.query(sSql, (err, rows) => {
      if (err) {
        console.log(err);
        throw err;
      }
      if (rows.length !== 0) {
        descripcion = rows[0].DESCRIPCION;
        descuento = rows[0].DESCUENTO.toFixed(2);
        resul = {
          precio: rows[0].PRECIO1.toFixed(2),
          descripcion: descripcion
        };
        idarticulo = rows[0].IDARTICULO;
        sSql = `SELECT imp.TIPOFACTOR,imp.TASAOCUOTA
        FROM garticulosimpuestos art INNER JOIN glasientoimpuestotipo33 imp ON art.IDIMPUESTO=imp.IDASIENTOIMPUESTOTIPO
        WHERE art.ELIMINADO=FALSE AND art.INCLALVENDER=FALSE AND imp.ACTIVO=TRUE AND imp.C_IMPUESTO IN(002,003) AND imp.TRASLADO=TRUE AND imp.RETENCION=FALSE AND NOT imp.TIPOFACTOR = 'EXENTO' AND IDARTICULO=${idarticulo}`;
        pool.query(sSql, (err, rows) => {
          if (rows.length !== 0) {
            rows.map(imp => {
              switch (imp.TIPOFACTOR) {
                case "TASA":
                  // console.log(imp.TASAOCUOTA)
                  resul.precio *= imp.TASAOCUOTA + 1;
                  break;
                case "CUOTA":
                  resul.precio += imp.TASAOCUOTA + 1;
              }
              resul.precio = resul.precio.toFixed(2);
            });
            resul = {
              ...resul,
              descuento: descuento,
              preciooferta: (resul.precio * ((100 - descuento) / 100)).toFixed(
                2
              )
            };
          } else {
          }
          console.log(resul);
          res.status(200).send(resul);
        });
      } else res.status(201).send({ descripcion: "Artículo no encontrado" });
    });
    // Antes del Query
    //  console.log({varprecio,vardescuento,sSql})
  }
});
app.listen(8080, () => {
  console.log(`Server corriendo ${process.env.DBUSERNAME}`);
});
