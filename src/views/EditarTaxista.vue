<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Editar Ruta</h1>
        </div>

        <form @submit.prevent="guardarCambios">
            <!-- Segunda fila -->
            <label class="block text-[#0018b2] mb-2 text-xs font-bold tracking-wider">
                DATOS DEL RUTA:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Nombre:</label>
                    <input type="text" v-model="taxista.nombre" id="nombre"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
                </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="dni" class="block text-sm font-medium text-black">DNI:</label>
                    <input type="text" v-model="taxista.dni" id="dni"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>

  </div>
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="telefono" class="block text-sm font-medium text-black">Teléfono:</label>
                    <input type="text" v-model="taxista.telefono" id="telefono"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>

  </div>
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="placa" class="block text-sm font-medium text-black">Placa:</label>
                    <input type="text" v-model="taxista.placa" id="placa"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
            </div>

               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="modelo" class="block text-sm font-medium text-black">Modelo:</label>
                    <input type="text" v-model="taxista.modelo" id="modelo"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
            </div>

               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="color" class="block text-sm font-medium text-black">Color:</label>
                    <input type="text" v-model="taxista.color" id="color"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
            </div>

               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="codigo_nfc?" class="block text-sm font-medium text-black">Código NFC:</label>
                    <input type="text" v-model="taxista.codigo_nfc" id="codigo_nfc"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4 mt-6">
                <button type="submit"
                    class="px-6 py-3 bg-[#ffc107] font-semibold text-black rounded-lg shadow-md hover:bg-[#e0a800] uppercase text-xs">
                    Guardar Cambios
                </button>
                <button @click="volver"
                    class="px-6 py-3 bg-[#212529] font-semibold text-white rounded-lg shadow-md hover:bg-[#313539] uppercase text-xs">
                    Volver
                </button>
            </div>
        </form>

        <!-- Mensaje de alerta -->
        <div v-if="alertMessage" class="mt-4 p-2 text-sm text-white bg-[#008000] rounded-md">
            {{ alertMessage }}
        </div>
        <!-- Mensaje de alerta - ERROR -->
        <div v-if="alertMessageError" class="mt-4 p-2 text-sm text-white bg-[#ff0000] rounded-md">
            {{ alertMessageError }}
        </div>
    </div>
</template>


<script>
import api from "../services/api";

export default {
    name: "EditarTaxista",
    data() {
        return {
      
            taxista: {
                id: null,
                id_taxista: "",
                nombre: "",
                dni: "",
                telefono: "",
                placa: "",
                modelo: "",
                color: "",
                codigo_nfc: "",
                estado: "0",
            },
            alertMessage: "",
            alertMessageError: "",
              errorMessages: {
                nombre: "",
            },
        };
    },
    methods: {
        async obtenerTaxista() {
            const taxistaId = this.$route.query.taxistaId;
            try {
                const response = await api.get(`/taxista/obtener.php?id_taxista=${taxistaId}`);

                if (response.data.status ) {
                    this.taxista = response.data.data;
                } else {
                    console.error('Error al obtener el taxista:', response);
                }
            } catch (error) {
                console.error("Error al cargar el taxista:", error);
            }
        },
       async cargarDatos() {
            try {
                await Promise.all([this.obtenerTaxista()]);
            } catch (error) {
                console.error('Error al cargar los datos del taxista.', error);
            }
        },
        async guardarCambios() {
            if (!this.validateForm()) return;

            const datos = {
                   id_taxista: this.taxista.id_taxista,
    nombre: this.taxista.nombre,
    dni: this.taxista.dni,
    telefono: this.taxista.telefono,
    placa: this.taxista.placa,
    modelo: this.taxista.modelo,
    color: this.taxista.color,
    codigo_nfc: this.taxista.codigo_nfc
            };

            try {
                const response = await api.put(`/taxista/editar.php`, datos);

                if (response.status === 200) {
                    this.mostrarNotificacion('Taxista actualizado correctamente.', () => {
                        this.volver();
                    });
                  //  this.limpiarFormulario();
                } else {
                    this.mostrarNotificacionError(response.data.mensajeError || 'Error al guardar el taxista', () => {
                    });
                }
            } catch (error) {
                this.mostrarNotificacionError(error.message || 'Error desconocido', () => {
                });
            }
        },
        validateForm() {
            let isValid = true;
            this.errorMessages = {};

            /*if (!this.password) {
                this.errorMessages.password = '* El campo contraseña es obligatorio';
                isValid = false;
            } else if (this.password.length < 8) {
                this.errorMessages.password = '* El campo contraseña debe contener al menos 8 caracteres.';
                isValid = false;
            }

            if (!this.passwordConfirmation) {
                this.errorMessages.passwordConfirmation = '* El campo confirmar contraseña es obligatorio';
                isValid = false;
            } else if (this.password !== this.passwordConfirmation) {
                this.errorMessages.passwordConfirmation = '* Las contraseña son distintas';
                isValid = false;
            }*/

            return isValid;
        },
        mostrarNotificacion(mensaje, callback) {
            this.alertMessage = mensaje;
            setTimeout(() => {
                this.alertMessage = "";
                if (callback) callback();
            }, 2000);
        },
        mostrarNotificacionError(mensaje, callback) {
            this.alertMessageError = mensaje
            setTimeout(() => {
                this.alertMessageError = "";
                if (callback) callback();
            }, 3000);
        },
        volver() {
            this.$router.push({ name: 'Taxista' });
        },
    },
    mounted() {
        this.cargarDatos();
    },
};
</script>