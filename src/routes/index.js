const { Router } = require('express');
const Subscriber = require('../models/subscriber');

const router = Router();

/**
 * @description returns subscriber object
 */
async function getSubscriber(request, response, next) {
  try {
    const subscriber = await Subscriber.findById(request.params.id);
    if (subscriber == null) {
      return response.status(404).json({ error: 'can\'t find subscriber' });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }

  response.subscriber = subscriber;
  next();
}

router.get('/', async (request, response) => {
  try {
    const subscribers = await Subscriber.find();
    response.json(subscribers);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.get('/:id', getSubscriber, async (request, response) => {
  response.json(response.subscriber);
});

router.post('/', async (request, response) => {
  const subscriber = new Subscriber({
    name: request.body.name,
    subscribedChannel: request.body.subscribedChannel
  });

  try {
    const newSubscriber = await subscriber.save();
    response.status(201).json(newSubscriber);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

router.patch('/:id', getSubscriber, async (request, response) => {
  if (request.body.name != null) {
    response.subscriber.name = request.body.name;
  }
  if (request.body.subscribedChannel != null) {
    response.subscriber.subscribedChannel = request.body.subscribedChannel;
  }

  try {
    const updatedSubscriber = await response.subscriber.save();
    response.json(updatedSubscriber);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

router.delete('/:id', getSubscriber, async (request, response) => {
  try {
    await response.subscriber.remove();
    response.json({ message: 'subscriber deleted' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;
