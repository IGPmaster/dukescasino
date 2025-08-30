<template>
    <div>
        <div class="bg-white py-10">
            <div class="container mx-auto px-0">
                <div class="g-btn-wrapper mt-10 md:mt-20 flex flex-wrap justify-center">
                    <button v-for="(value, key) in globalContent" :key="key" @click="handleClick(key)"
                        class="h-10 px-4 md:px-8 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800 uppercase text-xs md:text-base">
                        {{ msgTranslate[value] ? msgTranslate[value] : value }}
                    </button>
                </div>

                <div class="px-4">
                    <div class="compliance text-black" v-html="htmlContent"></div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { msgTranslate, globalContent, loadLang, fetchCachedContent } from '~/composables/globalData';

const htmlContent = ref('');

// SILVER BULLET VPN FIX: Use optimized fetchCachedContent with local CloudFlare Function
await useAsyncData('compliance-index-content', async () => {
    try {
        await loadLang(); // Ensure language is loaded first
        console.log('📄 COMPLIANCE INDEX: Loading default content (aboutus)');
        htmlContent.value = await fetchCachedContent('aboutus');
        console.log('✅ COMPLIANCE INDEX: Default content loaded successfully');
    } catch (error) {
        console.error('❌ COMPLIANCE INDEX: Error loading content:', error);
        htmlContent.value = '<p>Error loading content. Please try again later.</p>';
    }
});

const handleClick = async (key) => {
    const code = globalContent.value[key];
    try {
        console.log('📄 COMPLIANCE INDEX: Fetching content for code:', code);
        htmlContent.value = await fetchCachedContent(code);
        console.log('✅ COMPLIANCE INDEX: Content loaded for:', code);
    } catch (error) {
        console.error('❌ COMPLIANCE INDEX: Error loading content:', error);
        htmlContent.value = '<p>Error loading content. Please try again later.</p>';
    }
};
</script>

<style scoped>

</style>
