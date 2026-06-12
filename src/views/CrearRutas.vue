<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Crear Rutas</h1>
        </div>

        <form @submit.prevent="crearRutas">
            <!-- Segunda fila -->
            <label class="block text-[#0018b2] mb-2 text-xs font-bold tracking-wider">
                DATOS DEL RUTAS:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Nombre de rutas
                        *</label>
                    <input type="text" v-model="nombre" id="nombre" @input="handleInputRNombre"
                        placeholder="Ingresar Nombre Completo"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm" />
                    <div v-if="errorMessages.nombre" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.nombre }}
                    </div>
                </div>
              <div>
                    <label for="paradero" class="block text-sm font-medium text-black">Paradero *</label>
                    <select v-model="id_paradero_origen" id="paradero" @change="errorMessages.paradero = ''"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="" selected>Seleccionar Paradero</option>
                        <option v-for="paradero in paraderos" :key="paradero.id_paradero" :value="paradero.id_paradero" class="text-sm">
                            {{ paradero.nombre }}
                        </option>
                    </select>
                    <div v-if="errorMessages.paradero" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.paradero }}
                    </div>
                </div>
                <div>
                    <label for="paradero" class="block text-sm font-medium text-black">Paradero *</label>
                    <select v-model="id_paradero_destino" id="paradero" @change="errorMessages.paradero = ''"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="" selected>Seleccionar Paradero</option>
                        <option v-for="paradero in paraderos" :key="paradero.id_paradero" :value="paradero.id_paradero" class="text-sm">
                            {{ paradero.nombre }}
                        </option>
                    </select>
                    <div v-if="errorMessages.paradero" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.paradero }}
                    </div>
                </div>
                <div>
                    <label for="estado" class="block text-sm font-medium text-black">Estado *</label>
                    <select id="estado" v-model="rutaEstado"
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
    name: "CrearRutas",
    data() {
        return {
             paraderos: [],
             id_paradero_origen: "",
            id_paradero_destino: "",
            alertMessage: "",
            alertMessageError: "",
            rutaEstado: "1",
            nombre: "",
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
            this.$router.push({ name: 'Rutas' });
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
async obtenerParadero() {


            try {
                const response = await api.get(`/paraderos/listar.php`);

                if (response.status === 200) {
                    this.paraderos = response.data.data || [];
                } else {
                    console.error('Error al obtener los roles:', response);
                }
            } catch (error) {
                console.error("Error al cargar los roles:", error);
            }
        },
        async crearRutas() {

            if (!this.validateForm()) return;

            try {

                const response = await api.post(
                    `/rutas/guardar.php`,
                    {
                        nombre: this.nombre,
                        id_paradero_origen: this.id_paradero_origen,
                        id_paradero_destino: this.id_paradero_destino,
                        estado: this.rutaEstado
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.data.status) {

                    this.mostrarNotificacion("Paradero guardado correctamente");

                    this.limpiarFormulario();

                } else {

                    this.mostrarNotificacionError(response.data.message);

                }

            } catch (error) {

                console.error(error);

                this.mostrarNotificacionError("Error al guardar paradero");

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
    mounted() {
        this.obtenerParadero();
    },
};
</script>