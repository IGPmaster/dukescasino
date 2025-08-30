import { ref } from 'vue';

// Site-specific configuration
export const SITE_CONFIG = {
    siteName: 'Dukes Casino',
    gtmId: 'GTM-KBSDBTBX',
};

export const lang = ref('');
export const tracker = ref('');
export const jurisdictionCode = ref('');
export const footerIcons = ref([]);
export const footerText = ref([]);
export const globalContent = ref({
  'About Us': 'aboutus',
  'Terms and conditions': 'terms',
  'Privacy Policy': 'privacy',
  'Bonus Policy': 'bonus',
  'Responsible Gaming': 'responsible',
  'Licence': 'license',
  'Payouts': 'payouts',
  'Depositing': 'deposits',
  'Cashing Out': 'withdrawals',
  'FAQ': 'faq',
  'Contact Us': 'contact',
});


// ProgressPlay data:
export const WHITELABEL_ID = 30;
export const PP_API_URL = 'https://content.progressplay.net/api23/api/';
const PP_PROMOTIONS_API = `${PP_API_URL}GetPromotionsInfo?whitelabelId=${WHITELABEL_ID}&country=`;
export const PP_LOBBY_LINK = 'https://dukescasino.casino-pp.net/';
//const KV_GAMES = `https://content.progressplay.net/api23/api/game?whitelabelId=${WHITELABEL_ID}`; // Test API


// WP-REST-API:
const WP_API = 'https://headless.dukescasino.com/wp-json/wp/v2/';

//CloudFlare Workers KV data - SILVER BULLET VPN FIX: Use local functions
const KV_GAMES_PRIMARY = '/api/pp/games';           // LOCAL CloudFlare Function (Silver Bullet)
const KV_GAMES_FALLBACK = '/api/worker/games';      // Local fallback proxy
export const KV_GAMES = KV_GAMES_PRIMARY;
export const FILTERED_BY_NAME_KV = 'https://access-filterbyname.tech1960.workers.dev/';
const CF_GEO_WORKER = 'https://cf-geo-lookup.tech1960.workers.dev/';
const KV_SUPPORTED_COUNTRIES = "https://access-supportedcountries.tech1960.workers.dev/";
//const REST_COUNTRY_KV = "https://access-restcountries.tech1960.workers.dev/";
const IGP_SUPPORTED_COUNTRIES = "https://igp-supported-countries.tech1960.workers.dev/";
const KV_TRANSLATIONS ="https://access-translations.tech1960.workers.dev/";

// SILVER BULLET VPN FIX: Local CloudFlare Functions for all API calls
const PROMOTIONS_URL = '/api/pp/promotions';        // Was: https://access-content-pp.tech1960.workers.dev/?type=promotions
const CONTENT_URL = '/api/pp/content';              // Was: https://access-content-pp.tech1960.workers.dev/?type=content

// Add caching variables for optimization (Silver Bullet VPN Fix)
let gamesCache = null;
let gamesCacheTime = 0;
let gamesRequestInFlight = null; // Prevent simultaneous requests
let contentCache = new Map(); // Cache for compliance content
const footerContentCache = new Map();

// Optimized cache durations
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for promotions
const GAMES_CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours for games (rarely change)
const CONTENT_CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours for compliance content (very rarely changes)

// EU Countries Array for proper fallback
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 
  'SI', 'ES', 'SE', 'GB'  // Include UK as well
];

const games = ref([]);
const newGames = ref([]);
const filterByName = ref([]);
const popularGames = ref([]);
const casinoGames = ref([]);
const jackpotGames = ref([]);
const slotGames = ref([]);
const liveGames = ref([]);
const scratchGames = ref([]);
const blackjackGames = ref([]);
const rouletteGames = ref([]);
const regLink = ref([null]);
const loginLink = ref([null]);
const playLink = ref([null]);
const msgTranslate = ref({});
const pp_promotions = ref([]);
const promotionsPosts = ref([]);
const countryCode = ref('');
const countryName = ref('');
const countries = ref('');
const country = ref('');
const countryNotSupported = ref(false);
const countriesData = ref([]);

// EU FALLBACK FIX: Proper fallback logic for EU countries
function getFallbackCountry(geoData) {
  if (!geoData) {
    console.log('🌍 FALLBACK: No geo data, defaulting to CA');
    return 'CA';
  }

  const { countryCode, continent } = geoData;
  console.log('🌍 FALLBACK: Processing fallback for', countryCode, 'continent:', continent);

  // Primary check: Use continent data from CloudFlare
  if (continent === 'EU') {
    console.log('🌍 FALLBACK: EU continent detected, using IE');
    return 'IE';
  }

  // Backup check: If continent data is missing, check against EU countries array
  if (!continent || continent === 'Unknown') {
    console.log('🌍 FALLBACK: No continent data, checking EU countries array');
    if (EU_COUNTRIES.includes(countryCode)) {
      console.log('🌍 FALLBACK: Found', countryCode, 'in EU countries array, using IE');
      return 'IE';
    }
  }

  // Default fallback for non-EU countries
  console.log('🌍 FALLBACK: Non-EU country, using CA');
  return 'CA';
}

export async function checkCountry() {
  try {
    const workerResponse = await fetch(CF_GEO_WORKER);
    const workerData = await workerResponse.json();
    const countryCodeValue = workerData.countryCode;

    if (!countryCode.value.includes(countryCodeValue)) {
      countryName.value = workerData.countryName;
      countryNotSupported.value = true;
    }
  } catch (error) {
    console.error('Error checking country:', error);
  }
}

export async function loadLang() {
  if (typeof window !== 'undefined') {
    let langValue;

    // 1. Check CF_GEO_WORKER for originalLang and continent
    try {
      const workerResponse = await fetch(CF_GEO_WORKER);
      const workerData = await workerResponse.json();
      const originalLang = workerData.countryCode;
      
      console.log('🌍 LANG: Detected country:', originalLang);
      console.log('🌍 LANG: Continent:', workerData.continent);

      // 2:1 Verify value with KV_SUPPORTED_COUNTRIES
      const apiResponse = await fetch(KV_SUPPORTED_COUNTRIES);
      const apiData = await apiResponse.json();
      const foundLangKV = apiData.find(c => c.countryIntlCode === originalLang);

      // Verify value with IGP_SUPPORTED_COUNTRIES
      const igpResponse = await fetch(IGP_SUPPORTED_COUNTRIES);
      const igpData = await igpResponse.json();
      const foundLangIGP = Object.values(igpData).flat().includes(originalLang);

      // Check if the originalLang exists in both KV's
      if (foundLangKV && foundLangIGP) {
        console.log('🌍 LANG: Country', originalLang, 'is supported, using it');
        langValue = originalLang;
        // CA PLAYTECH FILTERING: Track if this is a real supported country
        if (typeof window !== 'undefined') {
          window.__isRealCountry = true;
          window.__originalDetectedCountry = originalLang;
        }
      } else {
        // EU FALLBACK FIX: Use proper fallback logic
        const fallbackCountry = getFallbackCountry(workerData);
        console.log('🌍 LANG: Country', originalLang, 'not supported, falling back to', fallbackCountry);
        langValue = fallbackCountry;
        // CA PLAYTECH FILTERING: Track that this is a fallback country
        if (typeof window !== 'undefined') {
          window.__isRealCountry = false;
          window.__originalDetectedCountry = originalLang;
        }
      }
    } catch (error) {
      console.error('Error getting country code:', error);
      langValue = 'CA'; // Ultimate fallback
    }

    // 2:2 Check if lang cookie exists
    const cookieLang = getCookie('lang');

    if (cookieLang) {
      // 2:3 Compare values, if same use cookie value
      if (langValue && langValue.toUpperCase() === cookieLang.toUpperCase()) {
        lang.value = cookieLang.toUpperCase();
      } else {
        // 2:4 If NOT same value (or empty lang cookie), set new lang cookie value from CF_GEO_WORKER value
        lang.value = langValue || 'CA';
        // Set the 'lang' cookie to the selected language for one month
        setCookie('lang', lang.value, 30, 'None', true);
      }
    } else {
      // 3. Fallback to "CA" if all the above fails
      lang.value = langValue || 'CA';
      // Set the 'lang' cookie to the selected language for one month
      setCookie('lang', lang.value, 30, 'None', true);
    }

    // Load translations and other data
    await fetchCountry();
    console.log('🌍 LANG: Final language set to:', lang.value);
  }
}

async function fetchCountry() {
  try {
    const response = await fetch(KV_SUPPORTED_COUNTRIES);
    if (!response.ok) {
      throw new Error(`Failed to fetch country data (status ${response.status})`);
    }
    const data = await response.json();
    //console.log('Selected language:', lang.value);
    const country = data.find(c => c.countryIntlCode === lang.value);
    //console.log('Found country:', country);
    if (country) {
      jurisdictionCode.value = country.jurisdictionCode;
      //console.log('jurisdictionCode:', jurisdictionCode.value);
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
  await loadTranslations();
}

export async function loadTranslations() {
  try {
    const response = await fetch(IGP_SUPPORTED_COUNTRIES);
    const IGP_SUPPORTED_COUNTRIES_KV = await response.json();
    let langCode = lang.value;
    const countryCode = langCode;
    if (!Object.values(IGP_SUPPORTED_COUNTRIES_KV).flat().includes(countryCode)) {
      langCode = 'EN';
    } else {
      for (const [key, value] of Object.entries(IGP_SUPPORTED_COUNTRIES_KV)) {
        if (value.includes(countryCode)) {
          langCode = key.toLowerCase();
          break;
        }
      }
    }

    // Fetch translations from the worker
    const translationsResponse = await fetch(`${KV_TRANSLATIONS}?lang=${langCode}`);
    const allTranslations = await translationsResponse.json();

    msgTranslate.value = allTranslations;
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// SILVER BULLET VPN FIX: Use local CloudFlare Function for promotions
async function fetchApiPromotions() {
  try {
    console.log('🎁 UNIFIED: Starting fetchApiPromotions()');
    console.log('🔍 UNIFIED: lang.value =', lang.value);
    console.log('🔍 UNIFIED: WHITELABEL_ID =', WHITELABEL_ID);
    console.log('🔍 UNIFIED: process.client =', process.client);
    
    // Use local CloudFlare Function for client-side calls
    const apiUrl = process.client
      ? `${PROMOTIONS_URL}?whitelabelId=${WHITELABEL_ID}&country=${lang.value}`
      : `${PP_API_URL}PromotionsInfo?whitelabelId=${WHITELABEL_ID}&country=${lang.value}`;
    
    console.log('📡 UNIFIED: Fetching promotions from URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('📊 UNIFIED: Response status:', response.status);
    console.log('📊 UNIFIED: Response ok:', response.ok);
    
    const responseData = await response.json();
    
    // Handle unified response format vs direct API format
    const data = process.client ? responseData : responseData;
    
    console.log('✅ UNIFIED: Data received:', Array.isArray(data) ? `Array with ${data.length} items` : typeof data);
    console.log('📄 UNIFIED: Data sample:', data ? JSON.stringify(data).substring(0, 200) : 'No data');
    
    pp_promotions.value = data || [];
    console.log('✅ UNIFIED: pp_promotions.value set to:', pp_promotions.value);
  } catch (error) {
    console.error('❌ UNIFIED: Error fetching promotions:', error);
    console.error('❌ UNIFIED: Error stack:', error.stack);
    pp_promotions.value = []; // Ensure it's always an array on error
  }
}

export async function fetchPromotions() {
  try {
    //console.log('Fetching Promotions...');
    const response = await fetch(`${WP_API}promotions/?_fields=content,yoast_head_json.description,yoast_head_json.og_title,acf&acf_format=standard`);
    //const response = await fetch(`${WP_API}promotions`);
    console.log('Response received:', response);
    
    const data = await response.json();
    console.log('JSON data:', data);
    
    const filteredData = data.filter((item) => {
      const geoTarget = item.acf.geo_target_country_sel;
      return geoTarget && geoTarget.includes(lang.value);
    });
    console.log('Filtered data:', filteredData);
    
    // If no posts are found for the selected country, include the CA post
    if (filteredData.length === 0) {
      const caPosts = data.filter((item) => {
        const geoTarget = item.acf.geo_target_country_sel;
        return geoTarget && geoTarget.includes('IE');
      });
      //console.log('CA Posts:', caPosts);
      filteredData.push(...caPosts);
    }
    
    promotionsPosts.value = filteredData;
    console.log('promotionsPosts.value:', promotionsPosts.value);
    
  } catch (error) {
    console.error('Error fetching Promotions:', error);
  }
}

export async function fetchFilterByName() {
  try {
    const response = await fetch(FILTERED_BY_NAME_KV);
    const data = await response.json();
    filterByName.value = data;
  } catch (error) {
    console.error('Error fetching filterByName:', error);
  }
}

// SILVER BULLET VPN FIX: Optimized fetchGames with caching and deduplication
async function fetchGames() {
  try {
    // 1. Check cache FIRST (before Worker call)
    const now = Date.now();
    if (gamesCache && (now - gamesCacheTime) < GAMES_CACHE_DURATION) {
      console.log('🎮 GAMES: Using cached games data');
      // Set all game categories from cache
      games.value = gamesCache.games;
      newGames.value = gamesCache.newGames;
      popularGames.value = gamesCache.popularGames;
      casinoGames.value = gamesCache.casinoGames;
      slotGames.value = gamesCache.slotGames;
      jackpotGames.value = gamesCache.jackpotGames;
      liveGames.value = gamesCache.liveGames;
      scratchGames.value = gamesCache.scratchGames;
      blackjackGames.value = gamesCache.blackjackGames;
      rouletteGames.value = gamesCache.rouletteGames;
      await updateLinks();
      return; // No Worker call needed!
    }
    
    // 2. Check if request already in flight (prevent duplicate calls)
    if (gamesRequestInFlight) {
      console.log('🎮 GAMES: Request already in progress, waiting...');
      await gamesRequestInFlight;
      // After waiting, use data from completed request
      if (gamesCache) {
        console.log('🎮 GAMES: Using data from completed request');
        games.value = gamesCache.games;
        newGames.value = gamesCache.newGames;
        popularGames.value = gamesCache.popularGames;
        casinoGames.value = gamesCache.casinoGames;
        slotGames.value = gamesCache.slotGames;
        jackpotGames.value = gamesCache.jackpotGames;
        liveGames.value = gamesCache.liveGames;
        scratchGames.value = gamesCache.scratchGames;
        blackjackGames.value = gamesCache.blackjackGames;
        rouletteGames.value = gamesCache.rouletteGames;
        await updateLinks();
      }
      return; // No duplicate Worker call!
    }
    
    // 3. Start new request (only one at a time)
    console.log('🎮 GAMES: Fetching fresh games data...');
    gamesRequestInFlight = actuallyFetchGames();
    await gamesRequestInFlight;
    gamesRequestInFlight = null;

  } catch (error) {
    console.error('❌ GAMES: Error fetching games:', error);
    gamesRequestInFlight = null; // Reset on error
  }
}

async function actuallyFetchGames() {
  try {
    await fetchFilterByName();
    
    console.log('🎮 GAMES: Making actual API call to LOCAL CloudFlare Function...');
    console.log('🎮 GAMES: Trying local function:', KV_GAMES);
    
    let response;
    let data;
    
    // UK VPN FALLBACK STRATEGY: Try local function first, then fallbacks
    try {
      response = await fetch(KV_GAMES);
      if (!response.ok) throw new Error(`Primary failed: ${response.status}`);
      data = await response.json();
      console.log('✅ GAMES: Local games function succeeded');
    } catch (primaryError) {
      console.warn('⚠️ GAMES: Primary local function failed, trying worker fallback');
      console.log('🎮 GAMES: Trying fallback worker:', KV_GAMES_FALLBACK);
      
      try {
        response = await fetch(KV_GAMES_FALLBACK);
        if (!response.ok) throw new Error(`Fallback failed: ${response.status}`);
        data = await response.json();
        console.log('✅ GAMES: Fallback worker succeeded');
      } catch (fallbackError) {
        console.warn('⚠️ GAMES: Both local function and fallback worker failed, trying external worker');
        
        try {
          // Final fallback to external CloudFlare Worker
          const externalWorkerUrl = 'https://access-ppgames.tech1960.workers.dev/';
          response = await fetch(externalWorkerUrl);
          if (!response.ok) throw new Error(`External worker failed: ${response.status}`);
          data = await response.json();
          console.log('✅ GAMES: External worker fallback succeeded');
        } catch (externalError) {
          console.error('❌ GAMES: All games API endpoints failed');
          throw new Error('All games API endpoints failed');
        }
      }
    }

    // CA PLAYTECH FILTERING: Log current CA status for debugging
    if (typeof window !== 'undefined' && lang.value === 'CA') {
      const isRealCountry = window.__isRealCountry;
      const originalDetectedCountry = window.__originalDetectedCountry;
      if (isRealCountry && originalDetectedCountry === 'CA') {
        console.log('🇨🇦 PLAYTECH: Real CA detected - Playtech games will be filtered');
      } else if (!isRealCountry) {
        console.log('🇨🇦 PLAYTECH: Fallback CA detected - Playtech games will be included');
      }
    }

    // Process games with existing filter logic + CA Playtech filtering
    const filteredGames = data.filter(game => {
      const hasName = filterByName.value.some(name => game.gameName.toLowerCase().includes(name.toLowerCase()));
      const hasId = filterByName.value.some(id => game.gameId == id);

      // Check for jurisdictionCode and excluded countries
      const isExcludedJurisdiction = game.excludedJurisdictions?.includes(jurisdictionCode.value);
      const isExcludedCountry = game.excludedCountries?.includes(lang.value);

      // CA PLAYTECH FILTERING: Filter Playtech games only for real CA users
      let isPlaytechExcluded = false;
      if (typeof window !== 'undefined') {
        const isRealCountry = window.__isRealCountry;
        const originalDetectedCountry = window.__originalDetectedCountry;
        
        if (lang.value === 'CA' && isRealCountry && originalDetectedCountry === 'CA') {
          const isPlaytech = game.provider?.toLowerCase() === 'playtech' || 
                            game.subProvider?.toLowerCase() === 'playtech';
          if (isPlaytech) {
            console.log('🇨🇦 PLAYTECH: Filtering out Playtech game for real CA:', game.gameName);
            isPlaytechExcluded = true;
          }
        } else if (lang.value === 'CA' && !isRealCountry) {
          console.log('🇨🇦 PLAYTECH: Fallback CA detected - Playtech games will be included');
        }
      }

      return !(hasName || hasId || isExcludedJurisdiction || isExcludedCountry || isPlaytechExcluded);
    });

    // Set all game categories
    games.value = filteredGames;
    newGames.value = filteredGames.filter(game => game.gameFilters?.includes('New'));
    popularGames.value = filteredGames.filter(game => game.gameFilters?.includes('Popular') || game.gameFilters?.includes('Featured'));
    casinoGames.value = filteredGames.filter(game => game.gameType?.includes('Casino'));
    slotGames.value = filteredGames.filter(game => game.gameType?.includes('Slots'));
    jackpotGames.value = filteredGames.filter(game => game.gameType?.includes('Jackpots'));
    liveGames.value = filteredGames.filter(game => game.gameType?.includes('Live'));
    scratchGames.value = filteredGames.filter(game => game.gameName?.toLowerCase().includes('scratch'));
    blackjackGames.value = filteredGames.filter(game => game.gameFilters?.includes('Blackjack'));
    rouletteGames.value = filteredGames.filter(game => game.gameFilters?.includes('Roulette'));

    // Cache the processed games data to reduce Worker load
    gamesCache = {
      games: games.value,
      newGames: newGames.value,
      popularGames: popularGames.value,
      casinoGames: casinoGames.value,
      slotGames: slotGames.value,
      jackpotGames: jackpotGames.value,
      liveGames: liveGames.value,
      scratchGames: scratchGames.value,
      blackjackGames: blackjackGames.value,
      rouletteGames: rouletteGames.value
    };
    gamesCacheTime = Date.now();
    
    console.log('✅ GAMES: Games data cached successfully for', GAMES_CACHE_DURATION / 60000, 'minutes');

    await updateLinks();

  } catch (error) {
    console.error('❌ GAMES: Error fetching games:', error);
    throw error; // Re-throw to be caught by fetchGames()
  }
}

// Update links function (moved outside)
async function updateLinks() {
  const tracker = await handleParameter('tracker');
  const btag = await handleParameter('btag');
  const affid = await handleParameter('affid');
  const lang = getCookie('lang');

  const queryStringParams = [
    tracker ? `tracker=${tracker}` : '',
    btag ? `btag=${btag}` : '',
    affid ? `affid=${affid}` : '',
  ].filter(param => param !== '').join('&'); // Join only the non-empty parameters

  regLink.value = `${PP_LOBBY_LINK}${queryStringParams ? '?' + queryStringParams : ''}#registration`;
  loginLink.value = `${PP_LOBBY_LINK}${queryStringParams ? '?' + queryStringParams : ''}#login`;
  playLink.value = `${PP_LOBBY_LINK}${queryStringParams ? '?' + queryStringParams : ''}#play/`;
}

export async function handleParameter(parameterName) {
  const params = new URLSearchParams(window.location.search);
  const parameterFromURL = params.get(parameterName);
  const parameterFromCookie = getCookie(parameterName);

  if (parameterFromURL) {
    setCookie(parameterName, parameterFromURL, 30, 'None', true);
    return parameterFromURL;
  } else if (parameterFromCookie) {
    return parameterFromCookie;
  } else {
    return ''; // Return an empty string if the parameter is not found in the URL or cookies
  }
}

export async function fetchSupportedCountries() {
  const response = await fetch(IGP_SUPPORTED_COUNTRIES);
  return await response.json();
}



// SILVER BULLET VPN FIX: Optimized unified footer content fetching
export async function fetchFooterContent(lang) {
  const cacheKey = `footer_${lang}`;
  
  if (footerContentCache.has(cacheKey)) {
    const cached = footerContentCache.get(cacheKey);
    footerIcons.value = cached.footericon || [];
    footerText.value = cached.footertext || [];
    return;
  }

  try {
    // UNIFIED API CALL: Get both footer contents using unified CloudFlare Worker (per IGPsites-CONTENT-FIX.md)
    const apiUrl = process.client
      ? `https://access-content-pp.tech1960.workers.dev/?type=content&codes=footericon,footertext&whitelabelId=${WHITELABEL_ID}&country=${lang || lang.value || 'GB'}`
      : null; // Server-side will use direct API calls individually for now

    if (process.client) {
      console.log('🚀 UNIFIED: Fetching footer content (icons + text) in single call');
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      // Extract individual results from unified response
      footerIcons.value = data.footericon || [];
      footerText.value = data.footertext || [];
      
      // Cache the unified result
      footerContentCache.set(cacheKey, data);
      console.log('✅ UNIFIED: Footer content cached successfully');
    } else {
      // Server-side: Still use individual calls for now
      await fetchFooterIconsServer(lang);
      await fetchFooterTextServer(lang);
    }
  } catch (error) {
    console.error('❌ UNIFIED: Error fetching footer content:', error);
    footerIcons.value = [];
    footerText.value = [];
  }
}

// Server-side fallback functions
async function fetchFooterIconsServer(lang) {
  try {
    const response = await fetch(`${PP_API_URL}InfoContent?whitelabelId=${WHITELABEL_ID}&code=footericon`);
    const data = await response.json();
    footerIcons.value = data;
  } catch (error) {
    console.error('❌ Error fetching footer icons:', error);
    footerIcons.value = [];
  }
}

async function fetchFooterTextServer(lang) {
  try {
    const response = await fetch(`${PP_API_URL}InfoContent?whitelabelId=${WHITELABEL_ID}&code=footertext`);
    const data = await response.json();
    footerText.value = data;
  } catch (error) {
    console.error('❌ Error fetching footer text:', error);
    footerText.value = [];
  }
}

// Legacy functions for backward compatibility
export async function fetchFooterIcons(lang) {
  await fetchFooterContent(lang);
}

export async function fetchFooterText(lang) {
  await fetchFooterContent(lang);
}

// SILVER BULLET VPN FIX: Optimized content fetching with caching
export async function fetchCachedContent(code, country = lang.value) {
  // Validate code parameter
  if (!code || code === 'undefined' || typeof code !== 'string') {
    console.error('❌ CONTENT: Invalid code parameter:', { code, type: typeof code });
    return '';
  }
  
  const resolvedCountry = country;
  const cacheKey = `content:${code}:${WHITELABEL_ID}:${resolvedCountry}`;
  const now = Date.now();
  
  // Check cache first
  if (contentCache.has(cacheKey)) {
    const cached = contentCache.get(cacheKey);
    if ((now - cached.timestamp) < CONTENT_CACHE_DURATION) {
      console.log('📄 CONTENT: Using cached content for', code);
      return cached.data;
    }
  }
  
  try {
    console.log('📄 CONTENT: Fetching fresh content for', code);
    console.log('🔍 CONTENT DEBUG: country parameter =', resolvedCountry);
    console.log('🔍 CONTENT DEBUG: lang.value =', lang.value);
    console.log('🔍 CONTENT DEBUG: cache key =', cacheKey);
    console.log('🔍 CONTENT DEBUG: WHITELABEL_ID =', WHITELABEL_ID);
    
    // Use unified CloudFlare Worker for KV caching (per IGPsites-CONTENT-FIX.md)
    const apiUrl = process.client
      ? `https://access-content-pp.tech1960.workers.dev/?type=content&codes=${code}&whitelabelId=${WHITELABEL_ID}&country=${resolvedCountry}`
      : `${PP_API_URL}InfoContent?whitelabelId=${WHITELABEL_ID}&code=${code}`;
    
    console.log('🔍 CONTENT DEBUG: Full API URL =', apiUrl);
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error('❌ CONTENT: HTTP error:', response.status, response.statusText);
      return '';
    }
    
    const responseData = await response.json();
    
    // Handle different response formats
    let htmlContent = '';
    if (process.client) {
      // Local function returns: { code: [{ Html: "content" }] }
      const data = responseData[code];
      htmlContent = data && data[0] ? data[0].Html : '';
    } else {
      // Direct API returns: [{ Html: "content" }]
      htmlContent = responseData && responseData[0] ? responseData[0].Html : '';
    }
    
    // Cache the result
    contentCache.set(cacheKey, {
      data: htmlContent,
      timestamp: now
    });
    
    console.log('✅ CONTENT: Content cached for', code, 'for', CONTENT_CACHE_DURATION / 60000, 'minutes');
    return htmlContent;
    
  } catch (error) {
    console.error('❌ CONTENT: Error fetching content:', error);
    return '';
  }
}



function setCookie(name, value, days, sameSite, secure) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  const sameSiteAttribute = sameSite ? '; SameSite=' + sameSite : '';
  const secureAttribute = secure ? '; Secure' : '';
  document.cookie = name + '=' + (value || '') + expires + sameSiteAttribute + secureAttribute + '; path=/';
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function fetchCountriesData() {
  try {
    const IGP_SUPPORTED_COUNTRIES_KV = await fetchSupportedCountries();
    const countries = [];

    for (const [language, countryCodes] of Object.entries(IGP_SUPPORTED_COUNTRIES_KV)) {
      for (const countryCode of countryCodes) {
        try {
          countries.push({
            name: countryCode,
            code: countryCode,
            language: language,
            // Since REST_COUNTRY_KV is commented out, we'll use simple flags
            flagUrl: `/flags/${countryCode.toLowerCase()}.svg`
          });
        } catch (error) {
          console.error(`Error processing country ${countryCode}:`, error);
          continue;
        }
      }
    }

    return countries.filter(country => country.language !== '');
  } catch (error) {
    console.error('Error in fetchCountriesData:', error);
    return [];
  }
}


export { 
    //fetchPromotions, 
    fetchApiPromotions, 
    games, 
    newGames, 
    popularGames, 
    jackpotGames, 
    casinoGames, 
    slotGames, 
    scratchGames, 
    liveGames,
    blackjackGames,
    rouletteGames,
    regLink,
    loginLink,
    playLink,
    msgTranslate,
    pp_promotions,
    promotionsPosts,
    countryCode,
    countryName,
    countries,
    country,
    countriesData,
    countryNotSupported,
    fetchGames,
    getCookie, 
    setCookie, 
};
