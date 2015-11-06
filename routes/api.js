import * as animal from '../services/animal';

router.post('/animal', function(req, res, next) {
    animal.create()
});
