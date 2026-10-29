const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
const GEMINI_ENDPOINT = `https://googleapis.com{GEMINI_API_KEY}`;

const rawReviewInput = document.getElementById('rawReviewInput');
const generateBtn = document.getElementById('generateBtn');
const outputSection = document.getElementById('outputSection');
const aiOutputContainer = document.getElementById('aiOutputContainer');
const clearInputBtn = document.getElementById('clearInputBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

function showToast(message, isError = true) {
    toastMessage.textContent = message;
    toastNotification.classList.remove('hidden', 'translate-y-10', 'border-rose-500/40', 'text-rose-400', 'border-emerald-500/40', 'text-emerald-400');
    if (isError) { toastNotification.classList.add('border-rose-500/40', 'text-rose-400'); } 
    else { toastNotification.classList.add('border-emerald-500/40', 'text-emerald-400'); }
    setTimeout(() => { toastNotification.classList.add('hidden', 'translate-y-10'); }, 4000);
}

clearInputBtn.addEventListener('click', () => {
    rawReviewInput.value = '';
    outputSection.classList.add('hidden');
});

copyOutputBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(aiOutputContainer.textContent);
        showToast("Response text copied to clipboard!", false);
    } catch (err) {
        showToast("Failed to auto-copy. Please manually highlight text.");
    }
});

generateBtn.addEventListener('click', async () => {
    const textToAnalyze = rawReviewInput.value.trim();
    if (!textToAnalyze) { showToast("Please enter or paste a customer review first."); return; }
    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") { showToast("API Key missing in app.js settings."); return; }

    generateBtn.disabled = true;
    generateBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Processing Response...`;
    
    const contextPrompt = `You are a professional corporate communications executive. Analyze this review and draft a polite, professional business response: "${textToAnalyze}"`;

    try {
        const response = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: contextPrompt }] }] })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            aiOutputContainer.textContent = data.candidates[0].content.parts[0].text;
            outputSection.classList.remove('hidden');
            outputSection.scrollIntoView({ behavior: 'smooth' });
        } else { showToast("Failed to interpret AI response format."); }
    } catch (error) { showToast("Network disconnect or invalid key response from Google."); } 
    finally { generateBtn.disabled = false; generateBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Generate AI Corporate Response`; }
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!window.PaystackPop) {
        const script = document.createElement("script");
        script.src = "https://paystack.co";
        script.onload = () => initiatePaystackPayment();
        document.body.appendChild(script);
    } else { initiatePaystackPayment(); }
});

function initiatePaystackPayment() {
    const handler = window.PaystackPop.setup({
        key: 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY', // 👈 Put your Paystack Public Key here
        email: 'gotseonemothobi362@gmail.com',
        amount: 35000, 
        currency: 'ZAR',
        ref: 'GB_' + Math.floor((Math.random() * 10000000) + 1),
        callback: function(response) {
            showToast("Payment Successful! Upgrading account...", false);
            const badge = document.getElementById('licenseBadge');
            badge.className = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5";
            badge.innerHTML = `<i class="fa-solid fa-crown text-[10px]"></i> Pro Active`;
            document.getElementById('monetizationCard').innerHTML = `<div class="text-center p-2 text-emerald-400 font-semibold text-sm"><i class="fa-solid fa-circle-check"></i> Pro Unlocked!</div>`;
        },
        onClose: function() { showToast("Payment window closed."); }
    });
    handler.openIframe();
}
