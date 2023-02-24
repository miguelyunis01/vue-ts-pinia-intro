import clientsApi from '@/api/clients-api';
import type { Client } from '@/clients/interfaces/client';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useClientsStore } from '@/store/clients';
import { watch } from 'vue';


const getClients = async ( page: number ):Promise<Client[]> => {

    const { data } = await clientsApi.get<Client[]>(`/clients?_page=${page}`);
    return data;
}


const useClients = () => {

    const store = useClientsStore();
    const { currentPage, totalPages, clients } = storeToRefs(store);



    const {isLoading, data} = useQuery(
        ['clients?page=', currentPage],
        () => getClients( currentPage.value ),
    );

    watch( data, clients => {
        if(clients) {
            store.setClients(clients);
        }
    })


    return {
        // State properties
        isLoading,
        clients,
        currentPage,
        totalPages,

        // Methods
        getPage( page: number ) {
            store.setPage(page);
        },
        // Getters
        /*  totalPageNumbers: computed(
            () => [...new Array(totalPages.value)].map( (v, i) => i + 1 )
        )  */
    }
}

export default useClients;