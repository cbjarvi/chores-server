const Postgres = require('../Postgres');

const createWheel = async (req, res) => {
  const title = req.body.title;
  if (!title){
    res.status(400);
    res.json({ message: 'Missing title' });

    return;
  }
  if ('string' !== typeof title){
    res.status(400);
    res.json({ message: 'title must be a string' });

    return;
  }
  const turnList = req.body.turnList;
  if (!turnList) {
    res.status(400);
    res.json({ message: 'Missing turnList' });

    return;
  }
  const ownerId = req.body.ownerId;
  if (!ownerId) {
    res.status(400);
    res.json({ message: 'Missing ownerId' });

    return;
  }
  const isVisible = req.body.isVisible;
  if (!isVisible) {
    res.status(400);
    res.json({ message: 'Missing isVisible' });

    return;
  }

  let result;
  try {
    const priority = await Postgres.Wheels.getNextPriority();
    result = await Postgres.Wheels.insert({ ownerId, title, turnList, isVisible, priority });
  } catch (error) {
    console.error(
      'Error inserting wheel into DB. error=' + error.message + ', '
      + 'title=' + title + ', turnList=' + turnList.join()
    );
    res.status(500);
    res.json({ message: 'Error creating wheel' });

    return;
  }

  console.log('Inserted wheel into DB. wheelId=' + result.id);
  res.status(200);
  res.json(result);
};

module.exports = createWheel;
