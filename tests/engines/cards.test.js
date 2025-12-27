// Tests for CardsEngine

TestRunner.describe('CardsEngine', () => {
    
    TestRunner.it('should be defined', () => {
        assert.ok(typeof CardsEngine !== 'undefined', 'CardsEngine should exist');
    });
    
    TestRunner.it('should extend BaseEngine', () => {
        const engine = new CardsEngine();
        assert.ok(engine instanceof BaseEngine);
    });
    
    TestRunner.it('should have correct name and id', () => {
        const engine = new CardsEngine();
        assert.equal(engine.name, 'Card Shuffle');
        assert.equal(engine.id, 'cards');
    });
    
    TestRunner.it('pick should return valid option', () => {
        const engine = new CardsEngine();
        const options = ['Ace', 'King', 'Queen', 'Jack'];
        for (let i = 0; i < 20; i++) {
            const result = engine.pick(options);
            assert.includes(options, result);
        }
    });
    
    TestRunner.it('shuffle should return valid array', () => {
        const engine = new CardsEngine();
        const options = ['A', 'B', 'C', 'D', 'E'];
        const result = engine.shuffle(options);
        assert.hasLength(result, options.length);
        assert.sameMembers(result, options);
    });
    
    TestRunner.it('should produce reasonably uniform distribution', () => {
        const engine = new CardsEngine();
        const options = ['A', 'B', 'C', 'D'];
        const trials = 400;
        const results = engine.runTrials(options, trials);
        
        const isUniform = stats.isUniformDistribution(results, trials, options.length, 0.01);
        assert.ok(isUniform, 'Distribution should be reasonably uniform');
    });
    
    TestRunner.it('shuffle should produce different orderings', () => {
        const engine = new CardsEngine();
        const options = ['A', 'B', 'C', 'D', 'E'];
        const orderings = new Set();
        
        for (let i = 0; i < 50; i++) {
            orderings.add(JSON.stringify(engine.shuffle(options)));
        }
        
        assert.ok(orderings.size > 5, 'Should produce multiple different orderings');
    });
    
});
