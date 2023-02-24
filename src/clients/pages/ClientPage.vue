<script setup lang='ts'>
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type LoadingModalVue from '@/shared/components/LoadingModal.vue';
import useClient from '../composables/useClient';
import type { Client } from '@/clients/interfaces/client';
import { useMutation } from '@tanstack/vue-query';
import clientApi from '@/api/clients-api';

const route = useRoute();
const router = useRouter();

const { client, isLoading, isError } = useClient(+route.params.id);

const updateClient = async( client: Client ):Promise<Client> => {
    const { data } = await clientApi.patch(`/clients/${client.id}`, client);
    return data;
}

const clientMutation = useMutation(updateClient, {
    onSuccess: (data) => {
        console.log('onSuccess', data);
    },
    onError: (error) => {
        console.log('onError', error);
    },
});

watch( clientMutation.isSuccess, () => {
        setTimeout(() => {
            clientMutation.reset();
        }, 2000);
})

watch( isError, () => {
    if( isError.value ){
        router.replace('/clients');
    }
} )

</script>

<template>
    <h3 v-if="clientMutation.isLoading.value">Guardando...</h3>
    <h3 v-if="clientMutation.isSuccess.value">Guardado</h3>

    <LoadingModalVue v-if="isLoading"/>

    <div v-if="client">
        <h1>{{ client.name }}</h1>
        <form @submit.prevent="clientMutation.mutate(client!)">
            <input 
                type="text"
                placeholder="Nombre del cliente"
                v-model="client.name"
            >
            <br>
            <input 
                type="text"
                placeholder="direccion"
                v-model="client.address"
            >
            <br>
            <button 
                type="submit"
                :disabled="clientMutation.isLoading.value"
            >Guardar</button>
        </form>
    </div>
    <code>
        {{ client  }}
    </code>
</template>

<style scoped>
    input{
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    input:focus{
        border: 3px solid #4CAF50;
    }
    button{
        width: 100%;
        background-color: #4CAF50;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>