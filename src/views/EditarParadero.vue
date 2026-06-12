<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Editar Paradero</h1>
        </div>

        <form @submit.prevent="guardarCambios">
            <!-- Segunda fila -->
            <label class="block text-[#0018b2] mb-2 text-xs font-bold tracking-wider">
                DATOS DEL PARADERO:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Nombre del Paradero:</label>
                    <input type="text" v-model="paraderos.nombre" id="nombre"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
                   <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Ubicación:</label>
                    <input type="text" v-model="paraderos.ubicacion" id="nombre"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
                <div>
                    <label for="estado" class="block text-sm font-medium text-black">Estado:</label>
                    <select v-model="paraderos.estado" id="estado"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="1" class="text-sm">ACTIVO</option>
                        <option value="0" class="text-sm">INACTIVO</option>
                    </select>
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
    name: "EditarParadero",
    data() {
        return {
            paraderos: {
                id: null,
                id_paradero: "",
                nombre: "",
                ubicacion: "",
                estado: "0",
            },
            alertMessage: "",
            alertMessageError: "",
        };
    },
    methods: {
        async obtenerParadero() {
            const paraderoId = this.$route.query.paraderoId;
            try {
                const response = await api.get(`/paraderos/obtener.php?id=${paraderoId}`);

                if (response.data.status ) {
                    this.paraderos = response.data.data;

                  //  this.usuario.rol = this.usuario.id_rol || "";
                } else {
                    console.error('Error al obtener el paradero:', response);
                }
            } catch (error) {
                console.error("Error al cargar el paradero:", error);
            }
        },
       async cargarDatos() {
            try {
                await Promise.all([this.obtenerParadero()]);
             //   this.usuario.rol = this.usuario.id_rol || "";
            } catch (error) {
                console.error('Error al cargar los datos del paradero.', error);
            }
        },
        async guardarCambios() {
            if (!this.validateForm()) return;

            const datos = {
                id_paradero: this.paraderos.id_paradero,
                nombre: this.paraderos.nombre,
                ubicacion: this.paraderos.ubicacion,
                estado: this.paraderos.estado
            };

            try {
                const response = await api.put(`/paraderos/editar.php`, datos);

                if (response.status === 200) {
                    this.mostrarNotificacion('Paradero actualizado correctamente.', () => {
                        this.volver();
                    });
                  //  this.limpiarFormulario();
                } else {
                    this.mostrarNotificacionError(response.data.mensajeError || 'Error al guardar el paradero', () => {
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
            this.$router.push({ name: 'Paradero' });
        },
    },
    mounted() {
        this.cargarDatos();
    },
};
</script>