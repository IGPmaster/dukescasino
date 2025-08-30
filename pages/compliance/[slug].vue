<template>
    <div>
        <div class="">
            <div class="container mx-auto bg-white pt-32">
            <div class="px-4">
                <NuxtLink to="/compliance/" class="flex justify-center gap-4 p-2 border rounded border-primary text-gray-800 text-center w-1/2 md:w-1/5 cursor-pointer">
                    <i class="material-icons">arrow_back</i>
                    {{ msgTranslate.legal }}
                      </NuxtLink>
                <div class="">
                    <div class="text-black" v-html="htmlContent"></div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { msgTranslate, globalContent, loadLang, fetchCachedContent } from '~/composables/globalData';

const route = useRoute();
const slug = route.params.slug;

const htmlContent = ref('');

// SILVER BULLET VPN FIX: Use optimized fetchCachedContent with local CloudFlare Function
await useAsyncData('compliance-content', async () => {
    try {
        await loadLang(); // Ensure language is loaded first
        console.log('📄 COMPLIANCE: Fetching content for slug:', slug);
        htmlContent.value = await fetchCachedContent(slug);
        console.log('✅ COMPLIANCE: Content loaded successfully');
    } catch (error) {
        console.error('❌ COMPLIANCE: Error loading content:', error);
        htmlContent.value = '<p>Error loading content. Please try again later.</p>';
    }
});

const handleClick = async (key) => {
    const code = globalContent.value[key];
    try {
        console.log('📄 COMPLIANCE: Fetching content for code:', code);
        htmlContent.value = await fetchCachedContent(code);
    } catch (error) {
        console.error('❌ COMPLIANCE: Error loading content:', error);
        htmlContent.value = '<p>Error loading content. Please try again later.</p>';
    }
};
</script>

<style scoped>
.content-area h1 {
    font-weight: bold !important;
}
</style>
