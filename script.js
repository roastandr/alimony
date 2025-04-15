/**
 * Ex-Penny Calculator - Main Script
 * 
 * A sassy calculator for women to estimate what they deserve
 * after putting up with his nonsense 💅
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results');
    const alimonyAmount = document.getElementById('alimony-amount');
    const resultMessage = document.getElementById('result-message');
    const funComparison = document.getElementById('fun-comparison');
    const maintenanceTerm = document.getElementById('maintenance-term');
    const celebrationGif = document.getElementById('celebration-gif');
    
    // Form elements
    const countrySelect = document.getElementById('country');
    const usStateGroup = document.getElementById('us-state-group');
    const indiaCityGroup = document.getElementById('india-city-group');
    const payerIncome = document.getElementById('payer-income');
    const receiverIncome = document.getElementById('receiver-income');
    const payerCurrency = document.getElementById('payer-currency');
    const receiverCurrency = document.getElementById('receiver-currency');
    
    // Range inputs
    const painLevel = document.getElementById('pain-level');
    const painLevelValue = document.getElementById('pain-level-value');
    const revengeLevel = document.getElementById('revenge');
    const revengeValue = document.getElementById('revenge-value');

    // Country data with currency symbols and terms
    const countryData = {
        'us': { symbol: '$', term: 'alimony', emoji: '💵' },
        'india': { symbol: '₹', term: 'maintenance', emoji: '🇮🇳' },
        'uk': { symbol: '£', term: 'spousal support', emoji: '💷' },
        'canada': { symbol: 'CA$', term: 'spousal support', emoji: '🍁' },
        'australia': { symbol: 'AU$', term: 'spousal maintenance', emoji: '🦘' }
    };

    // Celebration emojis based on amount
    const celebrationEmojis = [
        '💃', '👑', '💰', '🎉', '✨', '💅', '🤑', '💍', '💎', '🥂'
    ];

    /**
     * Initialize the calculator with sass
     */
    function initCalculator() {
        // Set up range input displays
        painLevel.addEventListener('input', updatePainLevelDisplay);
        revengeLevel.addEventListener('input', updateRevengeLevelDisplay);
        
        // Handle country change
        countrySelect.addEventListener('change', handleCountryChange);
        
        // Calculate button click handler
        calculateBtn.addEventListener('click', calculateSettlement);
        
        // Share buttons
        document.getElementById('share-twitter').addEventListener('click', shareToTwitter);
        document.getElementById('share-whatsapp').addEventListener('click', shareToWhatsApp);
        
        // Initialize with default country
        handleCountryChange();
    }

    /**
     * Update the displayed pain level value with attitude
     */
    function updatePainLevelDisplay() {
        const painEmojis = ['😊', '😐', '😒', '😠', '😡'];
        painLevelValue.textContent = `${painEmojis[this.value - 1]} ${this.value}`;
    }

    /**
     * Update the displayed revenge level percentage with flair
     */
    function updateRevengeLevelDisplay() {
        const revengeEmojis = ['😇', '😏', '😈', '👿'];
        let emoji = revengeEmojis[0];
        if (this.value > 25) emoji = revengeEmojis[1];
        if (this.value > 50) emoji = revengeEmojis[2];
        if (this.value > 75) emoji = revengeEmojis[3];
        revengeValue.textContent = `${emoji} ${this.value}%`;
    }

    /**
     * Handle country selection change with international fabulousness
     */
    function handleCountryChange() {
        const country = countrySelect.value;
        const { symbol, emoji } = countryData[country];
        
        // Update currency displays with emoji flair
        payerCurrency.textContent = `${symbol} ${emoji}`;
        receiverCurrency.textContent = `${symbol} ${emoji}`;
        
        // Show/hide location-specific inputs
        usStateGroup.classList.toggle('hidden', country !== 'us');
        indiaCityGroup.classList.toggle('hidden', country !== 'india');
        
        // Update fault options for India
        const faultSelect = document.getElementById('fault');
        const dowryOption = faultSelect.querySelector('option[value="dowry"]');
        dowryOption.hidden = country !== 'india';
    }

    /**
     * Calculate what he owes you with style
     */
    function calculateSettlement() {
        // Get selected country data
        const country = countrySelect.value;
        const { symbol, term } = countryData[country];
        
        // Get input values
        const payerIncomeValue = parseFloat(payerIncome.value) || 0;
        const receiverIncomeValue = parseFloat(receiverIncome.value) || 0;
        const marriageYearsValue = parseFloat(document.getElementById('marriage-years').value) || 0;
        const painFactorValue = parseFloat(painLevel.value);
        const faultValue = document.getElementById('fault').value;
        const revengePercentValue = parseFloat(revengeLevel.value) || 0;
        const celebrityModeValue = document.getElementById('celebrity-mode').checked;
        const petsInvolvedValue = document.getElementById('pets-involved').checked;
        
        // Get location-specific value
        let locationValue = 'other';
        if (country === 'us') {
            locationValue = document.getElementById('us-state').value;
        } else if (country === 'india') {
            locationValue = document.getElementById('india-city').value;
        }
        
        /**
         * Calculate base settlement amount based on country
         * Because different countries value women differently 😒
         */
        let baseAmount = calculateBaseAmount(
            country,
            payerIncomeValue,
            receiverIncomeValue,
            marriageYearsValue,
            locationValue,
            celebrityModeValue
        );
        
        /**
         * Apply adjustments based on how much he messed up
         */
        // Pain and suffering multiplier (0.2-1.0)
        baseAmount *= (painFactorValue * 0.2);
        
        // Fault adjustments - because his mistakes should cost him
        baseAmount *= getFaultMultiplier(country, faultValue);
        
        // Revenge adjustment - because sometimes you just want to see him suffer
        const revengeAmount = (revengePercentValue / 100) * payerIncomeValue;
        baseAmount += revengeAmount;
        
        // Pets adjustment - because fur babies are family
        if (petsInvolvedValue) {
            baseAmount += country === 'india' ? 2000 : 5000;
        }
        
        // Ensure amount isn't negative - you deserve at least something!
        baseAmount = Math.max(0, baseAmount);
        
        // Round to nearest whole number - no pennies for queens
        baseAmount = Math.round(baseAmount);
        
        // Display results with the celebration you deserve
        displayResults(baseAmount, symbol, term, country, marriageYearsValue, faultValue, celebrityModeValue, locationValue);
    }

    /**
     * Calculate base amount based on country-specific rules
     * Because the law values your suffering differently around the world
     */
    function calculateBaseAmount(country, payerIncome, receiverIncome, years, location, celebrityMode) {
        // Adjust income if he's loaded - take him for all he's worth!
        const adjustedPayerIncome = celebrityMode ? payerIncome * 10 : payerIncome;
        const incomeDifference = adjustedPayerIncome - receiverIncome;
        
        // Country-specific calculations - because justice isn't equal
        switch (country) {
            case 'india':
                // India-specific calculation - because desi divorces are different
                const cityModifiers = {
                    'delhi': 1.4, 'mumbai': 1.6, 'bangalore': 1.3,
                    'hyderabad': 1.2, 'chennai': 1.25, 'kolkata': 1.15, 'other': 1.1
                };
                const locationFactor = cityModifiers[location] || 1.0;
                
                // Base percentage (20-35%) based on marriage years
                const basePercentage = Math.min(0.2 + (years * 0.008), 0.35);
                return incomeDifference * basePercentage * locationFactor;
                
            case 'us':
                // US-specific calculation - because America loves drama
                const stateModifiers = {
                    'california': 1.3, 'texas': 0.8,
                    'new-york': 1.4, 'florida': 1.0, 'other': 1.0
                };
                const stateFactor = stateModifiers[location] || 1.0;
                
                // Base percentage (30-50%) based on marriage years
                const usBasePercentage = Math.min(0.3 + (years * 0.01), 0.5);
                return incomeDifference * usBasePercentage * stateFactor;
                
            default:
                // Default calculation for other countries
                const defaultPercentage = Math.min(0.25 + (years * 0.01), 0.4);
                return incomeDifference * defaultPercentage;
        }
    }

    /**
     * Get fault multiplier based on country and how badly he messed up
     */
    function getFaultMultiplier(country, fault) {
        const multipliers = {
            'none': 1.0, // Boring
            'cheating': country === 'india' ? 1.8 : 1.5, // Cheaters should pay more
            'snoring': 1.1, // Sleep is precious
            'cooking': country === 'india' ? 1.4 : 1.2, // In India, this is serious!
            'messy': 1.05, // Basic hygiene please
            'in-laws': country === 'india' ? 2.0 : 1.3, // Desi saas-bahu drama
            'dowry': 3.0 // Absolutely unacceptable
        };
        return multipliers[fault] || 1.0;
    }

    /**
     * Display the calculated results with the celebration you deserve
     */
    function displayResults(amount, symbol, term, country, years, fault, celebrityMode, location) {
        // Format amount with currency symbol and style
        alimonyAmount.textContent = symbol + amount.toLocaleString();
        maintenanceTerm.textContent = `per year of ${term} (and freedom!)`;
        
        // Generate appropriate sassy messages
        generateResultMessage(amount, years, fault, celebrityMode, country, location);
        generateFunComparison(amount, country, symbol);
        
        // Show celebration emoji based on amount
        showCelebration(amount);
        
        // Show results section with style
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Generate sassy result message based on calculation and country
     */
    function generateResultMessage(amount, years, fault, celebrityMode, country, location) {
        let messages = [];
        
        // Country-specific messages with attitude
        if (country === 'india') {
            // India-specific sass
            if (amount === 0) {
                messages.push("According to Section 125 CrPC, you get nada. Time for mutual consent?");
            } else if (amount < 50000) {
                messages.push("Typical maintenance by Indian standards. Could be worse!");
                if (years < 5) {
                    messages.push("At least you got out early before wasting more years!");
                }
            } else {
                messages.push("This would make even his mother gasp in shock!");
                if (location === 'mumbai') {
                    messages.push("Mumbai maintenance means he'll really feel this!");
                }
            }
            
            if (years > 15) {
                messages.push(`${years} years? That's a lifetime of compensation right there!`);
            }
            
            // Fault-specific sass
            if (fault === 'dowry') {
                messages.push("Dowry cases? He's lucky this is just a calculator and not real court!");
            } else if (fault === 'in-laws') {
                messages.push("Those monster-in-law stories finally paid off!");
            }
        } else {
            // Western country sass
            if (amount === 0) {
                messages.push("The court says $0 but we know your peace of mind is priceless.");
            } else if (amount < 10000) {
                messages.push("A modest amount - maybe the judge felt sorry for him?");
            } else if (amount < 50000) {
                messages.push("Not bad! This should cover your therapy sessions.");
            } else {
                messages.push("Now we're talking! This will fund your glow-up nicely.");
            }
            
            // Years married sass
            if (years > 20) {
                messages.push(`${years} years of service? You deserve every penny!`);
            }
        }
        
        // Celebrity mode sass
        if (celebrityMode) {
            messages.push(country === 'india' ? 
                "Bollywood-level settlement incoming! 🎬" : 
                "Celebrity divorce mode activated - cha-ching! 💰");
        }
        
        // Join messages with line breaks and emojis
        resultMessage.innerHTML = messages.join('<br>✨ ');
    }

    /**
     * Generate fun comparison based on amount and country
     */
    function generateFunComparison(amount, country, symbol) {
        if (amount === 0) {
            funComparison.textContent = country === 'india' ? 
                "But think of all the chai you can buy with peace of mind! ☕" : 
                "At least you can enjoy your freedom without his nonsense!";
            return;
        }
        
        // Country-specific comparisons with sass
        const comparisons = country === 'india' ? [
            { value: 1000, text: "That's like dining at a fancy restaurant every weekend!" },
            { value: 5000, text: "You could take a girls' trip to Goa every year!" },
            { value: 10000, text: "That's a year of spa treatments and self-care!" },
            { value: 50000, text: "You could buy a luxury handbag collection!" },
            { value: 100000, text: "That's a full makeover and then some!" },
            { value: 500000, text: "You could make a down payment on your dream home!" }
        ] : [
            { value: 1000, text: "That's like weekly brunches with bottomless mimosas!" },
            { value: 5000, text: "You could take a luxury vacation every year!" },
            { value: 10000, text: "That's a year of personal training and yoga!" },
            { value: 50000, text: "You could lease a luxury car in your name only!" },
            { value: 100000, text: "That's a complete wardrobe makeover!" },
            { value: 500000, text: "You could buy a beach house just for you!" }
        ];
        
        // Find the closest comparison
        let closest = comparisons[0];
        for (let comp of comparisons) {
            if (amount >= comp.value) {
                closest = comp;
            } else {
                break;
            }
        }
        
        // Calculate multiples and format text with sass
        const multiple = Math.round(amount / closest.value);
        let text = closest.text;
        
        if (multiple > 1) {
            text = text.replace("a ", `${multiple} `);
            text = text.replace("That's", `That's like ${multiple}x`);
            text = text.replace("You could", `You could do this ${multiple} times`);
        }
        
        funComparison.textContent = `✨ ${text} ✨`;
    }

    /**
     * Show celebration emoji based on amount
     */
    function showCelebration(amount) {
        // Clear previous celebration
        celebrationGif.innerHTML = '';
        
        // Determine how many emojis to show based on amount
        const emojiCount = Math.min(Math.floor(amount / 10000) + 1, 10);
        
        // Create a celebration string
        let celebrationString = '';
        for (let i = 0; i < emojiCount; i++) {
            const randomEmoji = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            celebrationString += randomEmoji;
        }
        
        celebrationGif.innerHTML = celebrationString;
    }

    /**
     * Share to Twitter with sass
     */
    function shareToTwitter() {
        const amount = alimonyAmount.textContent;
        const term = maintenanceTerm.textContent;
        const message = `According to the Ex-Penny Calculator, I deserve ${amount} ${term} after putting up with his nonsense! 💅 Calculate yours at: ${window.location.href}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    /**
     * Share to WhatsApp with your girls
     */
    function shareToWhatsApp() {
        const amount = alimonyAmount.textContent;
        const term = maintenanceTerm.textContent;
        const message = `Girl, the Ex-Penny Calculator says I deserve ${amount} ${term} after all I've been through! 👯‍♀️ Check yours here: ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Initialize the calculator with fabulousness
    initCalculator();
});