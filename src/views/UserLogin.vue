<template>
  <div class="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
    style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(https://powergroupsystem.com/cliente/img/background/grifo.jpg);">
    <div class="bg-white p-4 rounded-[25px] shadow-md w-full max-w-md">

      <div class="w-full flex items-center justify-center mb-6">
        <img src="../assets/LOGO-PAG.png" alt="Logo" class="h-[70px] mb-[20px] mt-[20px]">
      </div>

      <form @submit.prevent="handleLogin">
        <!-- <label for="codigo" class="block text-xl font-bold text-black text-center mb-4">Bienvenidos</label>-->

        <div class="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label for="codigo" class="block text-sm font-medium text-black">ID Usuario *</label>
            <input type="text" v-model="usuario" id="usuario" @input="handleInputIdUsuario"
              placeholder="Ingresar ID Usuario"
              class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
            <p v-if="errorMessages.usuario" class="text-red-500 text-xs ">{{ errorMessages.usuario }}</p>
          </div>
          <div>
            <label for="contraseña" class="block text-sm font-medium text-black">Contraseña *</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password"
                @input="handleInputContrasenaUsuario" placeholder="Ingresar Contraseña"
                class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
              <span @click="toggleShowPassword" class="absolute right-3 top-2 cursor-pointer">
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </span>
              <p v-if="errorMessages.password" class="text-red-500 text-xs">{{ errorMessages.password }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button type="submit"
            class="w-full px-6 py-3 bg-[#00a600] font-semibold text-white rounded-lg shadow-md hover:bg-[#24be24] uppercase text-xs">
            Iniciar Sesión
          </button>
        </div>
      </form>

      <div v-if="alertMessage" class="mt-4 p-2 text-sm text-white bg-[#008000] rounded-md">
        {{ alertMessage }}
      </div>
      <div v-if="alertMessageError" class="mt-4 p-2 text-sm text-white bg-[#ff0000] rounded-md">
        {{ alertMessageError }}
      </div>

      <div class="flex items-center justify-center my-4">
        <hr class="flex-grow border border-[#00a600]">
        <span class="px-5 text-black text-sm font-normal">Nuestras redes</span>
        <hr class="flex-grow border border-[#00a600]">
      </div>

      <div class="flex justify-center space-x-4 mt-4">
        <a href="https://www.facebook.com/profile.php?id=100092632664470&sfnsn=wa&mibextid=RUbZ1f"
          class="text-gray-800 hover:text-blue-600 text-lg" target="_blank"><i class="fab fa-facebook"></i></a>
        <a href="https://wa.me/971413612" class="text-gray-800 hover:text-green-600 text-lg" target="_blank"><i
            class="fab fa-whatsapp"></i></a>
        <a href="https://www.facebook.com/profile.php?id=100092632664470&sfnsn=wa&mibextid=RUbZ1f"
          class="text-gray-800 hover:text-pink-600 text-lg" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>

      <p class="text-black text-xs mt-3 text-center">2024 © Todos los derechos reservados por
        <a href="https://powergroupsystem.com" target="_blank"
          class="text-[#00a600] hover:text-[#24be24] hover:no-underline font-semibold">
          POWER GROUP SYSTEM
        </a>
      </p>

      <p class="text-black text-xs mt-2 text-center">Mesa de Ayuda:
        <a href="https://wa.me/971413612" target="_blank"
          class="text-[#00a600]  hover:text-[#24be24] hover:no-underline font-semibold">
          971413612
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "UserLogin",
  data() {
    return {
      usuario: "",
      password: "",
      alertMessage: "",
      alertMessageError: "",
      errorMessages: {
        usuario: "",
        password: "",
      },
      showPassword: false,
      showPasswordConfirmation: false,
    };
  },
  methods: {
    handleInputIdUsuario() {
      this.usuario = this.usuario.slice(0, 30);
      this.errorMessages.usuario = '';
    },
    handleInputContrasenaUsuario() {
      this.password = this.password.slice(0, 500);
      this.errorMessages.password = '';
    },
    validateForm() {
      let isValid = true;
      this.errorMessages = {};

      if (!this.usuario) {
        this.errorMessages.usuario = '* El campo usuario es obligatoria';
        isValid = false;
      }

      if (!this.password) {
        this.errorMessages.password = '* El campo contraseña es obligatorio';
        isValid = false;
      }

      return isValid;
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      if (!this.validateForm()) return;

      try {

         const response = await api.post(
          "/usuario/login.php",
          {
            usuario: this.usuario,
            password: this.password,
          }
        );

         const result = response.data;

          if(result.status){

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("usuario", result.data.nombre);
            localStorage.setItem("rol", result.data.rol);

            this.$router.push("/");

          }else{

            this.mostrarNotificacionError(result.message);

          }
      } catch (error) {
        this.mostrarNotificacionError("Error en la comunicación con el servidor.");
      }
    },
    mostrarNotificacionError(mensaje, callback) {
      this.alertMessageError = mensaje
      setTimeout(() => {
        this.alertMessageError = "";
        if (callback) callback();
      }, 3000);
    },
  },
  mounted() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      this.$router.push("/");
    } else {
      this.$router.replace("/login");
    }
  },
};


</script>