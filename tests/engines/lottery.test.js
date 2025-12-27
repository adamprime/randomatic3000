// Tests for LotteryEngine

TestRunner.describe('LotteryEngine', () => {
    
    TestRunner.it('should be defined', () => {
        assert.ok(typeof LotteryEngine !== 'undefined', 'LotteryEngine should exist');
    });
    
    TestRunner.it('should extend BaseEngine', () => {
        const engine = new LotteryEngine();
        assert.ok(engine instanceof BaseEngine);
    });
    
    TestRunner.it('should have correct name and id', () => {
        const engine = new LotteryEngine();
        assert.equal(engine.name, 'Lottery Balls');
        assert.equal(engine.id, 'lottery');
    });
    
    TestRunner.it('pick should return valid option', () => {
        const engine = new LotteryEngine();
        const options = ['Ball 1', 'Ball 2', 'Ball 3'];
        for (let i = 0; i < 20; i++) {
            const result = engine.pick(options);
            assert.includes(options, result);
        }
    });
    
    TestRunner.it('shuffle should return valid array', () => {
        const engine = new LotteryEngine();
        const options = ['A', 'B', 'C', 'D'];
        const result = engine.shuffle(options);
        assert.hasLength(result, options.length);
        assert.sameMembers(result, options);
    });
    
    TestRunner.it('should produce reasonably uniform distribution', () => {
        const engine = new LotteryEngine();
        const options = ['1', '2', '3', '4', '5'];
        const trials = 500;
        const results = engine.runTrials(options, trials);
        
        const isUniform = stats.isUniformDistribution(results, trials, options.length, 0.01);
        assert.ok(isUniform, 'Distribution should be reasonably uniform');
    });
    
    TestRunner.it('should have ball colors', () => {
        const engine = new LotteryEngine();
        assert.ok(Array.isArray(engine.ballColors), 'Should have ballColors array');
        assert.ok(engine.ballColors.length >= 10, 'Should have at least 10 colors');
    });
    
});
