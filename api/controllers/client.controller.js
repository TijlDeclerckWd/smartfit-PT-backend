/*  ==================
 *  -- CLIENT METHODS --
 *  ==================
 */


const hasPickedTrainer = (req, res) => {
    console.log('req.userId', req.userId);

    res.status(200).json({
        hasPickedTrainer: true,
        userId: 'dfnjdnfjdnfjnfje'
    })
};


module.exports = {
    hasPickedTrainer
};
