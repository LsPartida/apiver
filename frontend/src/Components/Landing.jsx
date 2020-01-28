import React, { Component } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "./Styles/Landing.css";
const axios = require("axios").default;
class Landing extends Component {
  state = {
    CODIGOBARRAS: "",
    DESCRIPCION: "",
    OFERTA: "",
    DESCUENTO: "",
    PRECIO: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post(`/cons`, {
        CODIGOBARRAS: this.state.CODIGOBARRAS
      })
      .then(response => {
        console.log({ status: response.status, datos: response.data });
        if (response.status === 201)
          this.setState({
            CODIGOBARRAS: "",
            OFERTA: "",
            DESCUENTO: "",
            PRECIO: "",
            DESCRIPCION: response.data.descripcion
          });
        else {
          if (response.data.descuento !== "0.00" && response.data.descuento !== undefined) {
            this.setState({
              CODIGOBARRAS: "",
              DESCUENTO: `${response.data.descuento}% de descuento`,
              DESCRIPCION: response.data.descripcion,
              PRECIO: `Precio: $${response.data.precio}`,
              OFERTA: `Usted paga solamente: $${response.data.preciooferta}`
            });
          } else
            this.setState({
              CODIGOBARRAS: "",
              DESCUENTO: ``,
              DESCRIPCION: response.data.descripcion,
              PRECIO: `Precio: $${response.data.precio}`,
              OFERTA: ``
            });
        }
      });
  };
  handleChange = e => {
    this.setState({
      CODIGOBARRAS: e.target.value
    });
    // if (e.target.value.length >= 13) this.handleSubmit(e);
  };
  componentDidMount() {
    fetch("/cons");
  }
  render() {
    return (
      <div className="container">
        <div id="uno" className="row">
          <div id="dos" className="col-2"></div>
          <div id="tres" className="col-6">
            <h1 className="elH1">Ingrese código de barras</h1>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="Ingrese aquí el código"
                className="Barcode mb-5 mt-5"
                autoFocus
                onChange={this.handleChange}
                value={this.state.CODIGOBARRAS}
              />
            </form>
            <h1 className="descripcion mt-5">{this.state.DESCRIPCION}</h1>
            <h2 className="precio">{this.state.PRECIO}</h2>
            <h2 className="descuento">{this.state.DESCUENTO}</h2>
            <h2 className="oferta">{this.state.OFERTA}</h2>
            <p className="resultados">Powered By erpDOZ v3.0.2001.5</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
