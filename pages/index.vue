<template>

	<MainBanner />
	<NewGames />

	<!-- PP Promotions API -->
	<div class="section-odd bg-primary_bg py-16">
		<!-- Section Header -->
		<div class="container mx-auto px-4 mb-12">
			<div class="text-center">
				<h2 class="text-4xl lg:text-5xl font-bold text-primary mb-4">Exclusive Promotions</h2>
				<p class="text-xl text-primary/80 max-w-2xl mx-auto">Claim your welcome bonus and discover amazing offers designed just for you!</p>
			</div>
		</div>

		<!-- Promo Over Content -->
		<div v-for="rest in promotionsPosts" :key="rest.code" class="container mx-auto px-4 mb-8">
			<div v-html="rest.acf.promo_over" class="text-center text-primary leading-relaxed"></div>
		</div>

		<!-- Promotions Grid -->
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
				<div v-for="promo in pp_promotions" :key="promo.code" class="group">
					<div class="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/10">
						<div class="relative overflow-hidden">
							<a :href="regLink" class="block">
								<img 
									class="w-full h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700" 
									:src="promo.bigImageUrl" 
									loading="lazy"
									:alt="'Image of ' + promo.title + ' promotion.'"
									:title="promo.title + ', ' + promo.subTitle">
								<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
								<div class="absolute bottom-4 left-4 right-4">
									<h3 class="text-white text-2xl font-bold mb-2">{{ promo.title }}</h3>
									<p class="text-white/90 text-sm">{{ promo.subTitle }}</p>
								</div>
							</a>
						</div>
						<div class="p-6">
							<a :href="regLink" 
								class="block w-full bg-gradient-to-r from-secondary_bg to-tertiary_dark text-white font-bold py-4 px-6 rounded-xl text-center text-lg hover:from-tertiary_dark hover:to-secondary_bg transition-all duration-300 transform hover:scale-105 shadow-lg">
								Claim Bonus
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Promo Under Content -->
		<div class="container mx-auto px-4 mt-12">
			<div v-for="rest in promotionsPosts" :key="rest.code" class="text-center">
				<div class="text-primary/80 leading-relaxed max-w-4xl mx-auto" v-html="rest.acf.promo_under"></div>
			</div>
		</div>
	</div>

	<PopularGames />
	<SlotGames />
	<CasinoGames />
	<JackpotGames />

	<div class="container mx-auto py-10">
		<div class="px-4">
			<div class="text-sm text-primary">
				<div v-for="promotion in promotionsPosts" :key="promotion.id">
					<div v-html="promotion.content.rendered" :key="promotion.id"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { promotionsPosts, pp_promotions, regLink, fetchPromotions, fetchApiPromotions, loadLang, fetchGames } from '~/composables/globalData';

const loading = ref(true);
const emit = defineEmits(['loaded']);

// SILVER BULLET VPN FIX: Single shared API call for homepage
await useAsyncData('homepage-data', async () => {
	try {
		console.log('🏠 HOMEPAGE: Loading all data...');
		await loadLang();
		await fetchGames(); // ✅ Single call for all game components
		await fetchApiPromotions(); // Load PP promotions
		await fetchPromotions(); // Load WP promotions
		console.log('✅ HOMEPAGE: All data loaded successfully');
	} catch (error) {
		console.error('❌ HOMEPAGE: Error loading data:', error);
	}
});

onMounted(() => {
	// No API calls, just UI state
	loading.value = false;
	emit('loaded');
	console.log('🏠 HOMEPAGE: Component mounted');
});
</script>

<style scoped>
p {
    line-height: 1.7rem;
}

.seoContent {
    color: #f2f4e8;
    background: transparent;
    border-radius: 5px;
}
</style>