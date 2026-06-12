<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Crear Taxista</h1>
        </div>

        <form @submit.prevent="crearTaxista">
            <!-- Segunda fila -->
            <label class="block text-[#0018b2] mb-2 text-xs font-bold tracking-wider">
                DATOS DEL RUTAS:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Nombre del Taxista
                        *</label>
                    <input type="text" v-model="nombre" id="nombre" @input="handleInputRNombre"
                        placeholder="Ingresar Nombre Completo"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                    <div v-if="errorMessages.nombre" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.nombre }}
                    </div>
                </div>
                 <div>
                    <label for="dni" class="block text-sm font-medium text-black">DNI</label>
                    <input type="text" v-model="dni" id="dni" placeholder="Ingresar DNI"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                          <div v-if="errorMessages.dni" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.dni }}
                    </div>
                 </div>

                 <div>
                    <label for="telefono" class="block text-sm font-medium text-black">Teléfono</label>
                    <input type="text" v-model="telefono" id="telefono" placeholder="Ingresar Teléfono"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                          <div v-if="errorMessages.telefono" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.telefono }}
                    </div>
                 </div>

                 <div>
                    <label for="placa" class="block text-sm font-medium text-black">Placa</label>
                    <input type="text" v-model="placa" id="placa" placeholder="Ingresar Placa"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                          <div v-if="errorMessages.placa" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.placa }}
                    </div>
              
                 </div>

                 <div>
                    <label for="modelo" class="block text-sm font-medium text-black">Modelo</label>
                    <input type="text" v-model="modelo" id="modelo" placeholder="Ingresar Modelo"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                          <div v-if="errorMessages.modelo" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.modelo }}
                    </div>
                 </div>

                 <div>
                    <label for="color" class="block text-sm font-medium text-black">Color</label>
                    <input type="text" v-model="color" id="color" placeholder="Ingresar Color"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                          <div v-if="errorMessages.color" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.color }}
                    </div>
                 </div>

                   <div>
                    <label for="codigo_nfc" class="block text-sm font-medium text-black">Código NFC</label>
                    <input type="text" v-model="codigo_nfc" id="codigo_nfc" placeholder="Ingresar Código NFC"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                          <div v-if="errorMessages.codigo_nfc" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.codigo_nfc }}
                    </div>
                 </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4 mt-6">
                <button type="submit"
                    class="px-6 py-3 bg-[#ffc107] font-semibold text-black rounded-lg shadow-md hover:bg-[#e0a800] uppercase text-xs">
                    Guardar Paradero
                </button>
                <button @click="volver"
                    class="px-6 py-3 bg-[#212529] font-semibold text-white rounded-lg shadow-md hover:bg-[#313539] uppercase text-xs">
                    Volver
                </button>
            </div>
        </form>

        <!-- Mensaje de alerta - CORRECTO -->
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
    name: "CrearTaxista",
    data() {
        return {
           alertMessage: "",
            alertMessageError: "",
           
        nombre: "",
        dni: "",
        telefono: "",

        placa: "",
        modelo: "",
        color: "",

        codigo_nfc: "",

        rutaEstado: "1",
        alertMessage: "",
        alertMessageError: "",
        errorMessages: {
                nombre: ""
        },
    };
    },
    methods: {
        handleInputRNombre() {
            this.nombre = this.nombre.toUpperCase();
            this.errorMessages.nombre = '';
        },
    
        volver() {
            this.$router.push({ name: 'Taxista' });
        },
        validateForm() {
            let isValid = true;
            this.errorMessages = {};

            if (!this.nombre) {
                this.errorMessages.nombre = '* El nombre es obligatorio';
                isValid = false;
            }

            return isValid;
        },
        async crearTaxista() {

            if (!this.validateForm()) return;

            try {

                const response = await api.post(
                    `/taxista/guardar.php`,
                    {
                        nombre: this.nombre,
                        dni: this.dni,
                        telefono: this.telefono,
                        placa: this.placa,
                        modelo: this.modelo,
                        color: this.color,
                        codigo_nfc: this.codigo_nfc
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.data.status) {

                    this.mostrarNotificacion("Taxista guardado correctamente");

                    this.limpiarFormulario();

                } else {

                    this.mostrarNotificacionError(response.data.message);

                }

            } catch (error) {

                console.error(error);

                this.mostrarNotificacionError("Error al guardar taxista");

            }
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
        
        limpiarFormulario() {
            this.nombre = "";
            this.id_paradero_origen = "";
            this.id_paradero_destino = "";
            this.rutaEstado = "1";
            this.errorMessages = {};
        },
    },
};
</script>