let productosDB = []; // Variable global para guardar los productos

function mostrarModalCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        totalCarrito.textContent = "Total: $0.00";
    } else {
        let totalPrecio = 0;

        carrito.forEach((id) => {
            const producto = productosDB.find(p => p.id === id);
            if (!producto) return;

            totalPrecio += producto.price;

            const item = document.createElement("div");
            item.className = "item-carrito";
            item.innerHTML = `
                <span><strong>${producto.title}</strong></span>
                <div class="d-flex flex-column">
                    <span>$${producto.price.toFixed(3)}</span>
                    <button class="delete-btn" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </div> 
            `;
            listaCarrito.appendChild(item);
        });

        totalCarrito.textContent = `Total: $${totalPrecio.toFixed(3)}`;
    }

}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");

    if (contador) {
        contador.textContent = carrito.length > 9 ? "9+" : carrito.length;

        if (carrito.length > 0) {
            contador.style.display = "flex";
        } else {
            contador.style.display = "none";
        }
    }
}

function agregarAlCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(idProducto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    actualizarContadorCarrito();
    mostrarModalCarrito();
}

function eliminarProducto(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.indexOf(idProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarModalCarrito();
}

// Función para preparar y redirigir a la página de pago
function pagar() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        return;
    }

    // Preparar datos para la página de compra
    const productosCompra = [];
    let totalCompra = 0;

    carrito.forEach(id => {
        const producto = productosDB.find(p => p.id === id);
        if (producto) {
            productosCompra.push({
                nombre: producto.title,
                precio: producto.price
            });
            totalCompra += producto.price;
        }
    });

    localStorage.setItem('productos', JSON.stringify(productosCompra));
    localStorage.setItem('total', totalCompra.toFixed(3));

    window.location.href = '/html/compra.html';
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    const contenedor = document.getElementById("product-container");

    fetch("https://fakestoreapi.com/products")
        .then((response) => {
            if (!response.ok) throw new Error("Error en la red");
            return response.json();
        })
        .then((data) => {
            productosDB = data;
            localStorage.setItem("productosDB", JSON.stringify(data));

            const contenedor = document.getElementById("product-container");
            if (!contenedor) return;
            contenedor.innerHTML = "";

            data.forEach((producto) => {
                const item = document.createElement("div");
                item.className = "";

                item.innerHTML = `
                <div class="product-card card">
                    <div class="card-content">
                        <div class="card-img my-3">
                            <img src="${producto.image}" alt="${producto.title}">
                        </div>
                        <div class="card-body text-center border-t">
                            <div class="category-text">${producto.category}</div>
                            <div class="text-uppercase product-title">${producto.title}</div>
                            <div class="fw-bold">$${producto.price}</div>
                            <div class="btn-container">
                                <button class="product-btn" onclick="agregarAlCarrito(${producto.id})">Añadir a carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                contenedor.appendChild(item);
            });

            actualizarContadorCarrito();
        })

        .catch((error) => {
            console.error("Error al obtener productos:", error);

            const contenedor = document.getElementById("product-container");
            if (contenedor) {
                contenedor.innerHTML = "<p>Hubo un problema al cargar los productos.</p>";
            }
        });

    // Event listeners
    document.getElementById("icono-carrito")?.addEventListener("click", mostrarModalCarrito);
    document.getElementById("vaciar-carrito")?.addEventListener("click", vaciarCarrito);
    document.getElementById("pagar")?.addEventListener("click", pagar);
});