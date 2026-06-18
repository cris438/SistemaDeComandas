const estados = {
    'Ocupada': 'Ocupada',
    'Libre': 'Libre',
    'Pendiente': 'Pendiente de Pago'
}

class Producto {
    #id;
    #nombre;
    #precio;

    constructor(nombre, precio) {
        this.#nombre = nombre
        this.#precio = precio
        this.#id = Date.now() + Math.ceil(Math.random() * 1000)
    }

    get nombre() {
        return this.#nombre;
    }

    get precio() {
        return this.#precio.toFixed(2);
    }

    get id() {
        return this.#id
    }

    notificarAEstacion() {
        console.log("Enviar a Cocina")
    }
}

class BebidaCaliente extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Caliente'
    }
}

class BebidaFria extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Fria'
    }

    notificarAEstacion() {
        console.log("Enviar al Bar")
    }
}

class Mesa {
    #nombre;
    #estado;
    #comandas;
    #total;
    #personas;
    #id;
    #mesasUnidas;

    constructor(nombre, personas) {
        this.#nombre = nombre
        this.#estado = 'Libre'
        this.#personas = personas
        this.#total = 0
        this.#comandas = []
        this.#mesasUnidas = []
        this.#id = Math.ceil(Math.random() * 1000) + Date.now()
    }

    get nombre() {
        return this.#nombre;
    }

    get estado() {
        return this.#estado;
    }

    get id() {
        return this.#id;
    }

    get personas() {
        return this.#personas
    }

    get mesasUnidas() {
        return this.#mesasUnidas
    }

    get comandas() {
        return this.#comandas
    }

    cobrarMesa() {
        this.#cambiarEstado(estados.Libre)
    }

    #cambiarEstado(estado) {
        if (estados[estado] != undefined) {
            this.#estado = estado
        } else {
            throw new Error('Estado no Autorizado')
        }

    }

    ingresarComanda(comanda) {
        this.#comandas = [...this.#comandas, comanda]
    }

    eliminarComanda() {
        this.#comandas.pop()
    }

    aperturarMesa() {
        this.#cambiarEstado(estados.Ocupada)
    }

    muestrame() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`

        mesaDetalleInfo.innerHTML = `  <p><strong>Mesa:</strong> ${this.nombre.split(' ')[1]} </p>
            <p><strong>Capacidad:</strong> ${this.personas}   comensales</p>`
        estadoMesa.innerHTML = this.estado
        estadoMesa.className = `mesa-estado ${this.estado.toLowerCase()}`
        panelComanda.classList.remove('d-none')

        mesaDetalle.classList.remove('d-none')
        tablaWrap.classList.add('d-none')
        totales.classList.add('d-none')
        acciones.classList.add('d-none')

        botonUnirMesa.setAttribute('data-id', this.id)
    }

    mostrarCuenta() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`
        tablaWrap.classList.remove('d-none')
        totales.classList.remove('d-none')
        acciones.classList.remove('d-none')
        mesaDetalle.classList.add('d-none')

    }

    unirme(ids) {
        this.#mesasUnidas = [...this.#mesasUnidas, ids]
    }
}


class Restaurante {
    #nombre;
    #mesasNo;
    #mesas;

    constructor(nombre, mesas) {
        this.#mesasNo = mesas;
        this.#nombre = nombre;
        this.#mesas = this.crearMesas()
    }

    crearMesas() {
        let mesas = []
        for (let i = 1; i <= this.#mesasNo; i++) {
            mesas.push(new Mesa(`Mesa ${i}`, 4))
        }

        return mesas
    }

    get mesasNo() {
        return this.#mesasNo;
    }

    get mesas() {
        return this.#mesas;
    }

    normalizeMesasHTML() {
        let html = ''

        for (let item of this.#mesas) {
            html += `<article data-id=${item.id} class="mesa-card ${item.estado.toLowerCase()}">
                        <h3 data-id=${item.id}>${item.nombre}</h3>
                        <p data-id=${item.id}><span class="dot"></span> ${item.estado}</p>
                     </article>`
        }
        return html;
    }
}

class Pedido {
    #cantidad;
    #subtotal;
    #nombre;
    #precio;

    constructor(cantidad, nombre, precio) {
        this.#cantidad = cantidad;
        this.#nombre = nombre
        this.#precio = precio
    }

    get subtotal() {
        return (this.#cantidad * this.#precio).toFixed(2)
    }
    get cantidad() {
        return this.#cantidad
    }
    get nombre() {
        return this.#nombre
    }
    get precio() {
        return this.#precio
    }
    set cantidad(value) {
        this.#cantidad = value
    }
}

class Comanda {
    #pedidos;
    #mesas;
    #impuestos = 0.05
    #estado
    constructor(mesa) { //mesas sera un arreglo
        this.#pedidos = []
        this.#mesas = mesa
        this.#estado = 'Pendiente'
    }

    get subtotal() {
        return this.#pedidos.reduce((acumulador, actual) => acumulador + parseFloat(actual.subtotal), 0)
    }

    agregarPedido(pedido) {
        let pedidoEncontrar = this.#pedidos.find(item => item.nombre == pedido.nombre)
        if (pedidoEncontrar == undefined) {
            this.#pedidos = [...this.#pedidos, pedido]
        } else {
            pedidoEncontrar.cantidad++
        }
    }

    agregarMesa(mesa) {
        this.#mesas = [...this.#mesas, mesa]
    }

    renderizar() {
        let html = ''
        let totalFinal = 0
        for (let pedido of this.#pedidos) {
            html += `
            <tr>
                <td>${pedido.cantidad}</td>
                <td>${pedido.nombre}</td>
                <td>${pedido.precio}</td>
                <td>${pedido.subtotal}</td>
            </tr>   
            `
        }
        tablaPedido.innerHTML = html
        subTotal.textContent = this.subtotal.toFixed(2)
        impuestos.textContent = (this.subtotal * this.#impuestos).toFixed(2)
        totalFinal = (this.subtotal * this.#impuestos).toFixed(2)
        total.textContent = (parseFloat(totalFinal) + parseFloat(this.subtotal)).toFixed(2)
    }

    cobrar() {
        this.#estado = 'Preparando'
        tablaPedido.innerHTML = ''
        subTotal.textContent = '0.00'
        impuestos.textContent = '0.00'
        total.textContent = '0.00'
        alert('Comanda, Enviada')
    }

}

//Objetos
const restaurante = new Restaurante('El gordo', 8)
const productos = [
    new Producto('Cafe Late', 25),
    new Producto('Trago Ruso', 20)
]

///DOM
let contenedorMesas = document.querySelector('.mesas-grid')
let contenedorNoMesas = document.querySelector('.badge')
let tituloMesa = document.querySelector('#tituloMesa')
let mesaDetalleInfo = document.querySelector('.mesa-detalle-info')
let estadoMesa = document.querySelector('.mesa-estado')
let panelComanda = document.querySelector('.panel-comanda')
let detalleMesaAcciones = document.querySelector('.mesa-detalle-acciones')
let botonUnirMesa = document.querySelector('.unir-mesa')
let tablaWrap = document.querySelector('.tabla-wrap')
let mesaDetalle = document.querySelector('.mesa-detalle')
let totales = document.querySelector('.totales')
let acciones = document.querySelector('.acciones')
let menuGrid = document.querySelector('.menu-grid')
let tablaPedido = document.querySelector('#tabla-pedido')
let subTotal = document.querySelector('#subtotal')
let impuestos = document.querySelector('#impuestos')
let total = document.querySelector('#total')
let btnCobrar = document.querySelector('.cobrar')
let btnFinalizar = document.querySelector('.finalizar')
let btnAbrirCuenta = document.querySelector('.abrir-cuenta')

contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
contenedorNoMesas.textContent = `${restaurante.mesasNo} Mesas`
let mesaActualSeleccionada;
let mesaSeleccionada;
let btnEvento = (event) => {
    if (!event.target.className.includes('mesas-grid')) {
        if (mesaActualSeleccionada != undefined) {
            mesaActualSeleccionada.style = ''
        }

        mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
        event.target.style = 'background: green'

        if (mesaSeleccionada.estado == estados.Libre) {
            mesaSeleccionada.muestrame()
        } else {
            mesaSeleccionada.mostrarCuenta()
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()
        }

        mesaActualSeleccionada = event.target
    }
}

let btnEventoRojo = (event) => {
    event.target.style = 'background-color: red'
    mesaSeleccionada.unirme(event.target.dataset.id)
}

contenedorMesas.addEventListener('click', btnEvento)

//preguntar que hace el click y para que sirve
let click = false;

botonUnirMesa.addEventListener('click', (event) => {
    contenedorMesas.removeEventListener('click', btnEvento)
    contenedorMesas.addEventListener('click', btnEventoRojo)

    if (click) {
        let comandaObjeto = new Comanda([mesaSeleccionada.id])
        for (let i = 0; i < mesaSeleccionada.mesasUnidas.length; i++) {
            let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
            mesaAUnir.aperturarMesa();
            mesaAUnir.ingresarComanda(comandaObjeto)
            comandaObjeto.agregarMesa(mesaAUnir.id)
        }
        mesaSeleccionada.aperturarMesa();
        mesaSeleccionada.ingresarComanda(comandaObjeto)
        contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()

        botonUnirMesa.textContent = 'Seleccionar Mesas'
        click = false
        contenedorMesas.removeEventListener('click', btnEventoRojo)
        contenedorMesas.addEventListener('click', btnEvento)
        mesaSeleccionada.mostrarCuenta()
        comandaObjeto.renderizar()
    } else {
        botonUnirMesa.textContent = "Unir Mesas"
        botonUnirMesa.style = 'background-color: skyblue'
        //Mesa2
        mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
        click = true
    }
})

let productosHTML = ''
for (let producto of productos) {
    productosHTML += `
              <article class="producto-card">
            <img
              src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"
              alt="Pizza Margarita"
            />
            <div class="producto-info">
              <h3>${producto.nombre}</h3>
              <p class="categoria comida">
                <i class="fa-solid fa-utensils"></i> Comida
              </p>
              <p class="precio">${producto.precio}</p>
              <button data-id=${producto.id} type="button">Agregar</button>
            </div>
          </article>
    `

}
menuGrid.innerHTML = productosHTML


//preguntar como funciona este evento y para que sirve, y como se relaciona con el pedido y la comanda
menuGrid.addEventListener('click', (event) => {
    if (event.target.type == 'button') {
        console.log(event.target.dataset.id)
        //buscar que producto seleccionaron   
        let producto = productos.find(item => item.id == event.target.dataset.id)
        //Crear un Pedido
        const pedido = new Pedido(1, producto.nombre, producto.precio)
        //Agregar el Pedido a la Comanda
        if (mesaSeleccionada && mesaSeleccionada.comandas.length > 0) {
            console.log(mesaSeleccionada)
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].agregarPedido(pedido)
            //Dibujar el Pedido en la Comanda
            console.log(mesaSeleccionada)
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()
        }else{
            alert('Abre una mesa antes de agregar un producto')
        }
        btnFinalizar.disabled = false
    }
})

btnCobrar.addEventListener('click', () => {
    mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].cobrar()
    const nuevaComanda = new Comanda([mesaSeleccionada.id])
    for (let i = 0; i < mesaSeleccionada.mesasUnidas.length; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
        mesaAUnir.ingresarComanda(nuevaComanda)
    }
    mesaSeleccionada.ingresarComanda(nuevaComanda)
    btnFinalizar.disabled = false
})


btnFinalizar.addEventListener('click', () => {
    mesaSeleccionada.cobrarMesa()
    for (let i = 0; i < mesaSeleccionada.mesasUnidas.length; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
        mesaAUnir.cobrarMesa()
    }
    mesaSeleccionada.eliminarComanda()
    contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
    panelComanda.classList.add('d-none')
})

btnAbrirCuenta.addEventListener('click', () => {
    mesaSeleccionada.aperturarMesa()
    let comandaObjeto = new Comanda([mesaSeleccionada.id])
    comandaObjeto.agregarMesa(mesaSeleccionada.id)
    contenedorMesas = restaurante.normalizeMesasHTML()
    mesaSeleccionada.ingresarComanda(comandaObjeto)
    mesaSeleccionada.mostrarCuenta()

})