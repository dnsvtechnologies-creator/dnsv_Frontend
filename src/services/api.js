/**
 * API Service for DNSV Technologies
 * Communicates with Express.js Backend at /api/v1
 */

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api/v1'
).replace(/\/+$/, '');

if (!API_BASE) {
  throw new Error('VITE_API_URL is not configured');
}

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || (data.errors && data.errors[0]) || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

const CACHE_TTL_MS = 60 * 1000;
const responseCache = new Map();
const inFlightRequests = new Map();

function cachedGet(key, loader) {
  const now = Date.now();
  const cached = responseCache.get(key);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return Promise.resolve(cached.data);
  }
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }
  const promise = Promise.resolve()
    .then(loader)
    .then((data) => {
      responseCache.set(key, { data, timestamp: Date.now() });
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });
  inFlightRequests.set(key, promise);
  return promise;
}

export function invalidateCatalogCache(key) {
  if (key) {
    responseCache.delete(key);
  } else {
    responseCache.clear();
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dnsv:catalog-updated'));
  }
}

export const apiService = {
  // Pricing plans (deduplicated + cached)
  async getPricingPlans() {
    return cachedGet('pricing', async () => {
      try {
        const res = await fetchJson('/enquiries/plans');
        return res.data;
      } catch (err) {
        console.warn('[API Service] Using local pricing fallback:', err.message);
        const { EMAIL_MARKETING_PLANS, WEBSITE_DEVELOPMENT_PLANS, COMBINED_PACKAGES } = await import('../constants/pricingData.js');
        return {
          emailMarketing: EMAIL_MARKETING_PLANS,
          websiteDevelopment: WEBSITE_DEVELOPMENT_PLANS,
          combinedPackages: COMBINED_PACKAGES
        };
      }
    });
  },

  // Contact Form (Requires Logged-in User)
  async submitContact(formData) {
    const token = this.getUserToken();
    return fetchJson('/contact', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(formData)
    });
  },

  // Quote Request (Requires Logged-in User)
  async submitQuote(formData) {
    const token = this.getUserToken();
    return fetchJson('/quotes', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(formData)
    });
  },

  // Plan Enquiry (Requires Logged-in User)
  async submitEnquiry(formData) {
    const token = this.getUserToken();
    return fetchJson('/enquiries', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(formData)
    });
  },

  // Newsletter
  async subscribeNewsletter(email) {
    return fetchJson('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Products (Dynamic SaaS Catalog — deduplicated + cached)
  async getProducts() {
    return cachedGet('products', async () => {
      try {
        return await fetchJson('/products');
      } catch (err) {
        console.warn('[API Service] Using local products fallback:', err.message);
        const { INITIAL_PRODUCTS } = await import('../constants/productSeedData.js');
        return { success: true, count: INITIAL_PRODUCTS.length, data: INITIAL_PRODUCTS };
      }
    });
  },

  async getProductBySlug(slug) {
    return fetchJson(`/products/${encodeURIComponent(slug)}`);
  },

  // Services (Dynamic Engineering Services Catalog — deduplicated + cached)
  async getServices() {
    return cachedGet('services', async () => {
      try {
        return await fetchJson('/services');
      } catch (err) {
        console.warn('[API Service] Using local services fallback:', err.message);
        const { INITIAL_SERVICES, INITIAL_SERVICES_PAGE_CONFIG } = await import(
          '../constants/serviceSeedData.js'
        );
        return {
          success: true,
          count: INITIAL_SERVICES.length,
          data: INITIAL_SERVICES,
          pageConfig: INITIAL_SERVICES_PAGE_CONFIG
        };
      }
    });
  },

  async getServiceBySlug(slug) {
    return fetchJson(`/services/${encodeURIComponent(slug)}`);
  },

  // Careers (Open access with live catalog cache)
  async getCareers() {
    return cachedGet('careers', async () => {
      try {
        return await fetchJson('/careers');
      } catch (err) {
        console.warn('[API Service] Using local careers fallback:', err.message);
        const { INITIAL_CAREER_JOBS, INITIAL_CAREER_CONFIG } = await import(
          '../constants/careerSeedData.js'
        );
        return {
          success: true,
          data: {
            jobs: INITIAL_CAREER_JOBS,
            pageConfig: INITIAL_CAREER_CONFIG,
            meta: {
              totalOpenRoles: INITIAL_CAREER_JOBS.length,
              totalVisibleRoles: INITIAL_CAREER_JOBS.length,
              filteredCount: INITIAL_CAREER_JOBS.length,
              departments: [],
              workModes: []
            }
          }
        };
      }
    });
  },

  async submitCareerApplication(payload) {
    return fetchJson('/careers/apply', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Site Settings (deduplicated + cached)
  async getSiteSettings() {
    return cachedGet('site-settings', () => fetchJson('/site-settings'));
  },

  // Client User Authentication & Portal
  getUserToken() {
    try {
      return localStorage.getItem('dnsv_user_token') || '';
    } catch {
      return '';
    }
  },

  setUserToken(token) {
    try {
      if (token) {
        localStorage.setItem('dnsv_user_token', token);
      } else {
        localStorage.removeItem('dnsv_user_token');
      }
    } catch {
      // Ignore storage failures
    }
  },

  async googleAuthLogin(payload) {
    return fetchJson('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async checkRegistrationEmail(email) {
    return fetchJson('/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async registerVerifiedUser(payload) {
    return fetchJson('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async userPasswordLogin(credentials) {
    return fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async getUserSession() {
    const token = this.getUserToken();
    return fetchJson('/auth/session', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateUserProfile(payload) {
    const token = this.getUserToken();
    return fetchJson('/user/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  },

  async getUserPortal() {
    const token = this.getUserToken();
    return fetchJson('/user/portal', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async toggleSavedItem(payload) {
    const token = this.getUserToken();
    return fetchJson('/user/saved-items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  },

  async replyToSubmission(kind, id, message) {
    const token = this.getUserToken();
    return fetchJson(`/user/submissions/${kind}/${id}/reply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message })
    });
  },

  async updateUserDraft(kind, id, payload) {
    const token = this.getUserToken();
    return fetchJson(`/user/drafts/${kind}/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  },

  async deleteUserDraft(kind, id) {
    const token = this.getUserToken();
    return fetchJson(`/user/drafts/${kind}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Admin Authentication & Data Console
  getAdminToken() {
    try {
      return localStorage.getItem('dnsv_admin_token') || '';
    } catch {
      return '';
    }
  },

  setAdminToken(token) {
    try {
      if (token) {
        localStorage.setItem('dnsv_admin_token', token);
      } else {
        localStorage.removeItem('dnsv_admin_token');
      }
    } catch {
      // Ignore storage failures
    }
  },

  async adminLogin(credentials) {
    return fetchJson('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async getAdminSession() {
    const token = this.getAdminToken();
    return fetchJson('/admin/session', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async getAdminDashboard() {
    const token = this.getAdminToken();
    return fetchJson('/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateAdminQuoteStatus(id, statusOrPayload) {
    const token = this.getAdminToken();
    const bodyPayload = typeof statusOrPayload === 'string' ? { status: statusOrPayload } : statusOrPayload;
    return fetchJson(`/admin/quotes/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(bodyPayload)
    });
  },

  async deleteAdminQuote(id) {
    const token = this.getAdminToken();
    return fetchJson(`/admin/quotes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateAdminContactStatus(id, statusOrPayload) {
    const token = this.getAdminToken();
    const bodyPayload = typeof statusOrPayload === 'string' ? { status: statusOrPayload } : statusOrPayload;
    return fetchJson(`/admin/contacts/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(bodyPayload)
    });
  },

  async deleteAdminContact(id) {
    const token = this.getAdminToken();
    return fetchJson(`/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateAdminEnquiryStatus(id, statusOrPayload) {
    const token = this.getAdminToken();
    const bodyPayload = typeof statusOrPayload === 'string' ? { status: statusOrPayload } : statusOrPayload;
    return fetchJson(`/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(bodyPayload)
    });
  },

  async deleteAdminEnquiry(id) {
    const token = this.getAdminToken();
    return fetchJson(`/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async toggleAdminSubscriber(id) {
    const token = this.getAdminToken();
    return fetchJson(`/admin/newsletter/${id}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async deleteAdminSubscriber(id) {
    const token = this.getAdminToken();
    return fetchJson(`/admin/newsletter/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async createAdminPricingPlan(payload) {
    const token = this.getAdminToken();
    const res = await fetchJson('/admin/pricing', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('pricing');
    return res;
  },

  async updateAdminPricingPlan(id, payload) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/pricing/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('pricing');
    return res;
  },

  async deleteAdminPricingPlan(id) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/pricing/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    invalidateCatalogCache('pricing');
    return res;
  },

  async createAdminProduct(payload) {
    const token = this.getAdminToken();
    const res = await fetchJson('/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('products');
    return res;
  },

  async updateAdminProduct(id, payload) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('products');
    return res;
  },

  async deleteAdminProduct(id) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    invalidateCatalogCache('products');
    return res;
  },

  async updateAdminServicePageConfig(payload) {
    const token = this.getAdminToken();
    const res = await fetchJson('/admin/services/config', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('services');
    return res;
  },

  async createAdminService(payload) {
    const token = this.getAdminToken();
    const res = await fetchJson('/admin/services', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('services');
    return res;
  },

  async updateAdminService(id, payload) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/services/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('services');
    return res;
  },

  async deleteAdminService(id) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/services/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    invalidateCatalogCache('services');
    return res;
  },

  async updateAdminCareerConfig(payload) {
    const token = this.getAdminToken();
    const res = await fetchJson('/admin/careers/config', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('careers');
    return res;
  },

  async createAdminCareerJob(payload) {
    const token = this.getAdminToken();
    const res = await fetchJson('/admin/careers/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('careers');
    return res;
  },

  async updateAdminCareerJob(id, payload) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/careers/jobs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('careers');
    return res;
  },

  async deleteAdminCareerJob(id) {
    const token = this.getAdminToken();
    const res = await fetchJson(`/admin/careers/jobs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    invalidateCatalogCache('careers');
    return res;
  },

  async updateAdminCareerApplicationStatus(id, payload) {
    const token = this.getAdminToken();
    return fetchJson(`/admin/careers/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  },

  async deleteAdminCareerApplication(id) {
    const token = this.getAdminToken();
    return fetchJson(`/admin/careers/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateAdminSiteSettings(payload) {
    const token = this.getAdminToken();
    const res = await fetchJson('/admin/site-settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    invalidateCatalogCache('site-settings');
    return res;
  }
};
