
let carrito = [];


fetch('productos.json')
  .then(response => response.json())
  .then(productos => mostrarProductos(productos))
  .catch(error => {
    Swal.fire({
      title: 'Error al cargar los productos',
      text: 'Hubo un problema al cargar los productos. Intenta nuevamente.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  });


function mostrarProductos(productos) {
  const contenedor = document.getElementById('productos');

  productos.forEach(producto => {
    const productoHTML = `
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p>Precio: $${producto.precio}</p>
        <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
      </div>
    `;
    contenedor.innerHTML += productoHTML;
  });
}

function agregarAlCarrito(id, nombre, precio) {
  const productoExistente = carrito.find(item => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();

  Swal.fire({
    title: 'Producto agregado!',
    text: `${nombre} se ha agregado a tu carrito.`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}


function actualizarCarrito() {
  const carritoUl = document.getElementById('carrito');
  carritoUl.innerHTML = '';

  let total = 0;
  carrito.forEach(item => {
    const itemHTML = `
      <li>
        ${item.nombre} - $${item.precio} x ${item.cantidad}
        <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      </li>
    `;
    carritoUl.innerHTML += itemHTML;
    total += item.precio * item.cantidad;
  });

  document.getElementById('total').textContent = total.toFixed(2);
}

function eliminarDelCarrito(id) {
  const productoIndex = carrito.findIndex(item => item.id === id);
  if (productoIndex !== -1) {
    carrito.splice(productoIndex, 1);
    actualizarCarrito();
    Swal.fire({
      title: 'Producto eliminado',
      text: 'El producto ha sido eliminado del carrito.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }
}

document.getElementById('finalizar-compra').addEventListener('click', () => {
  if (carrito.length === 0) {
    Swal.fire({
      title: 'Carrito vacío',
      text: 'No has agregado productos al carrito.',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  } else {

    Swal.fire({
      title: 'Selecciona un método de pago',
      input: 'radio',
      inputOptions: {
        'transferencia': 'Transferencia Bancaria',
        'mercadoPago': 'Mercado Pago',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un método de pago';
        }
      },
      confirmButtonText: 'Siguiente',
    }).then((result) => {
      if (result.isConfirmed) {
        const metodoPago = result.value;


        Swal.fire({
          title: 'Selecciona un método de envío',
          input: 'radio',
          inputOptions: {
            'domicilio': 'Envío a domicilio',
            'retiro': 'Retiro en tienda',
          },
          inputValidator: (value) => {
            if (!value) {
              return 'Debes seleccionar un método de envío';
            }
          },
          confirmButtonText: 'Finalizar Compra',
        }).then((result) => {
          if (result.isConfirmed) {
            const metodoEnvio = result.value;

            Swal.fire({
              title: '¡Compra Finalizada!',
              text: `Método de pago: ${metodoPago}\nMétodo de envío: ${metodoEnvio}\nTotal: $${document.getElementById('total').textContent}`,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });


            carrito = [];
            actualizarCarrito();
          }
        });
      }
    });
  }
});

const carritoBtn = document.getElementById('abrir-carrito');
const carritoLateral = document.getElementById('carrito-lateral');
const cerrarCarrito = document.getElementById('cerrar-carrito');

carritoBtn.addEventListener('click', () => {
  carritoLateral.style.right = '0'; 

cerrarCarrito.addEventListener('click', () => {
  carritoLateral.style.right = '-300px'; 
});
});


function validarFormulario({ nombre, email, mensaje }) {
  const errores = [];

  if (!nombre.trim()) errores.push('El nombre es obligatorio.');
  if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errores.push('El email no es válido.');
  if (!mensaje.trim()) errores.push('El mensaje es obligatorio.');

  return errores;
}


const datosUsuario = {
  nombre: "Juan Pérez",
  email: "juan.perez@example.com",
  mensaje: "Hola, estoy interesado en saber más sobre sus productos."
};


function precargarDatosFormulario() {
  document.getElementById('nombre').value = datosUsuario.nombre;
  document.getElementById('email').value = datosUsuario.email;
  document.getElementById('mensaje').value = datosUsuario.mensaje;
}

window.onload = function() {
  precargarDatosFormulario();
};


document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Evitar el envío del formulario

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const mensaje = document.getElementById('mensaje').value;

  const errores = validarFormulario({ nombre, email, mensaje });

  if (errores.length > 0) {
    Swal.fire({
      title: 'Errores en el formulario',
      html: errores.join('<br>'),
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  Swal.fire({
    title: '¡Gracias por tu mensaje!',
    text: 'Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  document.getElementById('contact-form').reset();
});

// Diseño responsive
function aplicarResponsive() {
  const estilos = document.createElement('style');
  estilos.textContent = `
    @media (max-width: 768px) {
      #productos {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .producto {
        width: 90%;
        margin-bottom: 20px;
      }

      #carrito-lateral {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(estilos);
}
aplicarResponsive() 
;
