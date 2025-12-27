// Tests for WheelEngine

TestRunner.describe('WheelEngine', () => {
    
    TestRunner.it('should be defined', () => {
        assert.ok(typeof WheelEngine !== 'undefined', 'WheelEngine should exist');
    });
    
    TestRunner.it('should extend BaseEngine', () => {
        const engine = new WheelEngine();
        assert.ok(engine instanceof BaseEngine);
    });
    
    TestRunner.it('should have correct name and id', () => {
        const engine = new WheelEngine();
        assert.equal(engine.name, 'Wheel Spin');
        assert.equal(engine.id, 'wheel');
    });
    
    TestRunner.it('pick should return valid option', () => {
        const engine = new WheelEngine();
        const options = ['Red', 'Blue', 'Green'];
        for (let i = 0; i < 20; i++) {
            const result = engine.pick(options);
            assert.includes(options, result);
        }
    });
    
    TestRunner.it('shuffle should return valid array', () => {
        const engine = new WheelEngine();
        const options = ['1', '2', '3', '4'];
        const result = engine.shuffle(options);
        assert.hasLength(result, options.length);
        assert.sameMembers(result, options);
    });
    
    TestRunner.it('should produce reasonably uniform distribution', () => {
        const engine = new WheelEngine();
        const options = ['A', 'B', 'C', 'D'];
        const trials = 400;
        const results = engine.runTrials(options, trials);
        
        const isUniform = stats.isUniformDistribution(results, trials, options.length, 0.01);
        assert.ok(isUniform, 'Distribution should be reasonably uniform');
    });
    
    TestRunner.it('should have getWheelColors method', () => {
        const engine = new WheelEngine();
        assert.equal(typeof engine.getWheelColors, 'function');
    });
    
});
