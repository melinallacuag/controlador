<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Editar Usuario</h1>
        </div>

        <form @submit.prevent="guardarCambios">
            <!-- Segunda fila -->
            <label class="block text-[#0018b2] mb-2 text-xs font-bold tracking-wider">
                DATOS DEL USUARIO:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="rol" class="block text-sm font-medium text-black">Rol:</label>
                    <select v-model="usuario.rol" id="rol"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="" selected>SELECCIONAR ROL</option>
                        <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol" class="text-sm">
                            {{ rol.nombre }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="estado" class="block text-sm font-medium text-black">Estado:</label>
                    <select v-model="usuario.estado" id="estado"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="1" class="text-sm">ACTIVO</option>
                        <option value="0" class="text-sm">INACTIVO</option>
                    </select>
                </div>
            </div>
            <!-- Primera fila -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Raz. Social / Nombre
                        Completo:</label>
                    <input type="text" v-model="usuario.nombre" id="nombre" disabled
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full bg-gray-100 cursor-not-allowed text-sm" />
                </div>
            </div>
            <label class="block font-bold text-[#0018b2] mb-2 text-xs tracking-wider">
                CREDENCIALES DEL USUARIO:
            </label>
            <!-- Tercera fila -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label for="usuario" class="block text-sm font-medium text-black">ID Usuario:</label>
                    <input type="text" v-model="usuario.usuario" id="usuario" disabled
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full bg-gray-100 cursor-not-allowed text-sm" />
                </div>
                <div>
                    <label for="contraseña" class="block text-sm font-medium text-black">Contraseña *</label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" id="contraseña"
                            @input="errorMessages.password = ''" placeholder="Ingresar Contraseña"
                            class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                        <span @click="toggleShowPassword"
                            class="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer">
                            <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </span>

                    </div>
                    <div class="block text-sm font-medium text-black text-end">
                        Mínimo 8 dígitos
                    </div>
                    <div v-if="errorMessages.password" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.password }}
                    </div>
                </div>
                <div>
                    <label for="confirmar_contraseña" class="block text-sm font-medium text-black">Confirmar
                        Contraseña *</label>
                    <div class="relative">
                        <input  :type="showPasswordConfirmation ? 'text' : 'password'" v-model="passwordConfirmation" id="confirmar_contraseña"
                            @input="errorMessages.passwordConfirmation = ''" placeholder="Confirmar Contraseña"
                            class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                            <span @click="toggleShowPasswordConfirmation"
                            class="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer">
                            <i :class="showPasswordConfirmation ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </span>
                    </div>
                    <div class="block text-sm font-medium text-black text-end">
                        Mínimo 8 dígitos
                    </div>
                    <div v-if="errorMessages.passwordConfirmation" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.passwordConfirmation }}</div>
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
    name: "EditarUsuario",
    data() {
        return {
            roles: [],
            usuario: {
                id: null,
                id_usuario: "",
                nombre: "",
                rol: "",
                estado: "0",
                usuario: "",
            },
            password: "",
            passwordConfirmation: "",
            alertMessage: "",
            alertMessageError: "",
            errorMessages: {
                password: "",
                passwordConfirmation: "",
            },
            showPassword: false,
            showPasswordConfirmation: false,
        };
    },
    methods: {
        async obtenerUsuario() {
            const usuarioId = this.$route.query.usuarioId;

            try {
                const response = await api.get(`/usuario/obtener.php?id_usuario=${usuarioId}`);

                if (response.data.status ) {
                    this.usuario = response.data.data;

                    this.usuario.rol = this.usuario.id_rol || "";
                } else {
                    console.error('Error al obtener el usuario:', response);
                }
            } catch (error) {
                console.error("Error al cargar el usuario:", error);
            }
        },
        async obtenerRoles() {

            try {
                const response = await api.get(`/roles/listar.php`);

                if (response.status === 200) {
                    this.roles = response.data.data || [];
                } else {
                    console.error('Error al obtener los roles:', response);
                }
            } catch (error) {
                console.error("Error al cargar los roles:", error);
            }
        },
       async cargarDatos() {
            try {
                await Promise.all([this.obtenerUsuario(), this.obtenerRoles()]);
                this.usuario.rol = this.usuario.id_rol || "";
            } catch (error) {
                console.error('Error al cargar los datos del usuario.', error);
            }
        },
        async guardarCambios() {
            if (!this.validateForm()) return;

            const datos = {
                id_usuario: this.usuario.id_usuario,
                nombre: this.usuario.nombre,
                usuario: this.usuario.usuario,
                 id_rol: this.usuario.rol,
                estado: this.usuario.estado,
                password: this.password
            };

            try {
                const response = await api.put(`/usuario/editar.php`, datos);

                if (response.status === 200) {
                    this.mostrarNotificacion('Usuario actualizado correctamente.', () => {
                        this.volver();
                    });
                    this.limpiarFormulario();
                } else {
                    this.mostrarNotificacionError(response.data.mensajeError || 'Error al guardar el usuario', () => {
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

            if (!this.password) {
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
            }

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
        limpiarFormulario() {
            this.password = "";
            this.passwordConfirmation = "";
            this.errorMessages = {};
        },
        volver() {
            this.$router.push({ name: 'Usuario' });
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
        toggleShowPasswordConfirmation() {
            this.showPasswordConfirmation = !this.showPasswordConfirmation;
        },
    },
    mounted() {
        this.cargarDatos();
    },
};
</script>