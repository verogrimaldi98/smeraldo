document.addEventListener("DOMContentLoaded", function () {
    
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const total = localStorage.getItem('total') || 0;
    const totalNumerico = parseFloat(total) || 0;
    const totalFormateado = totalNumerico.toFixed(3);

    const resumenDiv = document.getElementById("detalle");

    let resumenTextoHTML = "";

    for (let i = 0; i < productos.length; i++) {
        const productoActual = productos[i]; 
        resumenTextoHTML += `<div class="d-flex justify-content-between">
                            <div>${productoActual.nombre}</div>
                            <div>$${parseFloat(productoActual.precio).toFixed(3)}</div>
                        </div>`;
    }

    resumenTextoHTML += `<br><div class="d-flex justify-content-end fw-bold">
                            <div>Total a pagar: $</div>
                            <div>${totalFormateado}</div>
                        </div>`;
    resumenDiv.innerHTML = resumenTextoHTML;

    function enviarFormulario(event) {
        event.preventDefault();

        const nombreContacto = document.getElementById('nombre').value.trim();
        const apellidoContacto = document.getElementById('apellido').value.trim();
        const emailContacto = document.getElementById('email').value.trim();
        const telefonoContacto = document.getElementById('telefono').value.trim();

        if (!nombreContacto || !apellidoContacto || !emailContacto) {
            alert("Por favor, completa con tu nombre completo y un email antes de enviar.");
            return;
        }

        let detallesCarritoParaEnvio = '';
        for (let i = 0; i < productos.length; i++) {
            const productoActual = productos[i];
            detallesCarritoParaEnvio += `${productoActual.nombre} - $${parseFloat(productoActual.precio).toFixed(3)}\n`;
        }

        document.getElementById('carritoData').value = detallesCarritoParaEnvio;
        document.getElementById('totalCarrito').value = `$${totalFormateado}`;
        
        // Enviar el formulario
        document.getElementById('formulario').submit();
    }

    const botonEnviar = document.getElementById('botonEnviar');
   
    if (botonEnviar) {
        botonEnviar.addEventListener('click', enviarFormulario);
        localStorage.removeItem("carrito");
        localStorage.clear()
    } else {
        console.warn("ADVERTENCIA: No se encontró el botón con ID 'botonEnviar'.");
    }
});