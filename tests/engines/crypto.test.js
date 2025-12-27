// Tests for CryptoEngine

TestRunner.describe('CryptoEngine', () => {
    
    TestRunner.it('should be defined', () => {
        assert.ok(typeof CryptoEngine !== 'undefined', 'CryptoEngine should exist');
    });
    
    TestRunner.it('should extend BaseEngine', () => {
        const engine = new CryptoEngine();
        assert.ok(engine instanceof BaseEngine, 'Should extend BaseEngine');
    });
    
    TestRunner.it('should have correct name and id', () => {
        const engine = new CryptoEngine();
        assert.equal(engine.name, 'Crypto Random');
        assert.equal(engine.id, 'crypto');
    });
    
    TestRunner.it('pick should return valid option', () => {
        const engine = new CryptoEngine();
        const options = ['Alpha', 'Beta', 'Gamma'];
        for (let i = 0; i < 20; i++) {
            const result = engine.pick(options);
            assert.includes(options, result, `pick returned invalid option: ${result}`);
        }
    });
    
    TestRunner.it('shuffle should return valid shuffled array', () => {
        const engine = new CryptoEngine();
        const options = ['A', 'B', 'C', 'D', 'E'];
        const result = engine.shuffle(options);
        assert.hasLength(result, options.length);
        assert.sameMembers(result, options);
    });
    
    TestRunner.it('should use crypto.getRandomValues when available', () => {
        const engine = new CryptoEngine();
        assert.ok(engine.usesCrypto, 'Should use crypto API');
    });
    
    TestRunner.it('should produce reasonably uniform distribution', () => {
        const engine = new CryptoEngine();
        const options = ['A', 'B', 'C'];
        const trials = 300;
        const results = engine.runTrials(options, trials);
        
        const isUniform = stats.isUniformDistribution(results, trials, options.length, 0.01);
        assert.ok(isUniform, 'Distribution should be reasonably uniform');
    });
    
    TestRunner.it('should work with 2 options', () => {
        const engine = new CryptoEngine();
        const options = ['Yes', 'No'];
        const result = engine.pick(options);
        assert.includes(options, result);
    });
    
    TestRunner.it('should work with 20 options', () => {
        const engine = new CryptoEngine();
        const options = Array.from({length: 20}, (_, i) => `Opt${i}`);
        const result = engine.pick(options);
        assert.includes(options, result);
    });
    
});
