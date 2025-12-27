// Simple vanilla JS test framework for RandoMatic 3000

const TestRunner = {
    tests: [],
    results: { passed: 0, failed: 0, total: 0 },
    
    describe(suiteName, fn) {
        console.group(`📦 ${suiteName}`);
        this.currentSuite = suiteName;
        fn();
        console.groupEnd();
    },
    
    it(testName, fn) {
        this.results.total++;
        try {
            fn();
            this.results.passed++;
            console.log(`  ✅ ${testName}`);
            this.addToDOM(testName, true);
        } catch (error) {
            this.results.failed++;
            console.error(`  ❌ ${testName}`);
            console.error(`     ${error.message}`);
            this.addToDOM(testName, false, error.message);
        }
    },
    
    async itAsync(testName, fn) {
        this.results.total++;
        try {
            await fn();
            this.results.passed++;
            console.log(`  ✅ ${testName}`);
            this.addToDOM(testName, true);
        } catch (error) {
            this.results.failed++;
            console.error(`  ❌ ${testName}`);
            console.error(`     ${error.message}`);
            this.addToDOM(testName, false, error.message);
        }
    },
    
    addToDOM(testName, passed, errorMsg = '') {
        const container = document.getElementById('test-results');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = `test-result ${passed ? 'passed' : 'failed'}`;
        div.innerHTML = `
            <span class="status">${passed ? '✅' : '❌'}</span>
            <span class="name">${this.currentSuite}: ${testName}</span>
            ${errorMsg ? `<span class="error">${errorMsg}</span>` : ''}
        `;
        container.appendChild(div);
    },
    
    summary() {
        console.log('\n📊 Test Summary:');
        console.log(`   Passed: ${this.results.passed}/${this.results.total}`);
        console.log(`   Failed: ${this.results.failed}/${this.results.total}`);
        
        const summaryEl = document.getElementById('test-summary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <strong>Results:</strong> 
                ${this.results.passed} passed, 
                ${this.results.failed} failed, 
                ${this.results.total} total
            `;
            summaryEl.className = this.results.failed === 0 ? 'all-passed' : 'has-failures';
        }
        
        return this.results.failed === 0;
    },
    
    reset() {
        this.results = { passed: 0, failed: 0, total: 0 };
        const container = document.getElementById('test-results');
        if (container) container.innerHTML = '';
    }
};

// Assertions
const assert = {
    equal(actual, expected, msg = '') {
        if (actual !== expected) {
            throw new Error(msg || `Expected ${expected}, got ${actual}`);
        }
    },
    
    deepEqual(actual, expected, msg = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    },
    
    ok(value, msg = '') {
        if (!value) {
            throw new Error(msg || `Expected truthy value, got ${value}`);
        }
    },
    
    includes(array, item, msg = '') {
        if (!array.includes(item)) {
            throw new Error(msg || `Expected array to include ${item}`);
        }
    },
    
    hasLength(array, length, msg = '') {
        if (array.length !== length) {
            throw new Error(msg || `Expected length ${length}, got ${array.length}`);
        }
    },
    
    inRange(value, min, max, msg = '') {
        if (value < min || value > max) {
            throw new Error(msg || `Expected ${value} to be between ${min} and ${max}`);
        }
    },
    
    isArray(value, msg = '') {
        if (!Array.isArray(value)) {
            throw new Error(msg || `Expected array, got ${typeof value}`);
        }
    },
    
    sameMembers(actual, expected, msg = '') {
        const sortedActual = [...actual].sort();
        const sortedExpected = [...expected].sort();
        if (JSON.stringify(sortedActual) !== JSON.stringify(sortedExpected)) {
            throw new Error(msg || `Arrays don't have same members`);
        }
    },
    
    throws(fn, msg = '') {
        try {
            fn();
            throw new Error(msg || 'Expected function to throw');
        } catch (e) {
            if (e.message === (msg || 'Expected function to throw')) {
                throw e;
            }
        }
    }
};

// Statistical helpers for randomness testing
const stats = {
    chiSquare(observed, expected) {
        let sum = 0;
        for (let i = 0; i < observed.length; i++) {
            sum += Math.pow(observed[i] - expected[i], 2) / expected[i];
        }
        return sum;
    },
    
    isUniformDistribution(counts, trials, options, significance = 0.05) {
        const expected = trials / options;
        const expectedArray = new Array(options).fill(expected);
        const chi2 = this.chiSquare(Object.values(counts), expectedArray);
        const degreesOfFreedom = options - 1;
        const criticalValue = this.chiSquareCritical(degreesOfFreedom, significance);
        return chi2 < criticalValue;
    },
    
    chiSquareCritical(df, alpha) {
        const table = {
            1: { 0.05: 3.841, 0.01: 6.635 },
            2: { 0.05: 5.991, 0.01: 9.210 },
            3: { 0.05: 7.815, 0.01: 11.345 },
            4: { 0.05: 9.488, 0.01: 13.277 },
            5: { 0.05: 11.070, 0.01: 15.086 },
            6: { 0.05: 12.592, 0.01: 16.812 },
            9: { 0.05: 16.919, 0.01: 21.666 },
            19: { 0.05: 30.144, 0.01: 36.191 }
        };
        return table[df]?.[alpha] || 30;
    }
};

// Export for use in test files
window.TestRunner = TestRunner;
window.assert = assert;
window.stats = stats;
