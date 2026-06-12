<template>
    <div v-if="rutas.length" class="bg-white dark:bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Maestra de Rutas</h1>
            <button @click="crearRuta()"
                class="bg-[#ffc107] hover:bg-[#e0a800] text-black font-semibold px-4 py-2 rounded-lg shadow-md transition-all uppercase text-xs">
                Nuevo Rutas
            </button>
        </div>

        <div class="mb-4">
            <div class="flex space-x-2">
                <input type="text" placeholder="Buscar paradero" v-model="fRutas" @input="filtrarParadero"
                class="border border-gray-300 rounded-lg px-3 py-2 w-1/2 text-sm" />

                <select v-model="fEstado" @change="filtrarParadero"
                    class="border border-gray-300 rounded-lg px-3 py-2 w-1/2 text-sm">
                    <option value="">Seleccionar Estado</option>
                    <option value="1" class="text-sm">ACTIVO</option>
                        <option value="0" class="text-sm">INACTIVO</option>
                </select>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto w-full">
            <table class="min-w-full border border-gray-[#212529] dark:border-gray-[#212529] rounded-lg">
                <thead class=" text-white bg-[#212529]">
                    <tr class="text-left uppercase text-xs">
                        <th class="px-2 py-2">NOMBRE</th>
                        <th class="px-2 py-2 hidden sm:table-cell">PARADERO ORIGEN</th>
                              <th class="px-2 py-2 hidden sm:table-cell">PARADERO DESTINO</th>
                        <th class="px-2 py-2 hidden sm:table-cell">ESTADO</th>
                        <th class="px-2 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="rutas in rutasFiltrados" :key="rutas.id_ruta">
                        <tr class="dark:border-gray-300 uppercase text-xs font-medium">
                            <td class="px-2 py-2 border border-gray-300">
                                <div class="flex items-center">
                                    <button @click="toggleDetalles(rutas.id_ruta)"
                                    class="bg-[#ffc107] hover:bg-b[#e0a800] text-white font-semibold px-1 py-1 rounded-lg shadow-md transition-all block sm:hidden mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                {{ rutas.nombre }}    
                                </div>
                                
                            </td>
                            <td class="px-2 py-2 border border-gray-300 hidden sm:table-cell">{{ rutas.paradero_origen }}</td>
                             <td class="px-2 py-2 border border-gray-300 hidden sm:table-cell">{{ rutas.paradero_destino }}</td>
                            <td class="px-2 py-2 border border-gray-300 hidden sm:table-cell">
                               <div :class="{'bg-[#008000] text-white text-center': rutas.estado == '1',
                                'text-white text-center bg-[#fb2c36]': rutas.estado == '0'}" class="p-2 rounded text-xs">
                                    {{ rutas.estado == '1' ? 'ACTIVO' : 'INACTIVO' }}
                                </div>
                            </td>
                            <td class="px-2 py-2 border border-gray-300">
                                <button @click="editarRutas(rutas)"
                                    class="bg-[#212529] hover:bg-[#313539] text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all uppercase text-xs  ">
                                    EDITAR
                                </button>
                            </td>
                        </tr>
                        <tr v-if="detallesVisible === rutas.id_ruta"
                            class="border border-gray-300 uppercase text-xs font-medium sm:hidden">
                            <td colspan="4" class="border border-gray-300 px-4 py-2">
                                <div>Rol: {{ rutas.ubicacion }} </div>
                                <div>Estado: {{  rutas.estado == '1' ? 'ACTIVO' : 'INACTIVO' }} </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Paginación -->
        <div class="flex justify-end items-center mt-4 text-white text-xs gap-1">
            <button @click="previousPage" :disabled="currentPage === 1"
                class="px-3 py-2 bg-gray-500 rounded disabled:opacity-50">
                Anterior
            </button>
            <button v-for="page in paginatedPages" :key="page" @click="setPage(page)"
                :class="{ 'bg-[#0d6efd]': currentPage === page, 'bg-gray-500': currentPage !== page }"
                class="px-3 py-2 rounded">
                {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-3 py-2 bg-gray-500 rounded disabled:opacity-50">
                Siguiente
            </button>
        </div>
    </div>
    <p v-else class="text-gray-500 mt-4">No hay paraderos disponibles.</p>
</template>

<script>
import api from "../services/api";

export default {
    name: "Rutas",
    data() {
        return {
            detallesVisible: null,
            rutas: [],
            fRutas: "",
            fEstado: "",
            currentPage: 1,
            pageSize: 5,
        };
    },
    computed: {
        rutasFiltrados() {

            const filtered = this.rutas.filter(ruta => {

                const matchesNombre =ruta.nombre.toLowerCase().includes(this.fRutas.toLowerCase());

                const matchesEstado = this.fEstado? ruta.estado === this.fEstado: true;

                return matchesNombre && matchesEstado;

            });

            const start = (this.currentPage - 1) * this.pageSize;

            return filtered.slice(start, start + this.pageSize);
        },
        paginatedPages() {
            const pages = [];
            const totalPages = this.totalPages;
            const maxVisible = 3;

            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        },
        totalPages() {
            const filteredCount = this.rutas.filter(ruta => {
                  
                const matchesNombre = ruta.nombre.toLowerCase().includes(this.fRutas.toLowerCase());

                const matchesEstado = this.fEstado ? ruta.estado === this.fEstado : true;

                return matchesNombre && matchesEstado;
            }).length;

            return Math.ceil(filteredCount / this.pageSize);
        },
    },
    methods: {
        toggleDetalles(id) {
            this.detallesVisible = this.detallesVisible === id ? null : id;
        },
        async otenerRutas() {
            
            try {
                const response = await api.get(`/rutas/listar.php`);

                if (response.status === 200) {
                    this.rutas = response.data.data || [];
                } else {
                    console.error('Error en la respuesta del servidor:', response);
                }

            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        },
        editarRutas(ruta) {
            this.$router.push({ name: 'EditarRuta', query: { rutaId: ruta.id_ruta } });
        },
        crearRuta() {
            this.$router.push({ name: 'CrearRutas' });
        },
        filtrarParadero() {
            this.fRutas = this.fRutas.toUpperCase();
            this.currentPage = 1;
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        setPage(page) {
            this.currentPage = page;
        }
    },
    mounted() {
        this.otenerRutas();
    },
};
</script>