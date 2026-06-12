<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-9 md:grid-rows-1 tablet:grid-rows-custom mobile:grid-rows-custom  gap-2">
    <!--mobile:grid-rows-custom-->
    <div
      class="bg-[#fff] p-4 text-white rounded-lg sm:col-span-3 sm:col-start-1 sm:row-start-1 flex flex-col justify-center border-[#0f95ec] border-r-8 gap-2">
      <p class="text-black font-semibold text-sm text-center sm:text-left">Viajes Hoy</p>
      <div class="flex space-x-3 justify-between items-center">
        <p class="text-black font-bold text-base text-5xl"> {{ totalViajes }} <p class="text-black font-bold text-base  text-xs">Ver detalles</p></p>
          <img src="../assets/imgstatic.jpg" alt="" class="w-60 h-30">
   
      </div>
    </div>

    <div
      class="bg-[#fff] p-4 text-white rounded-lg sm:col-span-3 sm:col-start-4 sm:row-start-1 flex flex-col justify-center border-[#06a84d] border-r-8 gap-2">
      <p class="text-black font-semibold text-sm  text-center sm:text-left">En ruta</p>
      <div class="flex  space-x-3  justify-between n items-center">
        <p class="text-black font-bold text-base text-5xl">{{ totalEnRuta }}<p class="text-black font-bold text-base  text-xs">Ver detalles</p> </p>
                   <img src="../assets/imagestat.png" alt="" class="w-60 h-30">   
      </div>
    </div>
    <div
      class="bg-[#fff] p-4 text-white rounded-lg sm:col-span-3 sm:col-start-7 sm:row-start-1 flex flex-col justify-center border-[#730375] border-r-8 gap-2">
      <p class="text-black font-semibold text-sm text-center sm:text-left">Total de Abastecimiento</p>
      <div class="flex  space-x-3 justify-between items-center">
        
        <p class="text-black font-bold text-base text-5xl">  {{ totalFinalizados }}<p class="text-black font-bold text-base  text-xs">Ver detalles</p> </p>
   <img src="../assets/imagestat2.png" alt="" class="w-60 h-30">
      </div>
    </div>

    <div
      class="bg-white p-4 rounded-lg sm:col-span-3 sm:row-span-2 sm:col-start- sm:row-start-2 shadow-lg border-[#4e4e4e] border-t-4 relative">
      <!-- Título con icono de configuración -->
      <div class="flex justify-between items-center relative">
        <button v-if="!esMovil" @click="expandirGrafico('combustible')" class="text-gray-600 hover:text-black focus:outline-none">
          🔍
        </button>
        <div>
          <h3 class="text-center font-bold text-black uppercase text-sm flex-1">Mostrar por  Ruta (hoy)</h3>
          <p  class="text-center text-xs font-[500] text-gray-600">
            {{ mostrarRango() }}
          </p>
          <div v-if="mensajeError" class="text-center text-xs font-[500] text-red-600">
            {{ mensajeError }}
          </div>
        </div>
       
        <div class="relative">
          <button @click="mostrarOpciones = !mostrarOpciones" class="text-gray-600 hover:text-black focus:outline-none">
            
          </button>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="relative z-10">
        <apexchart ref="graficoExpandido" type="donut" :options="chartOptionsViajes" :series="chartSeriesViajes" class="flex justify-center"></apexchart>
      </div>
    </div>
    

    <div v-if="graficoExpandido"
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] z-50 p-8 bg-white shadow-lg flex flex-col items-center justify-center rounded-lg">

      <button @click="cerrarGrafico" class="absolute top-4 right-4 bg-red-500 text-white px-2 py-2 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div>
        <h3 class="text-center font-bold text-black uppercase text-sm mb-2">
          {{ graficoExpandido === 'combustible' ? 'Venta de Combustible' : graficoExpandido === 'tarjetas' ? 'Venta por Tarjetas': graficoExpandido === 'pago' ? 'Venta por Forma de Pago': graficoExpandido === 'operador' ? 'Venta por Operador':  graficoExpandido === 'vehiculo' ? 'Venta por Tipo de Vehiculo': graficoExpandido === 'combustibles' ? 'Venta de Combustible': 'Venta ' }}
        </h3>
        <p v-if="rangoFiltradoExpandido()" class="text-center text-xs font-[500] text-gray-600">
          {{rangoFiltradoExpandido()}}
        </p>
      </div>

      <div class="w-[50%] h-full flex items-center justify-center">
        <apexchart ref="graficoExpandido" type="donut"
          :options="graficoExpandido === 'combustible' ? chartOptions : graficoExpandido === 'tarjetas' ? chartOptionsPorTarjetas : graficoExpandido === 'pago' ? chartOptionsTPago :  graficoExpandido === 'operador' ? chartOptionsPorOperador : graficoExpandido === 'vehiculo' ? chartOptionsPorVehiculo  : graficoExpandido === 'combustibles' ? chartOptionCombustible : chartOptionsTPago"
          :series="graficoExpandido === 'combustible' ? chartSeries : graficoExpandido === 'tarjetas' ? chartSeriesPorTarjetas : graficoExpandido === 'pago' ? chartSeriesTPago : graficoExpandido === 'operador' ? chartSeriesPorOperador : graficoExpandido === 'vehiculo' ? chartSeriesPorVehiculo : graficoExpandido === 'combustibles' ? chartSerieCombustible : chartSeriesTPago" class="w-full h-full">
        </apexchart>
      </div>
    </div>
    

    <div class="bg-white p-2 rounded-lg sm:col-span-6 sm:row-span-2 sm:col-start-1 sm:row-start-2 border-[#000] border-t-4">
      <div>
          <h3 class="text-center font-bold text-black uppercase text-sm flex-1 top-30">Ultimos Viajes</h3>
      <h3 class="text-center font-bold text-white uppercase text-sm flex-1 top-30">Ultimos Viajes</h3>
      </div>
      <div class="overflow-x-auto max-h-[450px]">
        <table
          class="table-fixed w-full text-sm text-center text-black border border-gray-500 rounded-xl overflow-hidden ">
          <thead class="bg-gray-300 text-xxs font-bold text-black">
            <tr>
              <th class="w-1/12 px-1 py-1 border border-gray-500 ">#</th>
              <th class="w-1/2 px-2 py-2 border border-gray-500">TAXISTA</th>
              <th class="w-1/2 px-2 py-2 border border-gray-500">PLACA</th>
              <th class="w-1/2 px-2 py-2 border border-gray-500">RUTA</th>
              <th class="w-1/2 px-2 py-2 border border-gray-500">SALIDA</th>
              <th class="w-1/2 px-2 py-2 border border-gray-500">LLEGADA</th>
              <th class="w-1/2 px-2 py-2 border border-gray-500 rounded-tr-xl">ESTADO</th>
            </tr>
          </thead>
          <tbody class="text-xxs font-medium bg-gray-100">
            <tr  v-for="registros in listaViajes" :key="registros.id_registro">
              <td class="px-1 py-1 border border-gray-500">{{ registros.id_registro }}</td>
              <td class="px-2 py-2 border border-gray-500 text-left">{{ registros.taxista }}</td>
              <td class="px-2 py-2 border border-gray-500">{{ registros.placa }}</td>
              <td class="px-2 py-2 border border-gray-500">{{ registros.ruta }}</td>
              <td class="px-2 py-2 border border-gray-500">{{ registros.hora_salida }}</td>
              <td class="px-2 py-2 border border-gray-500">{{ registros.hora_llegada }}</td>
               <td class="px-2 py-2 border border-gray-500">  <span
                  :class="[
                    'px-2 py-1 rounded-full text-white font-semibold text-xxs',
                    registros.estado === 'FINALIZADO'
                      ? 'bg-green-500'
                      : registros.estado === 'EN_RUTA'
                      ? 'bg-cyan-500'
                      : 'bg-gray-500'
                  ]"
                >
    {{ registros.estado }}
  </span></td>
            </tr>
       
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../services/api";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "UserDashboard",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {

      listaViajes: [],

    chartSeriesViajes: [],

      totalViajes: 0,
    totalEnRuta: 0,
    totalFinalizados: 0,

    chartOptionsViajes: {
  labels: ["Finalizados", "En Ruta"],
  colors: ["#22c55e", "#2563eb"],
  legend: {
    position: "bottom"
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
       labels: {
          show: true,
          total: {
            show: true,
            label: "Viajes",
            fontSize: "14px",
            fontWeight: 600,
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            }
          }
        }
      }
    }
  }
}
    };  
  },
  methods: {
    obtenerDatosGrafico() {
  const finalizados = this.listaViajes.filter(
    viaje => viaje.estado === "FINALIZADO"
  ).length;

  const enRuta = this.listaViajes.filter(
    viaje => viaje.estado === "EN_RUTA"
  ).length;

  this.chartSeriesViajes = [finalizados, enRuta];

  this.chartOptionsViajes = {
    labels: ["Finalizados", "En Ruta"],
    legend: {
      position: "bottom"
    },
    colors: ["#22c55e", "#06b6d4"]
  };
},
     async obtenerViajes() {
      try {
        const response = await api.get(`/registro/listar.php`);

                if (response.status === 200) {
                    this.listaViajes = response.data.data || [];

                        this.totalViajes = this.listaViajes.length;

    this.totalEnRuta = this.listaViajes.filter(
        viaje => viaje.estado === "EN_RUTA"
    ).length;

    this.totalFinalizados = this.listaViajes.filter(
        viaje => viaje.estado === "FINALIZADO"
    ).length;

                       this.obtenerDatosGrafico();
                } else {
                    console.error('Error en la respuesta del servidor:', response);
                }

      } catch (error) {
        console.error('Error al obtener los viajes:', error);
      }
    },
     mostrarRango() {
      if (this.rangoFiltrado) {
        return `Desde ${this.rangoFiltrado.split(' - ')[0]} hasta ${this.rangoFiltrado.split(' - ')[1]}`;
      }
      return '';
    },
     rangoFiltradoExpandido() {
      if (this.rangoFiltrado) {
        return `Desde ${this.rangoFiltrado.split(' - ')[0]} hasta ${this.rangoFiltrado.split(' - ')[1]}`;
      }
      return '';
    },
  },
  mounted() {
    this.obtenerViajes();
  
    window.addEventListener('resize', () => {
    this.esMovil = window.innerWidth < 768;});
  },

};
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.apexcharts-canvas {
  padding: 0 !important;
  margin: 0 !important;
}

@media (max-width: 1200px) {
  .mobile\:bottom-\[25px\] {
  /*  bottom: -10px;*/
  }
}

@media (max-width: 768px) and (min-width: 640px) {
  .mobile\:bottom-\[20px\] {
    bottom: 70px;
  }

  .tablet\:grid-rows-custom {
    grid-template-rows: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .mobile\:bottom-\[20px\] {
    bottom: 70px;
  }

  .mobile\:grid-rows-custom {
    grid-template-rows: repeat(15, minmax(0, 1fr));
  }
}

.scroll-delgado::-webkit-scrollbar {
  height: 6px; /* más delgado */
}
.scroll-delgado::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-delgado::-webkit-scrollbar-thumb {
  background-color: #a8a8a8;
  border-radius: 20px;
}
.text-xxs{
  font-size: 0.65rem;
}
</style>