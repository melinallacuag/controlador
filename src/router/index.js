import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import UserLogin from "../views/UserLogin.vue";
import UserDashboard from "../views/Dashboard.vue";
import NavBarComponent  from "../layouts/NavBar.vue";
import Taxista from "../views/Taxista.vue";
import CrearTaxista from "../views/CrearTaxista.vue";
import EditarTaxista from "../views/EditarTaxista.vue";
import Usuario from "../views/Usuario.vue";
import CrearUsuario from "../views/CrearUsuario.vue";
import EditarUsuario from "../views/EditarUsuario.vue";
import Paradero from "../views/Paradero.vue";
import CrearParadero from "../views/CrearParadero.vue";
import EditarParadero from "../views/EditarParadero.vue";
import Controlador from "../views/Controlador.vue";
import CrearControlador from "../views/CrearControlador.vue";
import EditarControlador from "../views/EditarControlador.vue";
import Rutas from "../views/Rutas.vue";
import CrearRutas from "../views/CrearRutas.vue";
import EditarRuta from "../views/EditarRuta.vue";

export const  router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
   routes : [
    {
      path: "/login",
      name: "Login",
      component: UserLogin,
    },
    {
      path: "/",
      name: "Navbar",
      component: NavBarComponent ,
      children: [
        {
          path: "/",
          name: "Dashboard",
          component: UserDashboard,
        },
        {
          path: "/taxista",
          name: "Taxista",
          component: Taxista,
        },
             {
          path: '/editar-taxista',
          name: 'EditarTaxista',
          component: EditarTaxista,
        },
          {
          path: '/crear-taxista',
          name: 'CrearTaxista',
          component: CrearTaxista,
        },
        {
          path: "/usuario",
          name: "Usuario",
          component: Usuario,
        },
        {
          path: '/crear-usuario',
          name: 'CrearUsuario',
          component: CrearUsuario,
        },
         {
          path: '/editar-usuario',
          name: 'EditarUsuario',
          component: EditarUsuario,
        },
           {
          path: "/paradero",
          name: "Paradero",
          component: Paradero,
        },
         {
          path: '/crear-paradero',
          name: 'CrearParadero',
          component: CrearParadero,
        },
         {
          path: '/editar-paradero',
          name: 'EditarParadero',
          component: EditarParadero,
        },
          {
          path: '/controlador',
          name: 'Controlador',
          component: Controlador,
        },
            {
          path: '/crear-controlador',
          name: 'CrearControlador',
          component: CrearControlador,
        },
         {
          path: '/editar-controlador',
          name: 'EditarControlador',
          component: EditarControlador,
        },
        {
          path: '/rutas',
          name: 'Rutas',
          component: Rutas,
        },
        {
          path: '/crear-rutas',
          name: 'CrearRutas',
          component: CrearRutas,
        },
           {
          path: '/editar-ruta',
          name: 'EditarRuta',
          component: EditarRuta,
        },
      ],
    },
  
  ],
});

export default router;