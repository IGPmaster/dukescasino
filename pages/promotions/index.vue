<template>
    <div>
        <div class="container mx-auto pt-20">
            <h1 class="text-center">{{ msgTranslate?.promotions || 'Promotions' }}</h1>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-10">
            <div class="loading-placeholder" role="status" aria-live="polite">
                <svg class="spinner animate-spin w-12 h-12 mx-auto" viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
                </svg>
                <p class="mt-4">Loading promotions...</p>
            </div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="text-center py-10">
            <p class="text-red-600">Error loading promotions. Please try again later.</p>
        </div>
        
        <!-- Promotions content -->
        <div v-else-if="pp_promotions && pp_promotions.length > 0" class="container mx-auto">
            <div class="p-5 grid grid-cols-1 lg:grid-cols-2 my-10 bg-gray-300 shadow-black shadow-lg rounded-lg items-center"
                v-for="promo in pp_promotions" :key="promo.code">
                <img class="rounded-lg w-full"
                    :src="promo.bigImageUrl"
                    loading="lazy"
                    :alt="'Promotion banner: ' + promo.name + '. ' + promo.title + '. ' + promo.subTitle"
                    :title="promo.name + '. ' + promo.title">
                <div class="info px-10 grid grid-cols-* justify-between">
                    <h2 class="py-4">{{ promo.title }}</h2>
                    <h5 class="py-4">{{ promo.subTitle }}</h5>
                    <a :href="regLink"
                        class="w-full md:w-3/6 text-center py-4 mt-2 px-8 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800 uppercase">
                        {{ msgTranslate?.see_more || 'See More' }}
                    </a>
                    <div v-if="promo.disclaimer !== null">
                        <span v-html="promo.disclaimer" class="text-sm/[12px] py-5 text-slate-800/75"></span>
                        <span class="text-sm/[12px] py-5 text-slate-800/75">
                            <a :href="PP_LOBBY_LINK + 'promotions?code=' + promo.code" 
                                class="no_underline"
                                target="_blank" 
                                rel="noopener noreferrer">
                                Full Terms Apply
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- No promotions state -->
        <div v-else class="text-center py-10">
            <p>No promotions available for your region.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useHead } from '#imports';
import { pp_promotions, msgTranslate, regLink, loginLink, loadLang, fetchApiPromotions, PP_LOBBY_LINK } from '~/composables/globalData';

const loading = ref(true);
const error = ref(null);

// Set page-specific meta tags
useHead({
    title: 'Promotions - Dukes Casino',
    meta: [
        { hid: 'description', name: 'description', content: 'Explore all the best promotions available at Dukes Casino!' },
        { name: 'keywords', content: 'promotions, games, casino, Dukes Casino' }
    ]
});

// SILVER BULLET VPN FIX: Proper promotions page data loading
await useAsyncData('promotions-page-data', async () => {
    try {
        console.log('🎁 PROMOTIONS PAGE: Starting data load');
        await loadLang();
        await fetchApiPromotions(); // CRITICAL: Actually fetch the data
        console.log('✅ PROMOTIONS PAGE: Data loaded successfully');
        loading.value = false;
    } catch (err) {
        console.error('❌ PROMOTIONS PAGE: Error loading data:', err);
        error.value = err;
        loading.value = false;
    }
});

onMounted(() => {
    // Additional client-side setup if needed
    console.log('🎁 PROMOTIONS PAGE: Component mounted');
});
</script>

<style scoped>
.article {
    color: black !important;
}

h2,
h3,
h4,
h5,
h6,
p,
.promotionPage {
    color: darkslategray !important;
}</style>