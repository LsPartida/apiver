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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 1,
  host: process.env.HOST,
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

app.get("/", (req, res) => {
  let sSql;
  let puntoventa;
  sSql = `SELECT IDPUNTOVENTA,IDSUCURSAL from gequipopc e WHERE EQUIPOPC='${computerName()}'`;

  pool.query(sSql, (err, rows) => {
    //Despues de la consulta
    sucursal = rows[0].IDSUCURSAL;
    sSql = `SELECT PRECIOPRED FROM gpuntoventa WHERE IDPUNTOVENTA=${rows[0].IDPUNTOVENTA} LIMIT 1`;
    console.log({ sucursal, sSql });
    pool.query(sSql, (err, rows) => {
      //Despues de la consulta
      precio = rows[0].PRECIOPRED;
    });
    //Antes de la consulta
  });
  // Antes de la consulta
  res.send("OK");
});

app.post("/", (req, res) => {
  let resul = "";
  varprecio = ` pespecial(au.PRECIO1,0,au.IDUNIDAD,a.LINEA01,a.IDARTICULO,auc.CODIGOBARRAS,${sucursal}) PRECIO1 `;
  vardescuento = ` despecial( au.PRECIO1,0,au.IDUNIDAD,a.LINEA01,a.IDARTICULO,auc.CODIGOBARRAS,${sucursal}) DESCUENTO `;
  sSql = `SELECT IDARTICULO,${varprecio},DESCRIPCION,${vardescuento} FROM garticulos a INNER JOIN garticulosunidades au USING(IDARTICULO) INNER JOIN garticulosunidadescodigos auc USING(IDARTICULO,IDUNIDAD) WHERE auc.CODIGOBARRAS='${req.body.CODIGOBARRAS}'`;
  // connection.connect();
  pool.query(sSql, (err, rows) => {
    if (err) throw err;
    // Despues del Query
    // Calcular para mostrar resultados
    resul = {
      precio: rows[0].PRECIO1,
      descripcion: rows[0].DESCRIPCION,
      preciooferta: rows[0].PRECIO1 * ((100 - rows[0].DESCUENTO) / 100)
    };
    console.log({ rows, resul });
  });
  // Antes del Query
  //  console.log({varprecio,vardescuento,sSql})
  res.send("OK");
});
app.listen(8080, () => {
  console.log(`Server corriendo ${process.env.DBUSERNAME}`);
});
