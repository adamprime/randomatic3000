// Tests for DiceEngine

TestRunner.describe('DiceEngine', () => {
    
    TestRunner.it('should be defined', () => {
        assert.ok(typeof DiceEngine !== 'undefined', 'DiceEngine should exist');
    });
    
    TestRunner.it('should extend BaseEngine', () => {
        const engine = new DiceEngine();
        assert.ok(engine instanceof BaseEngine);
    });
    
    TestRunner.it('should have correct name and id', () => {
        const engine = new DiceEngine();
        assert.equal(engine.name, 'Dice Roll');
        assert.equal(engine.id, 'dice');
    });
    
    TestRunner.it('pick should return valid option', () => {
        const engine = new DiceEngine();
        const options = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
        for (let i = 0; i < 30; i++) {
            const result = engine.pick(options);
            assert.includes(options, result);
        }
    });
    
    TestRunner.it('shuffle should return valid array', () => {
        const engine = new DiceEngine();
        const options = ['A', 'B', 'C'];
        const result = engine.shuffle(options);
        assert.hasLength(result, options.length);
        assert.sameMembers(result, options);
    });
    
    TestRunner.it('should produce reasonably uniform distribution', () => {
        const engine = new DiceEngine();
        const options = ['1', '2', '3', '4', '5', '6'];
        const trials = 600;
        const results = engine.runTrials(options, trials);
        
        const isUniform = stats.isUniformDistribution(results, trials, options.length, 0.01);
        assert.ok(isUniform, 'Distribution should be reasonably uniform');
    });
    
    TestRunner.it('should work with more than 6 options using multiple dice', () => {
        const engine = new DiceEngine();
        const options = Array.from({length: 12}, (_, i) => `Opt${i}`);
        const result = engine.pick(options);
        assert.includes(options, result);
    });
    
});
