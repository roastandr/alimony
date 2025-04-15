/**
 * Divorce Settlement Calculator - Main Script
 * 
 * This script handles all the calculator functionality including:
 * - Country selection and currency changes
 * - Form input handling
 * - Calculation logic for different countries
 * - Result display with country-specific formatting
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results');
    const alimonyAmount = document.getElementById('alimony-amount');
    const resultMessage = document.getElementById('result-message');
    const funComparison = document.getElementById('fun-comparison');
    const maintenanceTerm = document.getElementById('maintenance-term');
    
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
        'us': { symbol: '$', term: 'alimony' },
        'india': { symbol: '₹', term: 'maintenance' },
        'uk': { symbol: '£', term: 'spousal support' },
        'canada': { symbol: 'CA$', term: 'spousal support' },
        'australia': { symbol: 'AU$', term: 'spousal maintenance' }
    };

    /**
     * Initialize the calculator by setting up event listeners
     */
    function initCalculator() {
        // Set up range input displays
        painLevel.addEventListener('input', updatePainLevelDisplay);
        revengeLevel.addEventListener('input', updateRevengeLevelDisplay);
        
        // Handle country change
        countrySelect.addEventListener('change', handleCountryChange);
        
        // Calculate button click handler
        calculateBtn.addEventListener('click', calculateSettlement);
        
        // Initialize with default country
        handleCountryChange();
    }

    /**
     * Update the displayed pain level value
     */
    function updatePainLevelDisplay() {
        painLevelValue.textContent = this.value;
    }

    /**
     * Update the displayed revenge level percentage
     */
    function updateRevengeLevelDisplay() {
        revengeValue.textContent = this.value + '%';
    }

    /**
     * Handle country selection change
     */
    function handleCountryChange() {
        const country = countrySelect.value;
        const currencySymbol = countryData[country].symbol;
        
        // Update currency displays
        payerCurrency.textContent = currencySymbol;
        receiverCurrency.textContent = currencySymbol;
        
        // Show/hide location-specific inputs
        usStateGroup.classList.toggle('hidden', country !== 'us');
        indiaCityGroup.classList.toggle('hidden', country !== 'india');
        
        // Update fault options for India
        const faultSelect = document.getElementById('fault');
        const dowryOption = faultSelect.querySelector('option[value="dowry"]');
        dowryOption.hidden = country !== 'india';
    }

    /**
     * Calculate the settlement amount based on inputs
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
         * Apply adjustments based on other factors
         */
        // Pain and suffering multiplier (0.2-1.0)
        baseAmount *= (painFactorValue * 0.2);
        
        // Fault adjustments
        baseAmount *= getFaultMultiplier(country, faultValue);
        
        // Revenge adjustment (percentage of income)
        const revengeAmount = (revengePercentValue / 100) * payerIncomeValue;
        baseAmount += revengeAmount;
        
        // Pets adjustment (country-specific amounts)
        if (petsInvolvedValue) {
            baseAmount += country === 'india' ? 2000 : 5000;
        }
        
        // Ensure amount isn't negative
        baseAmount = Math.max(0, baseAmount);
        
        // Round to nearest whole number
        baseAmount = Math.round(baseAmount);
        
        // Display results
        displayResults(baseAmount, symbol, term, country, marriageYearsValue, faultValue, celebrityModeValue, locationValue);
    }

    /**
     * Calculate base amount based on country-specific rules
     */
    function calculateBaseAmount(country, payerIncome, receiverIncome, years, location, celebrityMode) {
        // Adjust income if celebrity mode is on
        const adjustedPayerIncome = celebrityMode ? payerIncome * 10 : payerIncome;
        const incomeDifference = adjustedPayerIncome - receiverIncome;
        
        // Country-specific calculations
        switch (country) {
            case 'india':
                // India-specific calculation
                const cityModifiers = {
                    'delhi': 1.4, 'mumbai': 1.6, 'bangalore': 1.3,
                    'hyderabad': 1.2, 'chennai': 1.25, 'kolkata': 1.15, 'other': 1.1
                };
                const locationFactor = cityModifiers[location] || 1.0;
                
                // Base percentage (20-35%) based on marriage years
                const basePercentage = Math.min(0.2 + (years * 0.008), 0.35);
                return incomeDifference * basePercentage * locationFactor;
                
            case 'us':
                // US-specific calculation
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
     * Get fault multiplier based on country and fault type
     */
    function getFaultMultiplier(country, fault) {
        const multipliers = {
            'none': 1.0,
            'cheating': country === 'india' ? 1.8 : 1.5,
            'snoring': 1.1,
            'cooking': country === 'india' ? 1.4 : 1.2,
            'messy': 1.05,
            'in-laws': country === 'india' ? 2.0 : 1.3,
            'dowry': 3.0
        };
        return multipliers[fault] || 1.0;
    }

    /**
     * Display the calculated results
     */
    function displayResults(amount, symbol, term, country, years, fault, celebrityMode, location) {
        // Format amount with currency symbol
        alimonyAmount.textContent = symbol + amount.toLocaleString();
        maintenanceTerm.textContent = `per year (${term})`;
        
        // Generate appropriate messages
        generateResultMessage(amount, years, fault, celebrityMode, country, location);
        generateFunComparison(amount, country, symbol);
        
        // Show results section
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Generate result message based on calculation and country
     */
    function generateResultMessage(amount, years, fault, celebrityMode, country, location) {
        let messages = [];
        
        // Country-specific messages
        if (country === 'india') {
            // India-specific messages
            if (amount === 0) {
                messages.push("No maintenance awarded under Section 125 CrPC.");
                messages.push("Consider mutual consent divorce for smoother process.");
            } else if (amount < 50000) {
                messages.push("Typical maintenance amount by Indian standards.");
                if (years < 5) {
                    messages.push("Short marriages often result in lower maintenance.");
                }
            } else {
                messages.push("This would be considered substantial maintenance in India.");
                if (location === 'mumbai') {
                    messages.push("Mumbai standards mean higher amounts are common.");
                }
            }
            
            if (years > 15) {
                messages.push("Long-term marriages typically receive higher maintenance.");
            }
            
            // Fault-specific messages
            if (fault === 'dowry') {
                messages.push("Dowry cases can significantly impact settlements under Indian law.");
            } else if (fault === 'in-laws') {
                messages.push("Indian courts often consider in-law interference seriously.");
            }
        } else {
            // Generic/Western country messages
            if (amount === 0) {
                messages.push("No spousal support awarded in this estimation.");
            } else if (amount < 10000) {
                messages.push("Relatively modest support amount.");
            } else if (amount < 50000) {
                messages.push("Moderate support amount - fairly typical.");
            } else {
                messages.push("Significant support amount - consult a lawyer.");
            }
            
            // Years married message
            if (years > 20) {
                messages.push(`Your ${years}-year marriage contributes to this amount.`);
            }
        }
        
        // Celebrity mode message
        if (celebrityMode) {
            messages.push(country === 'india' ? 
                "Celebrity/high net worth cases often involve much higher amounts." : 
                "High net worth divorces typically involve complex settlements.");
        }
        
        // Join messages with line breaks
        resultMessage.innerHTML = messages.join('<br>');
    }

    /**
     * Generate fun comparison based on amount and country
     */
    function generateFunComparison(amount, country, symbol) {
        if (amount === 0) {
            funComparison.textContent = country === 'india' ? 
                "You could celebrate with a nice meal instead!" : 
                "You could treat yourself to something nice instead!";
            return;
        }
        
        // Country-specific comparisons
        const comparisons = country === 'india' ? [
            { value: 1000, text: "That's like dining at a nice restaurant every week!" },
            { value: 5000, text: "You could take a nice vacation instead!" },
            { value: 10000, text: "That's a year of premium streaming services!" },
            { value: 50000, text: "You could buy a premium motorcycle with that!" },
            { value: 100000, text: "That's equivalent to a decent annual salary!" },
            { value: 500000, text: "You could make a down payment on property!" }
        ] : [
            { value: 1000, text: "That's like several fancy dinners out each month!" },
            { value: 5000, text: "You could take a luxury vacation instead!" },
            { value: 10000, text: "That's a year of car payments!" },
            { value: 50000, text: "You could lease a luxury car with that!" },
            { value: 100000, text: "That's equivalent to a professional salary!" },
            { value: 500000, text: "You could buy a house with that money!" }
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
        
        // Calculate multiples and format text
        const multiple = Math.round(amount / closest.value);
        let text = closest.text;
        
        if (multiple > 1) {
            text = text.replace("a ", `${multiple} `);
            text = text.replace("That's", `That's like ${multiple}x`);
            text = text.replace("You could", `You could do this ${multiple} times`);
        }
        
        funComparison.textContent = text;
    }

    // Initialize the calculator
    initCalculator();
});