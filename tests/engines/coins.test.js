// Tests for CoinsEngine

TestRunner.describe('CoinsEngine', () => {
    
    TestRunner.it('should be defined', () => {
        assert.ok(typeof CoinsEngine !== 'undefined', 'CoinsEngine should exist');
    });
    
    TestRunner.it('should extend BaseEngine', () => {
        const engine = new CoinsEngine();
        assert.ok(engine instanceof BaseEngine);
    });
    
    TestRunner.it('should have correct name and id', () => {
        const engine = new CoinsEngine();
        assert.equal(engine.name, 'Coin Cascade');
        assert.equal(engine.id, 'coins');
    });
    
    TestRunner.it('pick should return valid option', () => {
        const engine = new CoinsEngine();
        const options = ['Heads', 'Tails'];
        for (let i = 0; i < 20; i++) {
            const result = engine.pick(options);
            assert.includes(options, result);
        }
    });
    
    TestRunner.it('shuffle should return valid array', () => {
        const engine = new CoinsEngine();
        const options = ['A', 'B', 'C'];
        const result = engine.shuffle(options);
        assert.hasLength(result, options.length);
        assert.sameMembers(result, options);
    });
    
    TestRunner.it('should produce reasonably uniform distribution with 2 options', () => {
        const engine = new CoinsEngine();
        const options = ['A', 'B'];
        const trials = 200;
        const results = engine.runTrials(options, trials);
        
        const isUniform = stats.isUniformDistribution(results, trials, options.length, 0.01);
        assert.ok(isUniform, 'Distribution should be reasonably uniform');
    });
    
    TestRunner.it('should work with more than 2 options', () => {
        const engine = new CoinsEngine();
        const options = ['One', 'Two', 'Three', 'Four'];
        const trials = 400;
        const results = engine.runTrials(options, trials);
        
        options.forEach(opt => {
            assert.ok(results[opt] > 0, `Option ${opt} should have some wins`);
        });
    });
    
    TestRunner.it('should calculate required coin flips correctly', () => {
        const engine = new CoinsEngine();
        assert.equal(engine.getRequiredFlips(2), 1);
        assert.equal(engine.getRequiredFlips(3), 2);
        assert.equal(engine.getRequiredFlips(4), 2);
        assert.equal(engine.getRequiredFlips(5), 3);
        assert.equal(engine.getRequiredFlips(8), 3);
        assert.equal(engine.getRequiredFlips(9), 4);
    });
    
});
