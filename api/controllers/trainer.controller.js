const { Trainer, Request, Update, Client, Workout } = require('../models');

const {
    sendErr
} = require('../../utils');


/*  =====================
 *  -- TRAINER METHODS --
 *  =====================
 */

const getProfile = async (req, res) => {
    try {
        const { trainerId } = req.params;

        // find the specific trainer
        // we should probably decrease the amount of fields that we will select and return to frontend
        const trainer  = await Trainer.findOne({ _id: trainerId });

        res.status(200).json({
            trainer
        })
    } catch(err) {
        sendErr(res, err);
    }
};

const getAllUpdates = async (req, res) => {
    try {
        const {userId} = req;

        const trainer = await Trainer.findOne({_id: userId})
            .populate([
                {
                path: 'updates',
                populate: {
                    path: 'request'
                }
            },
                {
                  path: 'clients'
                }]);

        res.status(200).json({
            trainer
        });
    } catch (err) {
        sendErr(res, err);
    }
};

const handleRequestResponse = async (req, res) => {
    try {
        const { request, response } = req.body;

        const requestToUpdate = await Request.findOne({ _id: request._id });

        if (!requestToUpdate || !requestToUpdate.active) {
            sendErr(res, err, "This request is no longer active");
        }

        switch(requestToUpdate.type) {
            case 'hire':
                // think about renaming these variables because they're too similar to the res, req ones.
                await handleHireRequest(requestToUpdate, response);
                break;
        }

        res.status(200).json({
            message: "Succesfully handled the request response"
        })
    } catch (err) {
        sendErr(res, err);
    }
};

const handleHireRequest = async (request, response) => {
// so here we want to check whether the response was positive or negative
    if (response === 'confirm') {

    //     we create a new trainer/client relationship by adding the client to the trainer doc
    await Trainer.findOneAndUpdate({ _id: request.trainer },
        {
            $addToSet: { clients: request.client}
        });

    // we add the trainer to client's trainer property
    await Client.findOneAndUpdate({ _id: request.client },
        {
        $addToSet: { trainers: request.trainer }
        });

    //     and then eventually remove this request document because it has been handled
        await Request.remove({ _id: request._id });

    // and remove the update document as well. this way it won't show up in the feed
        await Update.remove({ request: request._id });


    //    and remove the update from the trainer document
        const trainerToUpdate = await Trainer.findOne({ _id: request.trainer }).populate('updates');

    // remove the update that requests the trainer bussiness relationship
        trainerToUpdate.updates = trainerToUpdate.updates.filter((update) => update.request !== request._id);

    //    save the trainer again
        trainerToUpdate.save();

    } else {
    //  we create a new update that notifies the client that their request has been denied
    //    this update will then be shown on their feed

    //     eventually remove the request document
    }
};

const loadClientSchedule = async (req, res) => {
    try {
        const { clientId} = req.params;

        const workouts = await Workout.find({
            $and: [
                { client: clientId },
                { trainer: req.userId },
                { complete: false },
                { date: { $gt: Date.now() }}
            ]
        }).populate('exercises');

        res.status(200).json({
            message: 'succesfully retrieved the schedule of the client',
            workouts
        })
    } catch(err) {
        sendErr(res, err);
    }
};

const loadClientUpdates = async (req, res) => {
  try {
      const { clientId } = req.params;

      const updates = await Update.find({ type: 'workout complete', client: clientId, updateFrom: 'client'})
          .populate('workout client trainer');

      res.status(200).json({
          message: "SuccessFully retrieved client updates",
          updates
      })
  }  catch(err) {
      sendErr(res, err);
  }
};

const uploadProfilePic = async (req, res) => {
    try {

        console.log('filename', req.file.filename);

        // we willen de filename opslaan als het profilePic property
        const updatedTrainer = await Trainer.findOneAndUpdate(
            { _id: req.userId },
            { profile_pic: req.file.filename }
        );

        console.log('updatedTrainer', updatedTrainer);

        res.status(200).json({
            message: "successfully uploaded the profile picture",
            updatedTrainer
        });
    } catch (err) {
        sendErr(res, err);
    }
};



module.exports = {
    getAllUpdates,
    getProfile,
    handleRequestResponse,
    loadClientSchedule,
    loadClientUpdates,
    uploadProfilePic
};
