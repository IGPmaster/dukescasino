<template>
  <div>
    <footer class="!bg-neutral-50 pt-10">
      <div class="row">
        <div class="container mx-auto">
            <ul class="flex flex-wrap justify-center pb-16 gap-8">
              <li>
                <NuxtLink to="/"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.home || 'Home' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/promotions"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.promotions || 'Promotions' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/compliance"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.legal || 'Legal' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/all-games"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.all_games || 'All Games' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/casino-games"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.casino_games || 'Casino Games' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/jackpot-games"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.jackpot_games || 'Jackpot Games' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/live-games"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.live_games || 'Live Games' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/popular-games"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.popular_games || 'Popular Games' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/scratchcards"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.scratchcards_games || 'Scratchcards' }}</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/slot-games"
                  class="uppercase font-light text-sm text-zinc-200 py-2 px-4 bg-stone-800 rounded hover:bg-[#323131] transition ease-in-out">
                  {{ msgTranslate?.slot_games || 'Slot Games' }}</NuxtLink>
              </li>
            </ul>
          </div>
      </div>

      <div class="row !bg-neutral-50 pb-10">
        <div class="container mx-auto footerContainer">
          <ul class="container mx-auto flex list-none flex-wrap text-lg justify-center gap-6 py-8 text-gray-800">
            <li>
              <NuxtLink to="/compliance/aboutus" class="compliance-btn">{{ msgTranslate?.aboutus || 'About Us' }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/withdrawals" class="compliance-btn">{{ msgTranslate?.withdrawals || 'Withdrawals' }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/deposits" class="compliance-btn">{{ msgTranslate?.deposits || 'Deposits' }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/contact" class="compliance-btn">{{ msgTranslate?.contact || 'Contact' }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compliance/privacy" class="compliance-btn">{{ msgTranslate?.privacy || 'Privacy' }}</NuxtLink>
            </li>
            <li>
            <NuxtLink to="/compliance/responsible" class="compliance-btn">{{ msgTranslate?.responsible || 'Responsible Gaming' }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/faq" class="compliance-btn">{{ msgTranslate?.faq || 'FAQ' }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/payouts" class="compliance-btn">{{ msgTranslate?.payouts || 'Payouts' }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/compliance/terms" class="compliance-btn">{{ msgTranslate?.terms || 'Terms' }}</NuxtLink>
          </li>
             <li>
     <button @click="handleOpenPreferences" class="compliance-btn">
       {{ msgTranslate?.cookie_settings || 'Cookie Settings' }}
     </button>
   </li>
        </ul>
        <div v-for="icon in footerIcons" :key="icon.Name">
          <div v-html="icon.Html"></div>
        </div>
        <div v-for="text in footerText" :key="text.Name" class="py-5">
          <p v-html="text.Html"></p>
        </div>
        <div class="flex items-center justify-center">
          <img 
            src="/dukescasino-logo-new.png" 
            loading="lazy" 
            alt="Dukes Casino footer Logo"
            class="footer_logo p-5 shadow-md rounded-lg" 
            width="150" 
            height="auto" />
        </div>
      </div>
    </div>

    <div class="w-full fixed bottom-0 lg:hidden">
        <div class="grid grid-cols-2">
          <div class="w-full bg-[#91D342] flex justify-center py-3">
            <a :href="loginLink" class="flex items-center gap-4 text-[#313131] font-semibold">
              {{ msgTranslate?.login || 'Login' }}
              <i class="material-icons">arrow_forward</i>
            </a>
          </div>
          <div class="w-full bg-[#3598FB] flex justify-center">
            <a :href="regLink" class="flex items-center gap-4 text-[#313131] font-semibold">
              {{ msgTranslate?.sign_up || 'Sign Up' }}
              <i class="material-icons">security</i>
            </a>
          </div>
        </div>
      </div>
      
  </footer>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  fetchFooterIcons, 
  fetchFooterText, 
  msgTranslate, 
  regLink, 
  loginLink, 
  loadLang,
  lang 
} from '~/composables/globalData';
   import { useCookieConsent } from '~/composables/useCookieConsent';
   const { handleOpenPreferences } = useCookieConsent();
// Add async data loading
await useAsyncData('translations', async () => {
  try {
    await loadLang();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
});

const { fetch, error, $fetchState } = useFetch(async () => {
  await fetchFooterIcons(lang.value);
  await fetchFooterText(lang.value);
});
</script>

<style scoped>
.footer_logo {
  background-color: #212121;
  max-width: 150px;
}
.router-link-active {
  @apply text-secondary bg-secondary_bg;
}
</style>